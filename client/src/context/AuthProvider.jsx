// src/context/AuthProvider.jsx
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('role');

    if (storedToken) setAuthToken(storedToken);
    if (storedRole) setRole(storedRole);
  }, []);

  const login = (token, userRole) => {
    setAuthToken(token);
    setRole(userRole);
    localStorage.setItem('authToken', token);
    localStorage.setItem('role', userRole);
  };

  const logout = () => {
    setAuthToken(null);
    setRole(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ authToken, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
