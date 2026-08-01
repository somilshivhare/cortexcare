import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useProfile } from '../features/profile/hooks/useProfile.js';

/**
 * Guard for protected routes: requires active login.
 */
export const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-800" />
      </div>
    );
  }

  if (!isAuthenticated) {
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
      <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-800" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    let redirectPath = '/patient/dashboard';
    if (user.role === 'DOCTOR') redirectPath = '/doctor/dashboard';
    else if (user.role === 'ADMIN') redirectPath = '/admin/accounts';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

/**
 * Guard for role-restricted routes: gates by user type.
 */
export const RoleGuard = ({ allowedRole, children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-800" />
      </div>
    );
  }

  if (!user || user.role !== allowedRole) {
    let fallbackPath = '/';
    if (user?.role === 'DOCTOR') fallbackPath = '/doctor/dashboard';
    else if (user?.role === 'PATIENT') fallbackPath = '/patient/dashboard';
    else if (user?.role === 'ADMIN') fallbackPath = '/admin/accounts';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

/**
 * Guard to ensure users complete clinic invite / profile details onboarding before using dashboard features.
 */
export const OnboardingGuard = ({ allowedRole, children }) => {
  const { user } = useAuth();
  
  // Admin role does not have any profile onboarding flow
  if (user?.role === 'ADMIN') {
    return children;
  }

  const { profile, isLoading } = useProfile(user?.role);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-800" />
      </div>
    );
  }

  const isClinicComplete = !!profile?.clinicId;
  const isProfileComplete = user?.role === 'DOCTOR'
    ? (!!profile?.firstName?.trim() && !!profile?.specialty?.trim())
    : !!profile?.firstName?.trim();

  // Doctors must create/join a clinic; Patients only require profile details (clinic is optional)
  const isOnboarded = user?.role === 'DOCTOR'
    ? (isClinicComplete && isProfileComplete)
    : isProfileComplete;

  if (!isOnboarded) {
    const onboardingPath = user?.role === 'DOCTOR' ? '/doctor/onboarding' : '/patient/onboarding';
    return <Navigate to={onboardingPath} replace />;
  }

  return children;
};
