const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Unique reference number (e.g., VIS-2026-XXXXXX)
  referenceNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Personal Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: 100
  },
  passportNumber: {
    type: String,
    required: [true, 'Passport number is required'],
    trim: true,
    uppercase: true,
    maxlength: 20
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  
  // Visa Details
  visaCategory: {
    type: String,
    enum: ['Tourist', 'Business', 'Work', 'Student', 'Transit', 'Medical'],
    required: true
  },
  entryType: {
    type: String,
    enum: ['Single', 'Multiple'],
    default: 'Single'
  },
  purposeOfVisit: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // Travel Dates
  intendedArrivalDate: {
    type: Date,
    required: true
  },
  intendedDepartureDate: {
    type: Date,
    required: true
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  
  // QR Code Data
  qrCodeDataUrl: {
    type: String  // Base64 encoded QR code image
  },
  verificationUrl: {
    type: String  // Full URL for verification
  },
  
  // Security & Audit
  verificationToken: {
    type: String,  // Additional security token
    select: false  // Not returned in queries by default
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verificationCount: {
    type: Number,
    default: 0  // Track how many times verified
  },
  lastVerifiedAt: {
    type: Date
  }
}, {
  timestamps: true  // createdAt, updatedAt
});

// Indexes for faster queries
applicationSchema.index({ passportNumber: 1 });
applicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
