const crypto = require('crypto');

/**
 * Generates a secure verification token
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Creates a hash for sensitive data
 */
const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = {
  generateVerificationToken,
  hashData
};
