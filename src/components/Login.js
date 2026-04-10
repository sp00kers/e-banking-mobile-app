import { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [pinInput, setPinInput] = useState('');
  const [pinWarning, setPinWarning] = useState('');
  const { t } = useTranslation();

  const handleKeyPress = (digit) => {
    if (pinInput.length >= 6) return;
    setPinWarning('');
    setPinInput(prev => prev + digit);
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setPinWarning('');
  };

  const submitForm = () => {
    if (pinInput.length < 6) {
      setPinWarning('error.pinTooShort');
      return;
    }
    onLoginSuccess(pinInput);
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-language-selector">
          <LanguageSelector />
        </div>
        <div className="header-section">
          <div className="security-icon">🏦</div>
          <h1>{t('app.bankName')}</h1>
          <p className="subtitle">{t('login.subtitle')}</p>
        </div>

        <div className="auth-form">
          <label className="pin-label">{t('login.pinLabel')}</label>

          {/* PIN dots display */}
          <div className="pin-dots">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`pin-dot ${i < pinInput.length ? 'filled' : ''}`} />
            ))}
          </div>

          {pinWarning && <div className="error-message">{t(pinWarning)}</div>}

          {/* 3x3 number keypad + bottom row */}
          <div className="num-keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                type="button"
                className="key-btn"
                onClick={() => handleKeyPress(String(num))}
              >
                {num}
              </button>
            ))}
            <button type="button" className="key-btn key-backspace" onClick={handleBackspace}>
              ⌫
            </button>
            <button type="button" className="key-btn" onClick={() => handleKeyPress('0')}>
              0
            </button>
            <button type="button" className="key-btn key-enter" onClick={submitForm}>
              ✓
            </button>
          </div>

        </div>

        <div className="support-section">
          <p className="support-info">{t('login.supportText')}</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
