import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('smartshop_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('smartshop_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email };
      setUser(userData);
      localStorage.setItem('smartshop_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('smartshop_users') || '[]');
    const exists = users.some((u: any) => u.email === email);
    
    if (exists) return false;
    
    const newUser = { id: crypto.randomUUID(), email, password };
    users.push(newUser);
    localStorage.setItem('smartshop_users', JSON.stringify(users));
    
    const userData = { id: newUser.id, email: newUser.email };
    setUser(userData);
    localStorage.setItem('smartshop_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartshop_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
