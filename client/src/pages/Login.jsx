import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phoneOrEmail) {
      setError('Phone or email is required');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await api.post('/auth/login', { phoneOrEmail });
      localStorage.setItem('phoneOrEmail', phoneOrEmail);
      navigate('/otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
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
        <form className="auth-form" onSubmit={handleLogin}>
          <h1>Login to your Productr Account</h1>
          
          <div className="form-group">
            <label className="form-label">Email or Phone number</label>
            <input 
              type="text" 
              className={`form-input ${error ? 'error' : ''}`} 
              placeholder="Enter email or phone number"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              style={error ? {borderColor: '#EF4444'} : {}}
            />
          </div>
          {error && <div style={{color: '#EF4444', fontSize: '12px', marginBottom: '16px', marginTop: '-16px'}}>{error}</div>}
          
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have a Productr Account 
          <a href="#">SignUp Here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
