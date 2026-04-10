import { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [pinInput, setPinInput] = useState('');
  const [pinWarning, setPinWarning] = useState('');
  const { t } = useTranslation();

  const handlePinInput = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPinInput(value);
    setPinWarning('');
  };

  const submitForm = (event) => {
    event.preventDefault();
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

        <form onSubmit={submitForm} className="auth-form">
          <div className="input-group">
            <label htmlFor="pin">{t('login.pinLabel')}</label>
            <input
              id="pin"
              type="password"
              value={pinInput}
              onChange={handlePinInput}
              placeholder={t('login.pinPlaceholder')}
              autoComplete="off"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]*"
            />
          </div>

          {pinWarning && <div className="error-message">{t(pinWarning)}</div>}

          <button type="submit" className="signin-btn">
            {t('login.submitButton')}
          </button>
        </form>

        <div className="support-section">
          <p className="support-info">{t('login.supportText')}</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
