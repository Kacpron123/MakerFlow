import { 
  createContext, useState, useContext, useEffect, 
  type ReactNode, type FC 
} from 'react';
import api from '@/api/axios';
import { API_ROUTES } from '@/constants/api-routes';

interface User {
  username: string;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO get data from /me
      setUser({ username: 'User' }); 
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<{ access_token: string }>(API_ROUTES.LOGIN, { 
        username, 
        password 
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setUser({ username });
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      await api.post(API_ROUTES.REGISTER, { username, password });
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};