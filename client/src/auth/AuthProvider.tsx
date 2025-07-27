import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('role');

    if (storedToken) setAuthToken(storedToken);
    if (storedRole) setRole(storedRole);
  }, []);

  const login = (token: string, userRole: string) => {
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

export default AuthProvider;