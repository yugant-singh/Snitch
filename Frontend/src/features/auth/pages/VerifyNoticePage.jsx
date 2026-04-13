import React from 'react';
import './VerifyNoticePage.scss';

function VerifyNoticePage() {
const handleOpenInbox = (e) => {
  e.preventDefault(); // Browser ki default action ko roko
  
  // Test ke liye hardcoded email use karo
  const testEmail = "yugantsinh9651@gmail.com"; 
  const domain = testEmail.split('@')[1];

  console.log("Domain detected:", domain);

  if (domain === 'gmail.com') {
    window.open('https://mail.google.com', '_blank');
  } else {
    // Agar Gmail nahi hai toh Outlook ya normal mailto
    window.open('https://outlook.live.com', '_blank');
  }
};

  const getTimestamp = () => {
    const now = new Date();
    // Example: TIMESTAMP: 2024-05-22 14:35:11 UTC
    return `TIMESTAMP: ${now.toISOString().split('T')[0]} ${now.toISOString().split('T')[1].split('.')[0]} UTC`;
  };

  return (
    <div className="vn-wrapper">
      <div className="vn-watermark">SNITCH</div>
      
      <div className="vn-corner vn-corner--tr">{getTimestamp()}</div>
      <div className="vn-corner vn-corner--bl">ID: VERIFY_SECURE</div>
      <div className="vn-corner vn-corner--br">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" />
        </svg>
      </div>

      <div className="vn-card">
        <div className="vn-icon-wrapper">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.4 20.4L20.85 13.6C21.6 13.3 21.6 12.2 20.85 11.9L3.4 5.1C2.7 4.8 2 5.4 2.25 6.1L4.5 12L2.25 17.9C2 18.6 2.7 19.2 3.4 18.9ZM4.5 12H11.5" />
          </svg>
        </div>
        <h1 className="vn-title">VERIFICATION SENT</h1>
        <p className="vn-message">
          We've dispatched a secure link to your inbox. Activate your account to join the circle.
        </p>
       <button 
  type="button" // Sabse important: taaki ye form submit na kare
  className="vn-btn" 
  onClick={(e) => handleOpenInbox(e)}
>
  OPEN INBOX
</button>
      </div>
    </div>
  );
}

export default VerifyNoticePage;