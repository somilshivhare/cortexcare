import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useProfile } from '../../profile/hooks/useProfile.js';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import api from '../../../services/api.js';
import LoadingButton from '../components/LoadingButton.jsx';
import FormError from '../components/FormError.jsx';
import Spinner from '../../../components/Spinner.jsx';

const PatientOnboardingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, isLoading, updateProfile } = useProfile(user?.role);
  
  const [inviteCode, setInviteCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-neutral-950">
        <Spinner />
      </div>
    );
  }

  // If already onboarded, redirect straight to dashboard
  const isClinicComplete = !!profile?.clinicId;
  const isProfileComplete = !!profile?.firstName?.trim();
  if (isClinicComplete && isProfileComplete) {
    return <Navigate to="/patient/dashboard" replace />;
  }

  const handleJoinClinic = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setApiError('Please enter a valid clinic invite code.');
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);
      await api.post('/clinic/join', { code: inviteCode.trim() });
      
      // Force reload page / reload profile query to advance to step 2
      window.location.reload();
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to join clinic. Please verify code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setApiError('First and Last name are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);
      
      // Update patient profile details
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
      });

      // Navigate to dashboard
      navigate('/patient/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
        <div>
          <h2 className="text-center text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {!isClinicComplete ? '1. Link Clinic Workspace' : '2. Setup Patient Profile'}
          </h2>
          <p className="mt-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
            {!isClinicComplete
              ? 'Please enter your clinic invite code to link your workspace.'
              : 'Fill in your basic identity details to complete onboarding.'}
          </p>
        </div>

        <FormError message={apiError} />

        {!isClinicComplete ? (
          <form onSubmit={handleJoinClinic} className="space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="inviteCode" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                Clinic Invite Code
              </label>
              <input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="e.g. CC-123456"
                required
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
              />
            </div>

            <LoadingButton type="submit" isLoading={isSubmitting}>
              Join Clinic Workspace
            </LoadingButton>
          </form>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lastName" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phoneNumber" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="address" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                Home Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, Country"
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
              />
            </div>

            <div className="pt-2">
              <LoadingButton type="submit" isLoading={isSubmitting}>
                Complete Profile Setup
              </LoadingButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PatientOnboardingPage;
