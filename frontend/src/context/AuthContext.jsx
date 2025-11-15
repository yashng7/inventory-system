import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials, onSuccess) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    
    // Call success callback if provided (for cart merging)
    if (onSuccess) {
      onSuccess();
    }
    
    return data;
  };

  const register = async (userData, onSuccess) => {
    const data = await authService.register(userData);
    setUser(data.user);
    
    // Call success callback if provided
    if (onSuccess) {
      onSuccess();
    }
    
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isCustomer: user?.role === 'customer',
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};