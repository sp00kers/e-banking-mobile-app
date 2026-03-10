import { useState } from 'react';
import './Dashboard.css';

function Dashboard({ userData, onSignOut }) {
  const [currentScreen, setCurrentScreen] = useState('overview');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

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
