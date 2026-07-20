import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { setAccessToken } from '../services/api.js';

const AuthContext = createContext(null);

/**
 * Statelessly parse JWT tokens using native base64 decoding (atob).
 */
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  }, []);

  // Silent Check-In: Attempt to refresh token on initial mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Attempt silent refresh by calling backend
        const response = await api.post('/auth/refresh');
        const { accessToken } = response.data;
        
        // Save access token to memory
        setAccessToken(accessToken);
        
        // Decode token payload statelessly to load user credentials
        const parsed = parseJwt(accessToken);
        if (parsed) {
          setUser({
            id: parsed.id,
            email: parsed.email,
            role: parsed.role,
          });
        }
      } catch (err) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  /**
   * Log in user and store access token in memory.
   * @param {string} token - Access token returned in JSON body
   */
  const login = (token) => {
    setAccessToken(token);
    const parsed = parseJwt(token);
    if (parsed) {
      setUser({
        id: parsed.id,
        email: parsed.email,
        role: parsed.role,
      });
    }
  };

  /**
   * Conclude session, call backend logout to clear cookies, and clear memory.
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Failed to logout cleanly from backend:', err.message);
    } finally {
      // Clear local in-memory values regardless of server response
      setAccessToken(null);
      setUser(null);
      window.location.href = '/auth/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
};
