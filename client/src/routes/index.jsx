import React from 'react';
import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import {
  AuthLayout,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage
} from '../features/auth/index.js';
import { PatientDashboard } from '../features/patient/index.js';
import { ClinicalContextHistoryPage } from '../features/clinical-context/index.js';
import { TimelinePage } from '../features/timeline/index.js';
import { ClinicPage } from '../features/clinic/index.js';
import { ProfilePage, SettingsPage } from '../features/profile/index.js';
import { DoctorDashboard, DoctorConsultationDetailPage, DoctorPatientsPage } from '../features/doctor/index.js';
import { AIConsultationPage } from '../features/consultation/index.js';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { AuthGuard, GuestGuard, RoleGuard, OnboardingGuard } from './guards.jsx';
import PatientOnboardingPage from '../features/auth/pages/PatientOnboardingPage.jsx';
import DoctorOnboardingPage from '../features/auth/pages/DoctorOnboardingPage.jsx';
import LandingPage from '../features/landing/pages/LandingPage.jsx';
import { Sparkles, ArrowLeft } from 'lucide-react';

const ComingSoonPlaceholder = ({ moduleName, description }) => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs animate-fade-in">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-855 text-neutral-900 dark:text-white animate-pulse">
        <Sparkles className="h-6 w-6 text-amber-500" />
      </div>
      <h2 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
        {moduleName} - Coming Soon
      </h2>
      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
        {description || 'This feature is under active development. Our engineering team is currently building these interface pipelines.'}
      </p>
      <button
        onClick={() => navigate('/patient/dashboard')}
        className="mt-6 flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Workspace</span>
      </button>
    </div>
  );
};

export const router = createBrowserRouter([
  // Public Landing route
  {
    path: '/',
    element: <LandingPage />,
  },
  
  // Guest Authentication Routes (guarded by GuestGuard)
  {
    path: '/auth',
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
    ],
  },

  // Patient Onboarding Route
  {
    path: '/patient/onboarding',
    element: (
      <AuthGuard>
        <RoleGuard allowedRole="PATIENT">
          <PatientOnboardingPage />
        </RoleGuard>
      </AuthGuard>
    )
  },

  // Protected Patient Routes (guarded by AuthGuard + RoleGuard + OnboardingGuard)
  {
    path: '/patient',
    element: (
      <AuthGuard>
        <RoleGuard allowedRole="PATIENT">
          <OnboardingGuard allowedRole="PATIENT">
            <DashboardLayout />
          </OnboardingGuard>
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { path: 'dashboard', element: <PatientDashboard /> },
      { path: 'consultation/:consultationId?', element: <AIConsultationPage /> },
      { path: 'clinical-context', element: <ClinicalContextHistoryPage /> },
      {
        path: 'timeline',
        element: (
          <ComingSoonPlaceholder
            moduleName="Timeline History"
            description="A visual chronological timeline of your consultation milestones and doctor review audits."
          />
        )
      },
      { path: 'timeline/:consultationId', element: <TimelinePage /> },
      { path: 'clinic', element: <ClinicPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '', element: <Navigate to="dashboard" replace /> },
    ],
  },

  // Doctor Onboarding Route
  {
    path: '/doctor/onboarding',
    element: (
      <AuthGuard>
        <RoleGuard allowedRole="DOCTOR">
          <DoctorOnboardingPage />
        </RoleGuard>
      </AuthGuard>
    )
  },

  // Protected Doctor Routes (guarded by AuthGuard + RoleGuard + OnboardingGuard)
  {
    path: '/doctor',
    element: (
      <AuthGuard>
        <RoleGuard allowedRole="DOCTOR">
          <OnboardingGuard allowedRole="DOCTOR">
            <DashboardLayout />
          </OnboardingGuard>
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { path: 'dashboard', element: <DoctorDashboard /> },
      { path: 'patients', element: <DoctorPatientsPage /> },
      { path: 'patients/:patientId/clinical-context', element: <ClinicalContextHistoryPage /> },
      { path: 'clinic', element: <ClinicPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'consultation/:consultationId', element: <DoctorConsultationDetailPage /> },
      { path: '', element: <Navigate to="dashboard" replace /> },
    ],
  },



  // Catch-all Redirects
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
