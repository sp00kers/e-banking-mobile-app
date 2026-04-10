import { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import './Dashboard.css';
import LanguageSelector from './LanguageSelector';
import FamilyAssistPage from './FamilyAssistPage';

// Contact book: 2 contacts per letter A-Z
const CONTACT_BOOK = [
  { id: 1, name: 'Aaron Tan' }, { id: 2, name: 'Aisyah binti Ahmad' },
  { id: 3, name: 'Benjamin Chong' }, { id: 4, name: 'Bella Yap' },
  { id: 5, name: 'Calvin Lee' }, { id: 6, name: 'Catherine Wong' },
  { id: 7, name: 'David Lim' }, { id: 8, name: 'Diana Raj' },
  { id: 9, name: 'Edwin Ong' }, { id: 10, name: 'Emily Chan' },
  { id: 11, name: 'Faizal bin Osman' }, { id: 12, name: 'Fiona Tan' },
  { id: 13, name: 'George Ng' }, { id: 14, name: 'Grace Koh' },
  { id: 15, name: 'Hassan bin Ali' }, { id: 16, name: 'Hannah Liew' },
  { id: 17, name: 'Isaac Teo' }, { id: 18, name: 'Irene Goh' },
  { id: 19, name: 'Jason Yong' }, { id: 20, name: 'Jenny Lau' },
  { id: 21, name: 'Kevin Sim' }, { id: 22, name: 'Karen Foo' },
  { id: 23, name: 'Leonard Ho' }, { id: 24, name: 'Linda Chin' },
  { id: 25, name: 'Marcus Tan' }, { id: 26, name: 'May Ling' },
  { id: 27, name: 'Nathan Loh' }, { id: 28, name: 'Nancy Yew' },
  { id: 29, name: 'Oliver Pang' }, { id: 30, name: 'Olivia Chua' },
  { id: 31, name: 'Patrick Low' }, { id: 32, name: 'Priya Nair' },
  { id: 33, name: 'Qasim bin Razak' }, { id: 34, name: 'Queenie Soh' },
  { id: 35, name: 'Raymond Gan' }, { id: 36, name: 'Rachel Teh' },
  { id: 37, name: 'Sarah Lai' }, { id: 38, name: 'Sarah Lew' },
  { id: 39, name: 'Timothy Chia' }, { id: 40, name: 'Tina Ooi' },
  { id: 41, name: 'Umar bin Yusof' }, { id: 42, name: 'Uma Devi' },
  { id: 43, name: 'Vincent Heng' }, { id: 44, name: 'Vivian Khoo' },
  { id: 45, name: 'William Tan' }, { id: 46, name: 'Wendy Chew' },
  { id: 47, name: 'Xavier Lim' }, { id: 48, name: 'Xin Yi Tong' },
  { id: 49, name: 'Yazid bin Ismail' }, { id: 50, name: 'Yvonne Seah' },
  { id: 51, name: 'Zahir bin Hamid' }, { id: 52, name: 'Zoe Ang' },
];

function Dashboard({ userData, onSignOut, onUpdateUser }) {
  const [currentScreen, setCurrentScreen] = useState('overview');
  const [recipientName, setRecipientName] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sendError, setSendError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Transaction history state
  const [activityList, setActivityList] = useState([
    { id: 'tx1', date: '2026-03-06', merchant: 'Supermarket', value: -67.80 },
    { id: 'tx2', date: '2026-03-05', merchant: 'Social Security', value: 1850.00 },
    { id: 'tx3', date: '2026-03-04', merchant: 'Medical Center', value: -35.50 },
    { id: 'tx4', date: '2026-03-02', merchant: 'Electric Company', value: -98.25 }
  ]);

  // Voice Assist state
  const [voiceAssistEnabled, setVoiceAssistEnabled] = useState(true);

  // Personal Account states
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinError, setPinError] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [limitError, setLimitError] = useState('');
  const [limitSuccess, setLimitSuccess] = useState(false);

  const { t } = useTranslation();

  const speakMessage = (text) => {
    if (!voiceAssistEnabled) return;
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const censorPin = (pin) => {
    return '*'.repeat(pin.length);
  };

  // Filter contacts based on typed name
  const filteredContacts = recipientName.trim().length > 0
    ? CONTACT_BOOK.filter(c => c.name.toLowerCase().includes(recipientName.toLowerCase()))
    : [];

  const handleNameChange = (e) => {
    setRecipientName(e.target.value);
    setSelectedRecipient(null);
    setShowSuggestions(true);
  };

  const handleSelectContact = (contact) => {
    setRecipientName(contact.name);
    setSelectedRecipient(contact);
    setShowSuggestions(false);
  };

  const handlePinChange = (e) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess(false);

    if (!newPin || !confirmPin) {
      setPinError('error.fillAllFields');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('error.pinsMismatch');
      return;
    }
    if (newPin.length < 6) {
      setPinError('error.pinTooShort');
      return;
    }

    onUpdateUser({ pin: newPin });
    setNewPin('');
    setConfirmPin('');
    setPinSuccess(true);
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

  return (
    <div className="main-dashboard">
      <header className="top-bar">
        <div className="brand-section">
          <h1>{t('app.bankName')}</h1>
          <LanguageSelector />
        </div>
        <div className="user-section">
          <button onClick={() => {
            setCurrentScreen('account');
            setPinSuccess(false);
            setPinError('');
            setLimitSuccess(false);
            setLimitError('');
          }} className="profile-btn" aria-label="Personal Account">
            👤
          </button>
          <button onClick={onSignOut} className="exit-btn">{t('dashboard.logOut')}</button>
        </div>
      </header>

      <main className="content-area">
        {currentScreen === 'overview' && (
          <>
            <div className="account-summary">
              <div className="summary-title">{t('overview.balanceTitle')}</div>
              <div className="summary-value">RM {userData.accountBalance.toFixed(2)}</div>
              <div className="summary-note">{t('overview.balanceNote')}</div>
            </div>

            <div className="action-grid">
              <button className="feature-btn" onClick={() => {
                setCurrentScreen('send');
                setRecipientName('');
                setSelectedRecipient(null);
                setTransferAmount('');
                setSendError('');
              }}>
                <span className="feature-emoji">💰</span>
                <span className="feature-label">{t('overview.sendMoney')}</span>
              </button>
              <button className="feature-btn" onClick={() => setCurrentScreen('history')}>
                <span className="feature-emoji">📊</span>
                <span className="feature-label">{t('overview.history')}</span>
              </button>
              <button className="feature-btn" onClick={() => setCurrentScreen('familyAssist')}>
                <span className="feature-emoji">👨‍👩‍👦</span>
                <span className="feature-label">{t('overview.familyAssist')}</span>
              </button>
            </div>
          </>
        )}

        {currentScreen === 'history' && (
          <div className="history-screen fullpage-screen">
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
                    {item.value > 0 ? '+' : '-'}RM {Math.abs(item.value).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentScreen === 'send' && (
          <div className="send-screen fullpage-screen">
            <button onClick={() => setCurrentScreen('overview')} className="return-btn">
              {t('common.returnHome')}
            </button>
            <h2>{t('send.title')}</h2>

            <div className="voice-toggle-row">
              <div className="voice-toggle-info">
                <span className="voice-toggle-icon">🔊</span>
                <span className="voice-toggle-label">{t('voice.assistLabel')}</span>
              </div>
              <button
                className={`voice-toggle-switch ${voiceAssistEnabled ? 'on' : 'off'}`}
                onClick={() => setVoiceAssistEnabled(prev => !prev)}
                aria-label="Toggle Voice Assist"
              >
                <span className="voice-toggle-knob" />
              </button>
            </div>

            <form className="payment-form" onSubmit={(e) => {
              e.preventDefault();
              setSendError('');
              if (selectedRecipient && transferAmount) {
                const amount = parseFloat(transferAmount);
                if (userData.accountBalance <= 0) {
                  setSendError('error.zeroBalance');
                  return;
                }
                if (amount > userData.accountBalance) {
                  setSendError('error.insufficientBalance');
                  return;
                }
                if (amount > userData.transactionLimit) {
                  setSendError('error.exceedsLimit');
                  return;
                }
                setShowConfirmation(true);
                speakMessage(`You are about to pay RM ${amount} to ${selectedRecipient.name}. Do you want to continue?`);
              }
            }}>
              <div className="field-group">
                <label>{t('send.recipientLabel')}</label>
                <div className="name-search-wrapper">
                  <input
                    type="text"
                    placeholder={t('send.recipientPlaceholder')}
                    value={recipientName}
                    onChange={handleNameChange}
                    onFocus={() => setShowSuggestions(true)}
                    autoComplete="off"
                  />
                  {showSuggestions && filteredContacts.length > 0 && !selectedRecipient && (
                    <div className="name-suggestions">
                      {filteredContacts.slice(0, 5).map(contact => (
                        <button
                          key={contact.id}
                          type="button"
                          className="suggestion-item"
                          onClick={() => handleSelectContact(contact)}
                        >
                          <span className="suggestion-avatar">👤</span>
                          <span className="suggestion-name">{contact.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {selectedRecipient && (
                  <div className="selected-contact-badge">
                    ✅ {selectedRecipient.name}
                  </div>
                )}
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
              {sendError && <div className="error-message">{t(sendError)} {sendError === 'error.exceedsLimit' ? `RM ${userData.transactionLimit.toFixed(2)}` : ''}</div>}
              <button type="submit" className="send-btn" disabled={!selectedRecipient}>{t('send.submitButton')}</button>
            </form>
          </div>
        )}

        {currentScreen === 'familyAssist' && (
          <FamilyAssistPage
            accountBalance={userData.accountBalance}
            onBack={() => setCurrentScreen('overview')}
          />
        )}

        {currentScreen === 'account' && (
          <div className="account-screen">
            <button onClick={() => setCurrentScreen('overview')} className="return-btn">
              {t('common.returnHome')}
            </button>
            <h2>{t('account.title')}</h2>

            <div className="account-info-section">
              <div className="account-info-card">
                <div className="info-label">{t('account.pinLabel')}</div>
                <div className="info-value">{censorPin(userData.pin)}</div>
              </div>
              <div className="account-info-card">
                <div className="info-label">{t('account.transactionLimitLabel')}</div>
                <div className="info-value">RM {userData.transactionLimit.toFixed(2)}</div>
              </div>
            </div>

            <div className="account-settings-section">
              <div className="settings-card">
                <h3>{t('account.changePin')}</h3>
                <form onSubmit={handlePinChange} className="settings-form">
                  <div className="field-group">
                    <label>{t('account.newPinLabel')}</label>
                    <input
                      type="password"
                      placeholder={t('account.newPinPlaceholder')}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]*"
                    />
                  </div>
                  <div className="field-group">
                    <label>{t('account.confirmPinLabel')}</label>
                    <input
                      type="password"
                      placeholder={t('account.confirmPinPlaceholder')}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]*"
                    />
                  </div>
                  {pinError && <div className="error-message">{t(pinError)}</div>}
                  {pinSuccess && <div className="success-message">{t('success.pinChanged')}</div>}
                  <button type="submit" className="settings-btn">{t('account.updatePinButton')}</button>
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
            <p>{t('confirm.message')} <strong>RM {transferAmount}</strong> {t('confirm.to')} <strong>{selectedRecipient?.name}</strong>?</p>
            <div className="confirmation-buttons">
              <button
                className="cancel-btn"
                onClick={() => { window.speechSynthesis && window.speechSynthesis.cancel(); setShowConfirmation(false); }}
              >
                {t('confirm.cancelButton')}
              </button>
              <button
                className="confirm-btn"
                onClick={() => {
                  const amount = parseFloat(transferAmount);
                  onUpdateUser({ accountBalance: userData.accountBalance - amount });
                  const today = new Date().toISOString().split('T')[0];
                  setActivityList(prev => [
                    { id: 'tx' + Date.now(), date: today, merchant: selectedRecipient?.name || 'Transfer', value: -amount },
                    ...prev
                  ]);
                  speakMessage(`You paid RM ${amount} to ${selectedRecipient?.name}`);
                  setShowConfirmation(false);
                  setRecipientName('');
                  setSelectedRecipient(null);
                  setTransferAmount('');
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
