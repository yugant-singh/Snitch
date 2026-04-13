import React, { useState } from 'react';
import './FloatingLabelInput.scss';

const FloatingLabelInput = ({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  autoComplete,
  maxLength,
  required,
  showPasswordToggle
}) => {
  const [internalFocused, setInternalFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e) => {
    setInternalFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setInternalFocused(false);
    if (onBlur) onBlur(e);
  };

  const isActive = internalFocused || Boolean(value);

  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`fg ${isActive ? 'fg--active' : ''}`}>
      <label htmlFor={id} className="fg__label">{label}</label>
      
      <div className={showPasswordToggle ? 'fg__row' : ''}>
        <input
          id={id}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="fg__input"
          autoComplete={autoComplete}
          maxLength={maxLength}
          required={required}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            className="fg__toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3l18 18M10.5 10.677A3 3 0 0013.323 13.5M6.362 6.226C4.496 7.388 3 9.05 3 12c0 3 3.134 7 9 7 1.63 0 3.054-.397 4.27-1.05M9.879 4.243A9.16 9.16 0 0112 5c5.866 0 9 4 9 7 0 1.07-.322 2.108-.944 3.046" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && <p className="fg__error">{error}</p>}
      
      <span className="fg__bar" />
    </div>
  );
};

export default FloatingLabelInput;
