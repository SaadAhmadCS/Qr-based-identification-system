const { v4: uuidv4 } = require('uuid');

/**
 * Generates a unique reference number
 * Format: VIS-YYYY-XXXXXX (e.g., VIS-2026-A3B2C1)
 */
const generateRefNumber = () => {
  const year = new Date().getFullYear();
  const uniquePart = uuidv4().split('-')[0].toUpperCase().substring(0, 6);
  return `VIS-${year}-${uniquePart}`;
};

module.exports = generateRefNumber;
