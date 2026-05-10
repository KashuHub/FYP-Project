import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('tourista_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
      setWishlistCount(data.user?.wishlist?.length || 0);
    } catch {
      localStorage.removeItem('tourista_token');
      localStorage.removeItem('tourista_user');
      setUser(null);
      setWishlistCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('tourista_token', data.token);
    setUser(data.user);
    setWishlistCount(data.user?.wishlist?.length || 0);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    localStorage.setItem('tourista_token', data.token);
    setUser(data.user);
    setWishlistCount(data.user?.wishlist?.length || 0);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('tourista_token');
    localStorage.removeItem('tourista_user');
    setUser(null);
    setWishlistCount(0);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser?.wishlist !== undefined) {
      setWishlistCount(updatedUser.wishlist.length);
    }
  };

  // Toggle wishlist — calls API and updates count in real-time
  const toggleWishlist = async (propertyId) => {
    if (!user) return { isWishlisted: false };
    const { data } = await authAPI.toggleWishlist(propertyId);
    setUser(prev => ({ ...prev, wishlist: data.wishlist }));
    setWishlistCount(data.wishlist.length);
    return { isWishlisted: data.isWishlisted };
  };

  // Returns true if the propertyId is currently saved
  const isInWishlist = (propertyId) => {
    if (!user?.wishlist || !propertyId) return false;
    return user.wishlist.some(item =>
      (typeof item === 'string' ? item : item._id?.toString()) === propertyId.toString()
    );
  };

  const isAdmin = user?.role === 'admin';
  const isHost = user?.role === 'host' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateUser,
      isAdmin, isHost,
      wishlistCount, toggleWishlist, isInWishlist,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
