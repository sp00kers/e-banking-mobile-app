import { useState } from 'react';
import './Dashboard.css';

function Dashboard({ userData, onSignOut, onUpdateUser }) {
  const [currentScreen, setCurrentScreen] = useState('overview');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Personal Account states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [limitError, setLimitError] = useState('');
  const [limitSuccess, setLimitSuccess] = useState(false);

  const censorPassword = (password) => {
    return '*'.repeat(password.length);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);
    
    if (!newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    onUpdateUser({ password: newPassword });
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess(true);
  };

  const handleLimitChange = (e) => {
    e.preventDefault();
    setLimitError('');
    setLimitSuccess(false);
    
    const limitValue = parseFloat(newLimit);
    if (isNaN(limitValue) || limitValue < 10) {
      setLimitError('Transaction limit must be at least $10');
      return;
    }
    
    onUpdateUser({ transactionLimit: limitValue });
    setNewLimit('');
    setLimitSuccess(true);
  };

  const activityList = [
    { id: 'tx1', date: '2026-03-06', merchant: 'Supermarket', value: -67.80 },
    { id: 'tx2', date: '2026-03-05', merchant: 'Social Security', value: 1850.00 },
    { id: 'tx3', date: '2026-03-04', merchant: 'Medical Center', value: -35.50 },
    { id: 'tx4', date: '2026-03-02', merchant: 'Electric Company', value: -98.25 }
  ];

  return (
    <div className="main-dashboard">
      <header className="top-bar">
        <h1>TrustBank</h1>
        <div className="user-section">
          <span className="greeting">Hello, {userData.username}</span>
          <button onClick={onSignOut} className="exit-btn">Log Out</button>
        </div>
      </header>

      <main className="content-area">
        {currentScreen === 'overview' && (
          <>
            <div className="account-summary">
              <div className="summary-title">Account Balance</div>
              <div className="summary-value">${userData.accountBalance.toFixed(2)}</div>
              <div className="summary-note">Ready to spend</div>
            </div>

            <div className="action-grid">
              <button className="feature-btn" onClick={() => setCurrentScreen('send')}>
                <span className="feature-emoji">💰</span>
                <span className="feature-label">Send Money</span>
              </button>
              <button className="feature-btn" onClick={() => setCurrentScreen('history')}>
                <span className="feature-emoji">📊</span>
                <span className="feature-label">Account History</span>
              </button>
              <button className="feature-btn" onClick={() => {
                setCurrentScreen('account');
                setPasswordSuccess(false);
                setPasswordError('');
                setLimitSuccess(false);
                setLimitError('');
              }}>
                <span className="feature-emoji">👤</span>
                <span className="feature-label">Personal Account</span>
              </button>
              <button className="feature-btn" onClick={() => setCurrentScreen('help')}>
                <span className="feature-emoji">☎️</span>
                <span className="feature-label">Get Help</span>
              </button>
            </div>
          </>
        )}

        {currentScreen === 'history' && (
          <div className="history-screen">
            <button onClick={() => setCurrentScreen('overview')} className="return-btn">
              ← Return Home
            </button>
            <h2>Transaction History</h2>
            <div className="activity-container">
              {activityList.map(item => (
                <div key={item.id} className="activity-row">
                  <div className="activity-details">
                    <div className="activity-merchant">{item.merchant}</div>
                    <div className="activity-date">{item.date}</div>
                  </div>
                  <div className={`activity-value ${item.value > 0 ? 'credit' : 'debit'}`}>
                    {item.value > 0 ? '+' : '-'}${Math.abs(item.value).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentScreen === 'send' && (
          <div className="send-screen">
            <button onClick={() => setCurrentScreen('overview')} className="return-btn">
              ← Return Home
            </button>
            <h2>Send Money</h2>
            <form className="payment-form" onSubmit={(e) => {
              e.preventDefault();
              if (recipientAccount && transferAmount) {
                setShowConfirmation(true);
              }
            }}>
              <div className="field-group">
                <label>Recipient Account</label>
                <input 
                  type="number" 
                  placeholder="Account number" 
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="field-group">
                <label>Transfer Amount</label>
                <input 
                  type="number" 
                  placeholder="Enter amount" 
                  step="0.01"
                  min="0"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <button type="submit" className="send-btn">Complete Transfer</button>
            </form>
          </div>
        )}

        {currentScreen === 'help' && (
          <div className="help-screen">
            <button onClick={() => setCurrentScreen('overview')} className="return-btn">
              ← Return Home
            </button>
            <h2>Contact Us</h2>
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <div className="contact-label">Phone Number</div>
                  <div className="contact-value">1-888-555-2679</div>
                  <div className="contact-note">Available 24/7</div>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <div className="contact-label">Email Address</div>
                  <div className="contact-value">support@trustbank.com</div>
                  <div className="contact-note">We reply within 24 hours</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'account' && (
          <div className="account-screen">
            <button onClick={() => setCurrentScreen('overview')} className="return-btn">
              ← Return Home
            </button>
            <h2>Personal Account</h2>
            
            <div className="account-info-section">
              <div className="account-info-card">
                <div className="info-label">Username</div>
                <div className="info-value">{userData.username}</div>
              </div>
              <div className="account-info-card">
                <div className="info-label">Password</div>
                <div className="info-value">{censorPassword(userData.password)}</div>
              </div>
              <div className="account-info-card">
                <div className="info-label">Transaction Limit</div>
                <div className="info-value">${userData.transactionLimit.toFixed(2)}</div>
              </div>
            </div>

            <div className="account-settings-section">
              <div className="settings-card">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange} className="settings-form">
                  <div className="field-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label>Confirm Password</label>
                    <input 
                      type="password" 
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {passwordError && <div className="error-message">{passwordError}</div>}
                  {passwordSuccess && <div className="success-message">Password changed successfully!</div>}
                  <button type="submit" className="settings-btn">Update Password</button>
                </form>
              </div>

              <div className="settings-card">
                <h3>Change Transaction Limit</h3>
                <form onSubmit={handleLimitChange} className="settings-form">
                  <div className="field-group">
                    <label>New Limit (Minimum: $10)</label>
                    <input 
                      type="number" 
                      placeholder="Enter new limit"
                      step="0.01"
                      min="10"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                    />
                  </div>
                  {limitError && <div className="error-message">{limitError}</div>}
                  {limitSuccess && <div className="success-message">Transaction limit updated successfully!</div>}
                  <button type="submit" className="settings-btn">Update Limit</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bottom-bar">
        <p>🔐 Protected by bank-level encryption</p>
      </footer>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h3>Confirm Transfer</h3>
            <p>Are you sure you want to transfer <strong>${transferAmount}</strong> to <strong>{recipientAccount}</strong>?</p>
            <div className="confirmation-buttons">
              <button 
                className="cancel-btn" 
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={() => {
                  setShowConfirmation(false);
                  setRecipientAccount('');
                  setTransferAmount('');
                  alert('Transfer completed successfully!');
                  setCurrentScreen('overview');
                }}
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
