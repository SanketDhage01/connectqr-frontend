import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authService.getMe();
        if (response?.status === 'success') {
          setUser(response.data.user);
          setVehicle(response.data.vehicle);
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      localStorage.removeItem('token');
      setUser(null);
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response?.status === 'success') {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setVehicle(response.data.vehicle);
        return response.data;
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await authService.register(formData);
      if (response?.status === 'success') {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setVehicle(response.data.vehicle);
        return response.data;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setVehicle(null);
      setLoading(false);
      window.location.href = '/login';
    }
  };

  const updateVehicleState = (updatedVehicle) => {
    setVehicle(updatedVehicle);
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    vehicle,
    loading,
    login,
    register,
    logout,
    updateVehicleState,
    updateUserState,
    refreshUser: fetchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;
