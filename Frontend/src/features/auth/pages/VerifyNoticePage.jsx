import React from 'react';
import './VerifyNoticePage.scss';
import { useLocation } from "react-router-dom";

function VerifyNoticePage() {
  const location = useLocation();
  
  const userEmail = location.state?.email;
  if (!userEmail) {
  return <h2>Please register first</h2>;
}

const getEmailProvider = (email) => {
  if (!email || !email.includes("@")) return null;

  const domain = email.split("@")[1];

  if (domain.includes("gmail")) return "https://mail.google.com";
  if (domain.includes("outlook") || domain.includes("hotmail")) return "https://outlook.live.com";
  if (domain.includes("yahoo")) return "https://mail.yahoo.com";

  return null;
};
const handleOpenInbox = () => {
  const url = getEmailProvider(userEmail);

  if (url) {
    window.location.href = url; // 🔥 SAME TAB
  } else {
    window.location.href = "https://mail.google.com"; // fallback
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
         We sent a verification link to <b>{userEmail}</b>.Please  activate your account to join the circle.
        </p>
 
 <button 
  type="button"
  className="vn-btn" 
  onClick={handleOpenInbox}
>
  OPEN INBOX
</button>
      </div>
    </div>
  );
}

export default VerifyNoticePage;