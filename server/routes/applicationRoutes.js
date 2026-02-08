const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { submitApplication, verifyApplication } = require('../controllers/applicationController');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules for application submission
const applicationValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ max: 100 }).withMessage('Full name too long')
    .custom((value) => {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        throw new Error('Full name must contain letters only');
      }
      return true;
    }),
  body('passportNumber')
    .trim()
    .notEmpty().withMessage('Passport number is required')
    .isLength({ max: 20 }).withMessage('Passport number too long'),
  body('nationality')
    .trim()
    .notEmpty().withMessage('Nationality is required')
    .custom((value) => {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        throw new Error('Nationality must contain letters only');
      }
      return true;
    }),
  body('dateOfBirth')
    .isISO8601().withMessage('Valid date of birth required')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dob >= today) {
        throw new Error('Date of birth cannot be in the future');
      }
      return true;
    }),
  body('gender')
    .isIn(['Male', 'Female', 'Other']).withMessage('Valid gender required'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email required'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('visaCategory')
    .isIn(['Tourist', 'Business', 'Work', 'Student', 'Transit', 'Medical'])
    .withMessage('Valid visa category required'),
  body('entryType')
    .optional()
    .isIn(['Single', 'Multiple']).withMessage('Valid entry type required'),
  body('purposeOfVisit')
    .trim()
    .notEmpty().withMessage('Purpose of visit is required')
    .isLength({ max: 500 }).withMessage('Purpose too long'),
  body('intendedArrivalDate')
    .isISO8601().withMessage('Valid arrival date required'),
  body('intendedDepartureDate')
    .isISO8601().withMessage('Valid departure date required')
    .custom((value, { req }) => {
      const departure = new Date(value);
      const arrival = new Date(req.body.intendedArrivalDate);
      if (departure <= arrival) {
        throw new Error('Departure date must be after arrival date');
      }
      return true;
    })
];

// Routes
router.post(
  '/applications',
  applicationValidation,
  handleValidationErrors,
  submitApplication
);

router.get(
  '/verify/:referenceNumber',
  param('referenceNumber').trim().notEmpty(),
  handleValidationErrors,
  verifyApplication
);

module.exports = router;
