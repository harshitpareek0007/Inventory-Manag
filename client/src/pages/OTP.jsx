import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Please enter a valid OTP');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const phoneOrEmail = localStorage.getItem('phoneOrEmail') || '';

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError(true);
      setErrorMessage('Please enter a valid OTP');
      return;
    }

    setIsLoading(true);
    setError(false);
    try {
      const res = await api.post('/auth/verify-otp', { phoneOrEmail, otp: otpValue });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(true);
      setErrorMessage(err.response?.data?.message || 'Please enter a valid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-logo">
          <span>Productr</span>
          <span className="auth-logo-icon">∞</span>
        </div>
        <div className="auth-card">
          <h2>Uplist your<br/>product to market</h2>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form">
          <h1>Login to your Productr Account</h1>
          
          <label className="form-label">Enter OTP</label>
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className={`otp-input ${error ? 'error' : ''}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <p>If you do not receive the OTP in your email, please use the default OTP: <strong>123456</strong>.</p>
          {error && <div className="otp-error-msg">{errorMessage}</div>}
          
          <button onClick={handleSubmit} className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Enter your OTP'}
          </button>
          
          <div className="resend-text">
            Didnt recieve OTP ? <span>Resend in 20s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;
