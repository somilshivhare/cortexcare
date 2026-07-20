import React, { useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useProfile } from '../../profile/hooks/useProfile.js';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import api from '../../../services/api.js';
import LoadingButton from '../components/LoadingButton.jsx';
import FormError from '../components/FormError.jsx';
import Spinner from '../../../components/Spinner.jsx';
import { Upload, Trash2 } from 'lucide-react';

const DoctorOnboardingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, isLoading, updateProfile } = useProfile(user?.role);
  const fileInputRef = useRef(null);
  
  const [clinicAction, setClinicAction] = useState('create'); // 'create' or 'join'
  
  // Clinic inputs
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicPhoneNumber, setClinicPhoneNumber] = useState('');
  const [clinicTimings, setClinicTimings] = useState('');
  const [clinicLogo, setClinicLogo] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  // Doctor inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [bio, setBio] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-neutral-950">
        <Spinner />
      </div>
    );
  }

  const isClinicComplete = !!profile?.clinicId;
  const isProfileComplete = !!profile?.firstName?.trim() && !!profile?.specialty?.trim();
  if (isClinicComplete && isProfileComplete) {
    return <Navigate to="/doctor/dashboard" replace />;
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setApiError('Logo image must be less than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setClinicLogo(reader.result);
    reader.readAsDataURL(file);
  };

  const handleClinicStep = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setApiError(null);

      if (clinicAction === 'create') {
        if (!clinicName.trim()) {
          setApiError('Clinic name is required.');
          return;
        }
        await api.post('/clinic', {
          name: clinicName.trim(),
          address: clinicAddress.trim() || null,
          phoneNumber: clinicPhoneNumber.trim() || null,
          timings: clinicTimings.trim() || null,
          logoUrl: clinicLogo || null,
        });
      } else {
        if (!inviteCode.trim()) {
          setApiError('Invite code is required.');
          return;
        }
        await api.post('/clinic/join', { code: inviteCode.trim() });
      }
      
      window.location.reload();
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to complete clinic step.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !specialty.trim()) {
      setApiError('First Name, Last Name, and Specialty are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);
      
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        specialty: specialty.trim(),
        licenseNumber: licenseNumber.trim() || null,
        bio: bio.trim() || null,
      });

      navigate('/doctor/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to save profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8 dark:bg-neutral-950">
      <div className="w-full max-w-xl space-y-6 rounded-2xl border border-neutral-200/80 bg-white p-6 md:p-8 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
        <div>
          <h2 className="text-center text-lg font-bold tracking-tight text-neutral-900 dark:text-white uppercase">
            {!isClinicComplete ? '1. Link Clinic Workspace' : '2. Setup Professional Details'}
          </h2>
          <p className="mt-1 text-center text-xs text-neutral-500 dark:text-neutral-400">
            {!isClinicComplete
              ? 'Please create a new clinic workspace or join an existing one.'
              : 'Complete your professional credentials and clinical bio.'}
          </p>
        </div>

        <FormError message={apiError} />

        {!isClinicComplete ? (
          <form onSubmit={handleClinicStep} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {['create', 'join'].map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => setClinicAction(action)}
                  className={`py-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg border text-center transition-colors ${
                    clinicAction === action
                      ? 'bg-neutral-950 border-neutral-950 text-white dark:bg-white dark:border-white dark:text-neutral-955'
                      : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800'
                  }`}
                >
                  {action === 'create' ? 'Create Clinic' : 'Join Clinic'}
                </button>
              ))}
            </div>

            {clinicAction === 'create' ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/20">
                  {clinicLogo ? (
                    <img src={clinicLogo} alt="Clinic Logo" className="h-16 w-16 rounded-lg object-cover border border-neutral-200 dark:border-neutral-800" />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 text-[10px] font-bold uppercase">Logo</div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-250 bg-white px-3 py-1.5 text-[10px] font-bold uppercase text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-850"
                    >
                      <Upload className="h-3 w-3" /> Upload Logo
                    </button>
                    {clinicLogo && (
                      <button
                        type="button"
                        onClick={() => setClinicLogo('')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase text-rose-600 hover:bg-rose-50 dark:border-rose-950/20 dark:bg-neutral-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="clinicName" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Clinic Name *</label>
                    <input
                      id="clinicName"
                      type="text"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="e.g. Mercy General Hospital"
                      required
                      className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="clinicPhoneNumber" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Phone Number</label>
                    <input
                      id="clinicPhoneNumber"
                      type="text"
                      value={clinicPhoneNumber}
                      onChange={(e) => setClinicPhoneNumber(e.target.value)}
                      placeholder="e.g. +1 (555) 019-2834"
                      className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="clinicTimings" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Operating Hours</label>
                    <input
                      id="clinicTimings"
                      type="text"
                      value={clinicTimings}
                      onChange={(e) => setClinicTimings(e.target.value)}
                      placeholder="e.g. Mon-Fri: 9AM - 5PM"
                      className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="clinicAddress" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Clinic Address</label>
                    <input
                      id="clinicAddress"
                      type="text"
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      placeholder="e.g. 123 Health Ave, Suite 400, New York, NY"
                      className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 animate-fadeIn">
                <label htmlFor="inviteCode" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">Clinic Invite Code</label>
                <input
                  id="inviteCode"
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="e.g. CC-123456"
                  required
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>
            )}

            <LoadingButton type="submit" isLoading={isSubmitting}>
              {clinicAction === 'create' ? 'Create New Clinic Workspace' : 'Join Clinic Workspace'}
            </LoadingButton>
          </form>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="text-[10px] font-bold uppercase tracking-wider text-neutral-455">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Dr. John"
                  required
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lastName" className="text-[10px] font-bold uppercase tracking-wider text-neutral-455">Last Name *</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="specialty" className="text-[10px] font-bold uppercase tracking-wider text-neutral-455">Medical Specialty *</label>
                <input
                  id="specialty"
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Cardiology, Pediatrics, etc."
                  required
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="licenseNumber" className="text-[10px] font-bold uppercase tracking-wider text-neutral-455">Medical License Number</label>
                <input
                  id="licenseNumber"
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. MD-9482103"
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="bio" className="text-[10px] font-bold uppercase tracking-wider text-neutral-455">Professional Biography</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your background, clinical experience, or core specialties..."
                  rows={3}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white resize-none"
                />
              </div>
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

export default DoctorOnboardingPage;
