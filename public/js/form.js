document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('applicationForm');
  const submitBtn = document.getElementById('submitBtn');
  const formCard = document.getElementById('formCard');
  const resultCard = document.getElementById('resultCard');
  const errorMessage = document.getElementById('errorMessage');
  
  // Set min dates for travel dates
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('intendedArrivalDate').min = today;
  document.getElementById('intendedDepartureDate').min = today;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset error state
    errorMessage.classList.remove('show');
    
    // Show loading state
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
    
    // Validate dates
    if (new Date(formData.intendedDepartureDate) <= new Date(formData.intendedArrivalDate)) {
      showError('Departure date must be after arrival date');
      resetButton();
      return;
    }
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Show success result
        document.getElementById('qrCodeImage').src = result.data.qrCodeDataUrl;
        document.getElementById('referenceNumber').textContent = result.data.referenceNumber;
        
        formCard.style.display = 'none';
        resultCard.classList.add('show');
      } else {
        showError(result.message || 'Submission failed. Please try again.');
        resetButton();
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      showError('Network error. Please check your connection and try again.');
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
});
