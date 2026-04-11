import React, { use, useState } from "react";
import "./Register.scss";
import {useAuth} from '../hook/useAuth'
import {useNavigate} from 'react-router-dom'

/* ─── Component ─────────────────────────────────────────────────── */
const Register = () => {
  const {handleRegister} = useAuth()
  const navigate  = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    contact: "",
    isSeller: false,
  });

  const [focused, setFocused] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  /* Two-way binding handler */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFocus = (name) => setFocused((prev) => ({ ...prev, [name]: true }));
  const handleBlur = (name) =>
    setFocused((prev) => ({ ...prev, [name]: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({
      email:formData.email,
      contact:formData.contact,
      password:formData.password,
      fullName:formData.fullName,
      isSeller:formData.isSeller
    })

    navigate('/verify')
  };

  const handleGoogleAuth = () => {
    console.log("Google OAuth triggered");
  };

  return (
    <div className="rp-wrapper">
      {/* ══════════════════ LEFT — EDITORIAL ══════════════════ */}
      <div className="rp-left" aria-hidden="true">
        
        {/* Main Background Image */}
        <div className="editorial-bg">
          <img 
            src="https://images.unsplash.com/photo-1734936870358-913ec30683b6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Streetwear Look" 
            className="editorial-img"
          />
        </div>

        {/* Overlay to ensure text readability */}
        <div className="editorial-overlay" />

        {/* Content Container */}
        <div className="editorial-content">
          <p className="brand-subheading">UNAPOLOGETICALLY TRENDY. EXCLUSIVELY YOURS.</p>
          <div className="brand-wordmark">
            <span className="wordmark-text">SNITCH</span>
          </div>
        </div>

        {/* Inset Image for modern asymmetric editorial look */}
        <div className="editorial-inset">
          <img 
            src="https://plus.unsplash.com/premium_photo-1675186049366-64a655f8f537?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Fabric detail" 
            className="inset-img"
          />
          <div className="inset-meta">
            <span className="inset-label">DETAIL_01</span>
          </div>
        </div>

        {/* Bottom metadata bar */}
        <div className="left-meta-bar">
          <span className="meta-item">SS — 2025</span>
          <span className="meta-dot" />
          <span className="meta-item">STREETWEAR COLLECTION</span>
          <span className="meta-dot" />
          <span className="meta-item">© SNITCH.CO.IN</span>
        </div>
      </div>

      {/* ══════════════════ RIGHT — FORM ══════════════════ */}
      <div className="rp-right">
        <div className="form-panel">
          {/* Header */}
          <div className="form-header">
            <p className="form-eyebrow">NEW MEMBER</p>
            <h1 className="form-heading">
              CREATE  ACCOUNT
            </h1>
          </div>

          {/* Form */}
          <form className="reg-form" onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className={`fg ${focused.fullName || formData.fullName ? "fg--active" : ""}`}>
              <label htmlFor="fullName" className="fg-label">FULL NAME</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => handleFocus("fullName")}
                onBlur={() => handleBlur("fullName")}
                className="fg-input"
                autoComplete="name"
                required
              />
              <span className="fg-bar" />
            </div>

            {/* Email */}
            <div className={`fg ${focused.email || formData.email ? "fg--active" : ""}`}>
              <label htmlFor="email" className="fg-label">EMAIL</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                className="fg-input"
                autoComplete="email"
                required
              />
              <span className="fg-bar" />
            </div>

            {/* Password */}
            <div className={`fg ${focused.password || formData.password ? "fg--active" : ""}`}>
              <label htmlFor="password" className="fg-label">PASSWORD</label>
              <div className="fg-row">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                  className="fg-input"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 3l18 18M10.5 10.677A3 3 0 0013.323 13.5M6.362 6.226C4.496 7.388 3 9.05 3 12c0 3 3.134 7 9 7 1.63 0 3.054-.397 4.27-1.05M9.879 4.243A9.16 9.16 0 0112 5c5.866 0 9 4 9 7 0 1.07-.322 2.108-.944 3.046" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
              <span className="fg-bar" />
            </div>

            {/* Contact Number */}
            <div className={`fg ${focused.contactNumber || formData.contactNumber ? "fg--active" : ""}`}>
              <label htmlFor="contact" className="fg-label">CONTACT NUMBER</label>
              <input
                id="contact"
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                onFocus={() => handleFocus("contactNumber")}
                onBlur={() => handleBlur("contactNumber")}
                className="fg-input"
                autoComplete="tel"
                maxLength={13}
                required
              />
              <span className="fg-bar" />
            </div>

            {/* Seller Checkbox */}
            <label className="seller-check" htmlFor="isSeller">
              <input
                id="isSeller"
                type="checkbox"
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleChange}
                className="seller-check__input"
              />
              <span className="seller-check__box">
                {formData.isSeller && (
                  <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5l3.5 3.5L11 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className="seller-check__text">REGISTER AS A SELLER?</span>
            </label>

            {/* Register CTA */}
            <button type="submit" className="btn-register" id="btn-register">
              <span className="btn-register__text">REGISTER</span>
            </button>
          </form>

          {/* OR divider */}
          <div className="or-divider">
            <span className="or-line" />
            <span className="or-label">OR</span>
            <span className="or-line" />
          </div>

          {/* Google CTA */}
          <button
            type="button"
            className="btn-google"
            id="btn-google"
            onClick={handleGoogleAuth}
          >
            <svg className="g-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Login redirect */}
          <p className="auth-redirect">
            Already have an account?{" "}
            <a href="/login" className="auth-link" id="link-login">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
