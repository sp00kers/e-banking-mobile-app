import { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import './Dashboard.css';
import LanguageSelector from './LanguageSelector';

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

  const { t } = useTranslation();

  const censorPassword = (password) => {
    return '*'.repeat(password.length);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!newPassword || !confirmPassword) {
      setPasswordError('error.fillAllFields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('error.passwordsMismatch');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('error.passwordTooShort');
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
      setLimitError('error.limitTooLow');
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
        <div className="brand-section">
          <h1>{t('app.bankName')}</h1>
          <LanguageSelector />
        </div>
        <div className="user-section">
          <span className="greeting">{t('dashboard.greeting')}{userData.username}</span>
          <button onClick={onSignOut} className="exit-btn">{t('dashboard.logOut')}</button>
        </div>
      </header>

      <main className="content-area">
        {currentScreen === 'overview' && (
          <>
            <div className="account-summary">
              <div className="summary-title">{t('overview.balanceTitle')}</div>
              <div className="summary-value">${userData.accountBalance.toFixed(2)}</div>
              <div className="summary-note">{t('overview.balanceNote')}</div>
            </div>

            <div className="action-grid">
              <button className="feature-btn" onClick={() => setCurrentScreen('send')}>
                <span className="feature-emoji">💰</span>
                <span className="feature-label">{t('overview.sendMoney')}</span>
              </button>
              <button className="feature-btn" onClick={() => setCurrentScreen('history')}>
                <span className="feature-emoji">📊</span>
                <span className="feature-label">{t('overview.history')}</span>
              </button>
              <button className="feature-btn" onClick={() => {
                setCurrentScreen('account');
                setPasswordSuccess(false);
                setPasswordError('');
                setLimitSuccess(false);
                setLimitError('');
              }}>
                <span className="feature-emoji">👤</span>
                <span className="feature-label">{t('overview.personalAccount')}</span>
              </button>
              <button className="feature-btn" onClick={() => setCurrentScreen('help')}>
                <span className="feature-emoji">☎️</span>
                <span className="feature-label">{t('overview.getHelp')}</span>
              </button>
            </div>
          </>
        )}

        {currentScreen === 'history' && (
          <div className="history-screen">
            <button onClick={() => setCurrentScreen('overview')} className="return-btn">
              {t('common.returnHome')}
            </button>
            <h2>{t('history.title')}</h2>
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
              {t('common.returnHome')}
            </button>
            <h2>{t('send.title')}</h2>
            <form className="payment-form" onSubmit={(e) => {
              e.preventDefault();
              if (recipientAccount && transferAmount) {
                setShowConfirmation(true);
              }
            }}>
              <div className="field-group">
                <label>{t('send.recipientLabel')}</label>
                <input
                  type="text"
                  placeholder={t('send.recipientPlaceholder')}
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label>{t('send.amountLabel')}</label>
                <input
                  type="number"
                  placeholder={t('send.amountPlaceholder')}
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
              <button type="submit" className="send-btn">{t('send.submitButton')}</button>
            </form>
          </div>
        )}

        {currentScreen === 'help' && (
          <div className="help-screen">
            <button onClick={() => setCurrentScreen('overview')} className="return-btn">
              {t('common.returnHome')}
            </button>
            <h2>{t('help.title')}</h2>
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <div className="contact-label">{t('help.phoneLabel')}</div>
                  <div className="contact-value">{t('help.phoneValue')}</div>
                  <div className="contact-note">{t('help.phoneNote')}</div>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <div className="contact-label">{t('help.emailLabel')}</div>
                  <div className="contact-value">{t('help.emailValue')}</div>
                  <div className="contact-note">{t('help.emailNote')}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'account' && (
          <div className="account-screen">
            <button onClick={() => setCurrentScreen('overview')} className="return-btn">
              {t('common.returnHome')}
            </button>
            <h2>{t('account.title')}</h2>

            <div className="account-info-section">
              <div className="account-info-card">
                <div className="info-label">{t('account.usernameLabel')}</div>
                <div className="info-value">{userData.username}</div>
              </div>
              <div className="account-info-card">
                <div className="info-label">{t('account.passwordLabel')}</div>
                <div className="info-value">{censorPassword(userData.password)}</div>
              </div>
              <div className="account-info-card">
                <div className="info-label">{t('account.transactionLimitLabel')}</div>
                <div className="info-value">${userData.transactionLimit.toFixed(2)}</div>
              </div>
            </div>

            <div className="account-settings-section">
              <div className="settings-card">
                <h3>{t('account.changePassword')}</h3>
                <form onSubmit={handlePasswordChange} className="settings-form">
                  <div className="field-group">
                    <label>{t('account.newPasswordLabel')}</label>
                    <input
                      type="password"
                      placeholder={t('account.newPasswordPlaceholder')}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label>{t('account.confirmPasswordLabel')}</label>
                    <input
                      type="password"
                      placeholder={t('account.confirmPasswordPlaceholder')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {passwordError && <div className="error-message">{t(passwordError)}</div>}
                  {passwordSuccess && <div className="success-message">{t('success.passwordChanged')}</div>}
                  <button type="submit" className="settings-btn">{t('account.updatePasswordButton')}</button>
                </form>
              </div>

              <div className="settings-card">
                <h3>{t('account.changeLimit')}</h3>
                <form onSubmit={handleLimitChange} className="settings-form">
                  <div className="field-group">
                    <label>{t('account.newLimitLabel')}</label>
                    <input
                      type="number"
                      placeholder={t('account.newLimitPlaceholder')}
                      step="0.01"
                      min="10"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                    />
                  </div>
                  {limitError && <div className="error-message">{t(limitError)}</div>}
                  {limitSuccess && <div className="success-message">{t('success.limitUpdated')}</div>}
                  <button type="submit" className="settings-btn">{t('account.updateLimitButton')}</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bottom-bar">
        <p>🔐 {t('footer.encryption')}</p>
      </footer>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h3>{t('confirm.title')}</h3>
            <p>{t('confirm.message')} <strong>${transferAmount}</strong> {t('confirm.to')} <strong>{recipientAccount}</strong>?</p>
            <div className="confirmation-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmation(false)}
              >
                {t('confirm.cancelButton')}
              </button>
              <button
                className="confirm-btn"
                onClick={() => {
                  setShowConfirmation(false);
                  setRecipientAccount('');
                  setTransferAmount('');
                  alert(t('alert.transferSuccess'));
                  setCurrentScreen('overview');
                }}
              >
                {t('confirm.confirmButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
