const Application = require('../models/Application');
const generateRefNumber = require('../utils/generateRefNumber');
const generateQRCode = require('../utils/generateQR');
const { generateVerificationToken } = require('../utils/crypto');

/**
 * @desc    Submit a new application
 * @route   POST /api/applications
 * @access  Public
 */
const submitApplication = async (req, res) => {
  try {
    const {
      fullName,
      passportNumber,
      nationality,
      dateOfBirth,
      gender,
      email,
      phone,
      visaCategory,
      entryType,
      purposeOfVisit,
      intendedArrivalDate,
      intendedDepartureDate
    } = req.body;
    
    // Generate unique reference number
    let referenceNumber = generateRefNumber();
    
    // Ensure uniqueness (retry if collision)
    let exists = await Application.findOne({ referenceNumber });
    while (exists) {
      referenceNumber = generateRefNumber();
      exists = await Application.findOne({ referenceNumber });
    }
    
    // Generate QR code
    const { qrCodeDataUrl, verificationUrl } = await generateQRCode(referenceNumber);
    
    // Generate security token
    const verificationToken = generateVerificationToken();
    
    // Create application
    const application = await Application.create({
      referenceNumber,
      fullName,
      passportNumber,
      nationality,
      dateOfBirth,
      gender,
      email,
      phone,
      visaCategory,
      entryType,
      purposeOfVisit,
      intendedArrivalDate,
      intendedDepartureDate,
      qrCodeDataUrl,
      verificationUrl,
      verificationToken
    });
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        referenceNumber: application.referenceNumber,
        qrCodeDataUrl: application.qrCodeDataUrl,
        verificationUrl: application.verificationUrl,
        status: application.status,
        submittedAt: application.createdAt
      }
    });
    
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Verify application by reference number
 * @route   GET /api/verify/:referenceNumber
 * @access  Public
 */
const verifyApplication = async (req, res) => {
  try {
    const { referenceNumber } = req.params;
    
    // Validate reference number format
    if (!referenceNumber || !referenceNumber.match(/^VIS-\d{4}-[A-Z0-9]{6}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reference number format'
      });
    }
    
    const application = await Application.findOne({ 
      referenceNumber,
      isActive: true 
    });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or has been deactivated'
      });
    }
    
    // Update verification stats
    application.verificationCount += 1;
    application.lastVerifiedAt = new Date();
    await application.save();
    
    // Return verified data (exclude sensitive fields)
    res.status(200).json({
      success: true,
      message: 'Application verified successfully',
      verified: true,
      data: {
        referenceNumber: application.referenceNumber,
        fullName: application.fullName,
        passportNumber: maskPassport(application.passportNumber),
        nationality: application.nationality,
        dateOfBirth: application.dateOfBirth,
        gender: application.gender,
        visaCategory: application.visaCategory,
        entryType: application.entryType,
        purposeOfVisit: application.purposeOfVisit,
        intendedArrivalDate: application.intendedArrivalDate,
        intendedDepartureDate: application.intendedDepartureDate,
        status: application.status,
        submittedAt: application.createdAt,
        verificationCount: application.verificationCount
      }
    });
    
  } catch (error) {
    console.error('Verify application error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Masks passport number for privacy
 * Shows first 2 and last 2 characters
 */
const maskPassport = (passport) => {
  if (passport.length <= 4) return passport;
  const start = passport.substring(0, 2);
  const end = passport.substring(passport.length - 2);
  const masked = '*'.repeat(passport.length - 4);
  return `${start}${masked}${end}`;
};

module.exports = {
  submitApplication,
  verifyApplication
};
