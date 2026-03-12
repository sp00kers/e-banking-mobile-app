import { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

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
    <div className="App">
      {currentUser === null ? (
        <Login onLoginSuccess={loginHandler} />
      ) : (
        <Dashboard userData={currentUser} onSignOut={logoutHandler} onUpdateUser={updateUserData} />
      )}
    </div>
  );
}

export default App;
