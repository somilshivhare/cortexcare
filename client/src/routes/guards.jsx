import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Guard for protected routes: requires active login.
 */
export const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-800" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location they tried to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Guard for guest routes: prevents logged-in users from seeing login/register screens.
 */
export const GuestGuard = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-800" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Redirect authenticated users to their corresponding dashboard
    const redirectPath = user.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

/**
 * Guard for role-restricted routes: gates by user type (DOCTOR or PATIENT).
 */
export const RoleGuard = ({ allowedRole, children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-800" />
      </div>
    );
  }

  if (!user || user.role !== allowedRole) {
    // Redirect to home or role fallback
    const fallbackPath = user?.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard';
    return <Navigate to={fallbackPath || '/'} replace />;
  }

  return children;
};
