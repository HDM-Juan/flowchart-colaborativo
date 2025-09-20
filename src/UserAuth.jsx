import React, { useState, useEffect } from 'react';

const UserAuth = ({ onUserChange }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already stored in localStorage
    const storedUser = localStorage.getItem('flowchart-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      onUserChange(userData);
    }
  }, []);

  const handleLogin = async () => {
    if (!email.trim()) return;

    setIsLoading(true);
    
    // Simulate user creation with a simple UID
    const userData = {
      uid: `user_${Date.now()}`,
      email: email.trim()
    };

    localStorage.setItem('flowchart-user', JSON.stringify(userData));
    setUser(userData);
    onUserChange(userData);
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('flowchart-user');
    setUser(null);
    onUserChange(null);
    setEmail('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (user) {
    return (
      <div className="user-info">
        <span>👤 {user.email}</span>
        <button onClick={handleLogout} className="btn">
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="login-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ingresa tu email para colaborar"
        className="email-input"
        disabled={isLoading}
      />
      <button 
        onClick={handleLogin}
        disabled={isLoading || !email.trim()}
        className="btn primary"
      >
        {isLoading ? 'Conectando...' : 'Unirse'}
      </button>
    </div>
  );
};

export default UserAuth;