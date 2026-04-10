import { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import './Dashboard.css';
import LanguageSelector from './LanguageSelector';

function Dashboard({ userData, onSignOut, onUpdateUser }) {
  const [currentScreen, setCurrentScreen] = useState('overview');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sendError, setSendError] = useState('');

  // Ask AI Chat states
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatStep, setChatStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Transaction history state
  const [activityList, setActivityList] = useState([
    { id: 'tx1', date: '2026-03-06', merchant: 'Supermarket', value: -67.80 },
    { id: 'tx2', date: '2026-03-05', merchant: 'Social Security', value: 1850.00 },
    { id: 'tx3', date: '2026-03-04', merchant: 'Medical Center', value: -35.50 },
    { id: 'tx4', date: '2026-03-02', merchant: 'Electric Company', value: -98.25 }
  ]);

  // Personal Account states
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinError, setPinError] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [limitError, setLimitError] = useState('');
  const [limitSuccess, setLimitSuccess] = useState(false);

  const { t } = useTranslation();

  const censorPin = (pin) => {
    return '*'.repeat(pin.length);
  };

  const contacts = [
    { id: 1, name: 'Ahmad bin Ibrahim', account: '7721-0034-8891', bank: 'EasyBank' },
    { id: 2, name: 'Ahmad Rizal', account: '5510-2287-4430', bank: 'MayBank' },
    { id: 3, name: 'Ahmad Faizal bin Osman', account: '6639-1102-7765', bank: 'CIMB' },
  ];

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    const newMessages = [
      ...chatMessages,
      { sender: 'user', text: contact.name },
      {
        sender: 'ai',
        text: t('ask.transferDetails'),
        isTransfer: true,
        details: {
          name: contact.name,
          account: contact.account,
          amount: 'RM 250.00'
        }
      },
      { sender: 'ai', text: t('ask.askPin') }
    ];
    setChatMessages(newMessages);
    setChatStep(2);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user', text: chatInput };
    const newMessages = [...chatMessages, userMsg];
    setChatInput('');

    if (chatStep === 0) {
      // After greeting, AI searches contacts and finds multiple Ahmads
      newMessages.push({ sender: 'ai', text: t('ask.searchingContacts') });
      setChatStep(1);
      setChatMessages(newMessages);
      // Simulate search delay
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: t('ask.multipleContacts'),
            isContactList: true,
            contacts: contacts
          }
        ]);
      }, 1000);
      return;
    } else if (chatStep === 2) {
      // User entered password, AI processes transfer
      const aiTransferAmount = 250;
      if (userData.accountBalance <= 0) {
        newMessages.push({ sender: 'ai', text: t('ask.errorZeroBalance') });
        newMessages.push({ sender: 'ai', text: t('ask.anythingElse') });
        setChatMessages(newMessages);
        setChatStep(0);
        return;
      }
      if (aiTransferAmount > userData.accountBalance) {
        newMessages.push({ sender: 'ai', text: t('ask.errorInsufficientBalance') });
        newMessages.push({ sender: 'ai', text: t('ask.anythingElse') });
        setChatMessages(newMessages);
        setChatStep(0);
        return;
      }
      if (aiTransferAmount > userData.transactionLimit) {
        newMessages.push({ sender: 'ai', text: `${t('ask.errorExceedsLimit')} RM ${userData.transactionLimit.toFixed(2)}.` });
        newMessages.push({ sender: 'ai', text: t('ask.anythingElse') });
        setChatMessages(newMessages);
        setChatStep(0);
        return;
      }
      newMessages.push({ sender: 'ai', text: t('ask.processing') });
      setChatStep(3);
      setChatMessages(newMessages);
      // Simulate delay then show success and allow more transactions
      setTimeout(() => {
        const newBalance = userData.accountBalance - aiTransferAmount;
        onUpdateUser({ accountBalance: newBalance });
        const today = new Date().toISOString().split('T')[0];
        setActivityList(prev => [
          { id: 'tx' + Date.now(), date: today, merchant: selectedContact ? selectedContact.name : 'Transfer', value: -aiTransferAmount },
          ...prev
        ]);
        const successMsg = `${t('ask.transferSuccessPart1')} RM ${aiTransferAmount.toFixed(2)} ${t('ask.transferSuccessPart2')} RM ${aiTransferAmount.toFixed(2)} ${t('ask.deductedMessage')} RM ${newBalance.toFixed(2)}.`;
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', text: successMsg },
          { sender: 'ai', text: t('ask.anythingElse') }
        ]);
        setChatStep(0);
      }, 1500);
      return;
    }

    setChatMessages(newMessages);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // Simulate voice input converting to text
      setChatInput(t('ask.voicePlaceholderText'));
    }
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

  // activityList is now managed via useState above

  return (
    <div className="main-dashboard">
      <header className="top-bar">
        <div className="brand-section">
          <h1>{t('app.bankName')}</h1>
          <LanguageSelector />
        </div>
        <div className="user-section">
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
                setPinSuccess(false);
                setPinError('');
                setLimitSuccess(false);
                setLimitError('');
              }}>
                <span className="feature-emoji">👤</span>
                <span className="feature-label">{t('overview.personalAccount')}</span>
              </button>
              <button className="feature-btn" onClick={() => {
                setCurrentScreen('ask');
                setChatMessages([{ sender: 'ai', text: t('ask.greeting') }]);
                setChatStep(0);
                setChatInput('');
              }}>
                <span className="feature-emoji">🤖</span>
                <span className="feature-label">{t('overview.askAI')}</span>
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
                    {item.value > 0 ? '+' : '-'}RM {Math.abs(item.value).toFixed(2)}
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
              setSendError('');
              if (recipientAccount && transferAmount) {
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
              {sendError && <div className="error-message">{t(sendError)} {sendError === 'error.exceedsLimit' ? `RM ${userData.transactionLimit.toFixed(2)}` : ''}</div>}
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

        {currentScreen === 'ask' && (
          <div className="ask-screen">
            <button onClick={() => setCurrentScreen('overview')} className="return-btn">
              {t('common.returnHome')}
            </button>
            <h2>{t('ask.title')}</h2>

            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`chat-bubble ${msg.sender}`}>
                    {msg.sender === 'ai' && <div className="chat-avatar">🤖</div>}
                    <div className="chat-content">
                      {msg.isContactList ? (
                        <div className="contact-select-list">
                          <div className="contact-select-header">{msg.text}</div>
                          {msg.contacts.map(contact => (
                            <button
                              key={contact.id}
                              className="contact-select-btn"
                              onClick={() => handleContactSelect(contact)}
                            >
                              <div className="contact-select-name">{contact.name}</div>
                              <div className="contact-select-info">{contact.account} · {contact.bank}</div>
                            </button>
                          ))}
                        </div>
                      ) : msg.isTransfer ? (
                        <div className="transfer-card">
                          <div className="transfer-header">{msg.text}</div>
                          <div className="transfer-detail">
                            <span className="transfer-label">{t('ask.recipientName')}</span>
                            <span className="transfer-value">{msg.details.name}</span>
                          </div>
                          <div className="transfer-detail">
                            <span className="transfer-label">{t('ask.accountNumber')}</span>
                            <span className="transfer-value">{msg.details.account}</span>
                          </div>
                          <div className="transfer-detail">
                            <span className="transfer-label">{t('ask.transferAmount')}</span>
                            <span className="transfer-value amount">{msg.details.amount}</span>
                          </div>
                        </div>
                      ) : (
                        <span>{msg.text}</span>
                      )}
                    </div>
                    {msg.sender === 'user' && <div className="chat-avatar user-avatar">👤</div>}
                  </div>
                ))}
              </div>

              {chatStep !== 1 && (
                <div className="chat-input-area">
                  <input
                    type={chatStep === 2 ? 'password' : 'text'}
                    className="chat-input"
                    placeholder={chatStep === 2 ? t('ask.pinPlaceholder') : t('ask.inputPlaceholder')}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                  />
                  <button
                    className={`voice-btn ${isRecording ? 'recording' : ''}`}
                    onClick={handleVoiceRecord}
                  >
                    {isRecording ? '⏹️' : '🎤'}
                  </button>
                  <button className="chat-send-btn" onClick={handleChatSend}>
                    ➤
                  </button>
                </div>
              )}
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
            <p>{t('confirm.message')} <strong>RM {transferAmount}</strong> {t('confirm.to')} <strong>{recipientAccount}</strong>?</p>
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
                  const amount = parseFloat(transferAmount);
                  onUpdateUser({ accountBalance: userData.accountBalance - amount });
                  const today = new Date().toISOString().split('T')[0];
                  setActivityList(prev => [
                    { id: 'tx' + Date.now(), date: today, merchant: recipientAccount, value: -amount },
                    ...prev
                  ]);
                  setShowConfirmation(false);
                  setRecipientAccount('');
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
