import { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [userInput, setUserInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const { t } = useTranslation();

  const submitForm = (event) => {
    event.preventDefault();
    if (userInput.trim() && passInput.trim()) {
      onLoginSuccess(userInput);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-language-selector">
          <LanguageSelector />
        </div>
        <div className="header-section">
          <div className="security-icon">🛡️</div>
          <h1>{t('app.bankName')}</h1>
          <p className="subtitle">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={submitForm} className="auth-form">
          <div className="input-group">
            <label htmlFor="user">{t('login.usernameLabel')}</label>
            <input
              id="user"
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={t('login.usernamePlaceholder')}
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="pass">{t('login.passwordLabel')}</label>
            <input
              id="pass"
              type="password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              placeholder={t('login.passwordPlaceholder')}
              autoComplete="current-password"
            />
          </div>

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
