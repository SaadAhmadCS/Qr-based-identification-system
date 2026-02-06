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
    .isLength({ max: 100 }).withMessage('Full name too long'),
  body('passportNumber')
    .trim()
    .notEmpty().withMessage('Passport number is required')
    .isLength({ max: 20 }).withMessage('Passport number too long'),
  body('nationality')
    .trim()
    .notEmpty().withMessage('Nationality is required'),
  body('dateOfBirth')
    .isISO8601().withMessage('Valid date of birth required'),
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
