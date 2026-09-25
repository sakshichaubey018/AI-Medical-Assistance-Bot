import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getActiveUserSession, 
  setActiveUserSession, 
  clearUserSession, 
  updateUserProfile as updateProfileService 
} from '../services/authService';
import { getReminders, getAppointments } from '../services/reminderService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Auto-login from localStorage on initial render
  useEffect(() => {
    const sessionUser = getActiveUserSession();
    if (sessionUser) {
      setUser(sessionUser);
    }
  }, []);

  // Sync user data whenever user state updates
  useEffect(() => {
    if (user) {
      refreshUserData();
    } else {
      setReminders([]);
      setAppointments([]);
    }
  }, [user]);

  const refreshUserData = () => {
    if (!user) return;
    setReminders(getReminders(user.id));
    setAppointments(getAppointments(user.id));
  };

  const login = (loggedInUser) => {
    setUser(loggedInUser);
    setActiveUserSession(loggedInUser.id);
  };

  const logout = () => {
    setUser(null);
    clearUserSession();
  };

  const updateProfile = (profileData) => {
    if (!user) return;
    const updatedUser = updateProfileService(user.id, profileData);
    setUser(updatedUser);
    return updatedUser;
  };

  const isAdmin = user && user.email ? user.email.toLowerCase().includes('admin') : false;

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      reminders,
      appointments,
      login,
      logout,
      updateProfile,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
