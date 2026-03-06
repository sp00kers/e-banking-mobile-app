import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const loginHandler = (name) => {
    setCurrentUser({ 
      username: name, 
      accountBalance: 8725.40,
      accountNumber: '****5678'
    });
  };

  const logoutHandler = () => {
    setCurrentUser(null);
  };

  return (
    <div className="App">
      {currentUser === null ? (
        <Login onLoginSuccess={loginHandler} />
      ) : (
        <Dashboard userData={currentUser} onSignOut={logoutHandler} />
      )}
    </div>
  );
}

export default App;
