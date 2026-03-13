import { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { LanguageProvider } from './i18n/LanguageContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState('en');

  const loginHandler = (name) => {
    setCurrentUser({
      username: name,
      accountBalance: 8725.40,
      accountNumber: '****5678',
      password: 'mySecurePass123',
      transactionLimit: 500
    });
  };

  const updateUserData = (updates) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  const logoutHandler = () => {
    setCurrentUser(null);
  };

  return (
    <LanguageProvider language={language} setLanguage={setLanguage}>
      <div className="App">
        {currentUser === null ? (
          <Login onLoginSuccess={loginHandler} />
        ) : (
          <Dashboard userData={currentUser} onSignOut={logoutHandler} onUpdateUser={updateUserData} />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
