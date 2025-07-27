import { createContext } from 'react';

type AuthContextType = {
  authToken: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  authToken: null,
  role: null,
  login: () => {},
  logout: () => {},
});