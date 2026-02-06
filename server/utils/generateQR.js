const QRCode = require('qrcode');

/**
 * Generates a QR code containing the verification URL
 * @param {string} referenceNumber - The application reference number
 * @returns {Promise<Object>} - QR code data URL and verification URL
 */
const generateQRCode = async (referenceNumber) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify.html?ref=${referenceNumber}`;
  
  const options = {
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#1a1a2e',   // QR code color
      light: '#ffffff'   // Background color
    },
    errorCorrectionLevel: 'H'  // High error correction
  };
  
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, options);
  
  return {
    qrCodeDataUrl,
    verificationUrl
  };
};

module.exports = generateQRCode;
