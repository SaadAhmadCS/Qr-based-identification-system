document.addEventListener('DOMContentLoaded', () => {
  const loadingState = document.getElementById('loadingState');
  const verifiedResult = document.getElementById('verifiedResult');
  const errorState = document.getElementById('errorState');
  const manualVerifyBtn = document.getElementById('manualVerifyBtn');
  const manualRefInput = document.getElementById('manualRef');
  
  // Get reference number from URL
  const urlParams = new URLSearchParams(window.location.search);
  const refNumber = urlParams.get('ref');
  
  if (refNumber) {
    verifyApplication(refNumber);
  } else {
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
    document.getElementById('errorText').textContent = 'No reference number provided';
  }
  
  // Manual verification
  manualVerifyBtn.addEventListener('click', () => {
    const ref = manualRefInput.value.trim();
    if (ref) {
      window.location.href = `/verify.html?ref=${encodeURIComponent(ref)}`;
    }
  });
  
  manualRefInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      manualVerifyBtn.click();
    }
  });
  
  async function verifyApplication(referenceNumber) {
    try {
      const response = await fetch(`/api/verify/${encodeURIComponent(referenceNumber)}`);
      const result = await response.json();
      
      loadingState.style.display = 'none';
      
      if (result.success && result.verified) {
        displayVerifiedData(result.data);
        verifiedResult.style.display = 'block';
      } else {
        errorState.style.display = 'block';
        document.getElementById('errorText').textContent = result.message || 'Application not found';
      }
      
    } catch (error) {
      console.error('Verification error:', error);
      loadingState.style.display = 'none';
      errorState.style.display = 'block';
      document.getElementById('errorText').textContent = 'Network error. Please try again.';
    }
  }
  
  function displayVerifiedData(data) {
    // Update status badge
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    
    statusBadge.className = 'verify-status';
    switch (data.status) {
      case 'Approved':
        statusBadge.classList.add('verified');
        statusText.textContent = '✓ Approved';
        break;
      case 'Rejected':
        statusBadge.classList.add('rejected');
        statusText.textContent = '✗ Rejected';
        break;
      default:
        statusBadge.classList.add('pending');
        statusText.textContent = '⏳ ' + data.status;
    }
    
    // Build detail items
    const details = [
      { label: 'Reference Number', value: data.referenceNumber },
      { label: 'Full Name', value: data.fullName },
      { label: 'Passport Number', value: data.passportNumber },
      { label: 'Nationality', value: data.nationality },
      { label: 'Date of Birth', value: formatDate(data.dateOfBirth) },
      { label: 'Gender', value: data.gender },
      { label: 'Visa Category', value: data.visaCategory },
      { label: 'Entry Type', value: data.entryType },
      { label: 'Purpose of Visit', value: data.purposeOfVisit },
      { label: 'Arrival Date', value: formatDate(data.intendedArrivalDate) },
      { label: 'Departure Date', value: formatDate(data.intendedDepartureDate) },
      { label: 'Submitted On', value: formatDateTime(data.submittedAt) }
    ];
    
    const detailGrid = document.getElementById('detailGrid');
    detailGrid.innerHTML = details.map(d => `
      <div class="detail-item">
        <span class="detail-label">${d.label}</span>
        <span class="detail-value">${d.value || '-'}</span>
      </div>
    `).join('');
    
    // Update footer stats
    document.getElementById('verifyCount').textContent = data.verificationCount || 0;
    document.getElementById('lastVerified').textContent = 'Just now';
  }
  
  function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function formatDateTime(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
});
