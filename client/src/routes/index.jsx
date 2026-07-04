import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { AuthGuard, GuestGuard, RoleGuard } from './guards.jsx';

// Placeholders for foundational routing test validation (no feature pages are created yet)
const LandingPlaceholder = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">CortexCare</h1>
    <p className="mt-2 text-neutral-500">Premium AI-powered clinical workflows.</p>
    <div className="mt-6 flex space-x-4">
      <a href="/auth/login" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
        Access Platform
      </a>
    </div>
  </div>
);

const LoginPlaceholder = () => (
  <div>
    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Sign in to your account</h2>
    <p className="mt-1 text-sm text-neutral-500">Welcome back. Enter your credentials to access the console.</p>
    <div className="mt-6 h-32 rounded bg-neutral-50 border border-dashed border-neutral-200 flex items-center justify-center text-xs text-neutral-400">
      [Login Form Panel Placeholder]
    </div>
  </div>
);

const RegisterPlaceholder = () => (
  <div>
    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Create an account</h2>
    <p className="mt-1 text-sm text-neutral-500">Select your role and initialize your professional profile.</p>
    <div className="mt-6 h-32 rounded bg-neutral-50 border border-dashed border-neutral-200 flex items-center justify-center text-xs text-neutral-400">
      [Registration Form Panel Placeholder]
    </div>
  </div>
);

const PatientDashboardPlaceholder = () => (
  <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
    <h2 className="text-lg font-bold">Patient Dashboard</h2>
    <p className="text-sm text-neutral-500">Chronological history of your voice-intake consultations.</p>
  </div>
);

const PatientProfilePlaceholder = () => (
  <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
    <h2 className="text-lg font-bold">Patient Profile Settings</h2>
    <p className="text-sm text-neutral-500">Edit demographic profile parameters.</p>
  </div>
);

const PatientConsultationPlaceholder = () => (
  <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
    <h2 className="text-lg font-bold">New Voice Intake Session</h2>
    <p className="text-sm text-neutral-500">Establish a secure voice session with CortexCare AI.</p>
  </div>
);

const DoctorDashboardPlaceholder = () => (
  <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
    <h2 className="text-lg font-bold">Clinician Dashboard</h2>
    <p className="text-sm text-neutral-500">Track pending unassigned consultations and claimed sessions.</p>
  </div>
);

const DoctorClinicPlaceholder = () => (
  <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
    <h2 className="text-lg font-bold">Clinic Management Panel</h2>
    <p className="text-sm text-neutral-500">Administer doctors and enrolled patients in your facility.</p>
  </div>
);

const DoctorProfilePlaceholder = () => (
  <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
    <h2 className="text-lg font-bold">Clinician Profile Settings</h2>
    <p className="text-sm text-neutral-500">Edit specialty credentials and metadata.</p>
  </div>
);

const TimelinePlaceholder = () => (
  <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
    <h2 className="text-lg font-bold">Session Event Timeline</h2>
    <p className="text-sm text-neutral-500">Detailed historical event aggregates of this consultation.</p>
  </div>
);

export const router = createBrowserRouter([
  // Public Landing route
  {
    path: '/',
    element: <LandingPlaceholder />,
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
      { path: 'login', element: <LoginPlaceholder /> },
      { path: 'register', element: <RegisterPlaceholder /> },
    ],
  },

  // Protected Patient Routes (guarded by AuthGuard + RoleGuard)
  {
    path: '/patient',
    element: (
      <AuthGuard>
        <RoleGuard allowedRole="PATIENT">
          <DashboardLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { path: 'dashboard', element: <PatientDashboardPlaceholder /> },
      { path: 'profile', element: <PatientProfilePlaceholder /> },
      { path: 'consultation', element: <PatientConsultationPlaceholder /> },
      { path: 'timeline/:consultationId', element: <TimelinePlaceholder /> },
      { path: '', element: <Navigate to="dashboard" replace /> },
    ],
  },

  // Protected Doctor Routes (guarded by AuthGuard + RoleGuard)
  {
    path: '/doctor',
    element: (
      <AuthGuard>
        <RoleGuard allowedRole="DOCTOR">
          <DashboardLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { path: 'dashboard', element: <DoctorDashboardPlaceholder /> },
      { path: 'clinic', element: <DoctorClinicPlaceholder /> },
      { path: 'profile', element: <DoctorProfilePlaceholder /> },
      { path: 'consultation/:consultationId', element: <TimelinePlaceholder /> },
      { path: '', element: <Navigate to="dashboard" replace /> },
    ],
  },

  // Catch-all Redirects
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
