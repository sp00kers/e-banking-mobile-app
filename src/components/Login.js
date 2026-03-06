import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [userInput, setUserInput] = useState('');
  const [passInput, setPassInput] = useState('');

  const submitForm = (event) => {
    event.preventDefault();
    if (userInput.trim() && passInput.trim()) {
      onLoginSuccess(userInput);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="header-section">
          <div className="security-icon">🛡️</div>
          <h1>TrustBank</h1>
          <p className="subtitle">Banking Made Easy</p>
        </div>

        <form onSubmit={submitForm} className="auth-form">
          <div className="input-group">
            <label htmlFor="user">Your Username</label>
            <input
              id="user"
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your username"
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="pass">Your Password</label>
            <input
              id="pass"
              type="password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              placeholder="Type your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="signin-btn">
            Login to Your Account
          </button>
        </form>

        <div className="support-section">
          <p className="support-info">Questions? Call 1-888-555-BANK</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
