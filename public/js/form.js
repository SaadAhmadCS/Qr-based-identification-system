

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('applicationForm');
  const submitBtn = document.getElementById('submitBtn');
  const formCard = document.getElementById('formCard');
  const resultCard = document.getElementById('resultCard');
  const errorMessage = document.getElementById('errorMessage');
  const downloadBtn = document.getElementById('downloadBtn');

  // Set min dates for travel dates
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('intendedArrivalDate').min = today;
  document.getElementById('intendedDepartureDate').min = today;

  // QR Code download handler (CSP-compliant)
  downloadBtn.addEventListener('click', downloadQRCode);

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorMessage.classList.remove('show');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner"></div><span>Submitting...</span>';

    // Collect form data
    const formData = {
      fullName: document.getElementById('fullName').value.trim(),
      passportNumber: document.getElementById('passportNumber').value.trim().toUpperCase(),
      nationality: document.getElementById('nationality').value.trim(),
      dateOfBirth: document.getElementById('dateOfBirth').value,
      gender: document.getElementById('gender').value,
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      visaCategory: document.getElementById('visaCategory').value,
      entryType: document.getElementById('entryType').value,
      purposeOfVisit: document.getElementById('purposeOfVisit').value.trim(),
      intendedArrivalDate: document.getElementById('intendedArrivalDate').value,
      intendedDepartureDate: document.getElementById('intendedDepartureDate').value
    };

    // Validate all fields
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        showError(`${key.replace(/([A-Z])/g, ' $1')} is required`);
        resetButton();
        return;
      }
    }

    // Validate dates
    if (new Date(formData.intendedDepartureDate) <= new Date(formData.intendedArrivalDate)) {
      showError('Departure date must be after arrival date');
      resetButton();
      return;
    }

    //Validate DOB
    if (new Date(formData.intendedDepartureDate) <= new Date(formData.dateOfBirth)) {
      showError('Date of Birth must be before arrival date');
      resetButton();
      return;
    }

    // Validate POV
    if (formData.purposeOfVisit.length < 5 || formData.purposeOfVisit.length > 50) {
      showError('Purpose of visit must be between 5 to 50 characters');
      resetButton();
      return;
    }


    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      showError('Please enter a valid email address');
      resetButton();
      return;
    }


    // Validate phone number
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phone)) {
      showError('Please enter a valid phone number with country code (e.g., +923001234567)');
      resetButton();
      return;
    }

    // Validate passport number
    const passportRegex = /^(?=.*[A-Z])[A-Z0-9]{6,9}$/;

    if (!passportRegex.test(formData.passportNumber)) {
      showError('Invalid passport number format');
      resetButton();
      return;
    }



    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errRes = await response.json().catch(() => ({}));
        throw new Error(errRes.message || `Server error ${response.status}`);
      }

      const result = await response.json();

      // Show success result
      // After form submission success
      document.getElementById('qrCodeImage').src = result.data.qrCodeDataUrl;
      document.getElementById('referenceNumber').textContent = result.data.referenceNumber;
      formCard.style.display = 'none';
      resultCard.classList.add('show');

      // Attach download handler now, when button exists
      document.addEventListener('DOMContentLoaded', () => {
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.addEventListener('click', downloadQRCode);
      });


    } catch (error) {
      console.error('Submission error:', error);
      showError(error.message || 'Network error. Please try again.');
      resetButton();
    }
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
  }

  function resetButton() {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit Application</span>';
  }

  // QR code download function
  function downloadQRCode() {
    const qrImage = document.getElementById('qrCodeImage');
    const refNumber = document.getElementById('referenceNumber').textContent.trim();

    if (!qrImage || !qrImage.src || qrImage.src === '' || qrImage.src === window.location.href) {
      alert('QR Code not available. Please submit an application first.');
      return;
    }

    const link = document.createElement('a');

    if (qrImage.src.startsWith('http')) {
      fetch(qrImage.src)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.download = `${refNumber}-qrcode.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        })
        .catch(err => {
          console.error('Error downloading QR code:', err);
          alert('Failed to download QR code. Try again.');
        });
    } else {
      link.href = qrImage.src;
      link.download = `${refNumber}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
});
