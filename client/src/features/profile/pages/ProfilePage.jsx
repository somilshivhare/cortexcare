import React, { useState, useRef } from 'react';
import { useProfile } from '../hooks/useProfile.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useToast } from '../../../contexts/ToastContext.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import PageContainer from '../../../components/PageContainer.jsx';
import Avatar from '../../../components/Avatar.jsx';
import Spinner from '../../../components/Spinner.jsx';
import { Upload, Trash2, Shield, Mail, Building, Plus } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { profile, avatarUrl, updateAvatar, updateProfile, isUpdating, isLoading } = useProfile(user?.role);
  const fileInputRef = useRef(null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialty, setSpecialty] = useState('');

  // Sync profile data once loaded
  React.useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setSpecialty(profile.specialty || '');
    }
  }, [profile]);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Profile Settings" breadcrumbs={[{ name: 'Workspace' }, { name: 'Profile' }]} />
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      </PageContainer>
    );
  }

  // Handle Avatar uploads
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 2MB)
    if (file.size > 2 * 1024 * 1024) {
      addToast('Image size must be less than 2MB.', 'error');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      addToast('Only JPEG, PNG, or WebP files are supported.', 'error');
      return;
    }

    // Read file and convert to Base64 (Simulating Cloudinary upload output URL)
    const reader = new FileReader();
    reader.onload = () => {
      updateAvatar(reader.result);
      addToast('Profile avatar uploaded successfully (Cloudinary Ready).', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    updateAvatar('');
    addToast('Profile avatar removed.', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      addToast('First and last names are required.', 'error');
      return;
    }

    try {
      const payload = { firstName, lastName };
      if (user?.role === 'DOCTOR') {
        payload.specialty = specialty;
      }
      await updateProfile(payload);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update profile.', 'error');
    }
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let completedFields = 0;
    let totalFields = 5;

    if (firstName) completedFields++;
    if (lastName) completedFields++;
    if (avatarUrl) completedFields++;
    if (profile?.clinicId) completedFields++;
    
    if (user?.role === 'DOCTOR') {
      if (specialty) completedFields++;
    } else {
      // Patients count email or user details as the 5th
      if (user?.email) completedFields++;
    }

    return Math.round((completedFields / totalFields) * 100);
  };

  const completionPct = calculateCompletion();
  const displayName = profile ? `${profile.firstName} ${profile.lastName}` : user?.email;

  return (
    <PageContainer>
      <PageHeader 
        title="Profile Settings" 
        breadcrumbs={[
          { name: 'Workspace', path: user?.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard' }, 
          { name: 'Profile' }
        ]} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Card: Avatar & Completion Status */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs space-y-6 text-center">
          
          <div className="flex flex-col items-center">
            <Avatar src={avatarUrl} name={displayName} size="xl" className="shadow-xs" />
            
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-350 dark:hover:bg-neutral-800 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload</span>
              </button>
              
              {avatarUrl && (
                <button
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Profile Completion Bar */}
          <div className="space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-800 text-left">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-450">
              <span>Profile Completion</span>
              <span>{completionPct}%</span>
            </div>
            <div className="h-2 w-full bg-neutral-150 rounded-full dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <p className="text-[10px] text-neutral-400 leading-normal">
              Media binaries are stored in Cloudinary, with only target URLs saved inside the Neon PostgreSQL schema.
            </p>
          </div>
        </div>

        {/* Right Card: Demographics Editor */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
            Demographic Information
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lastName" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>
            </div>

            {/* Specialty (Conditional) */}
            {user?.role === 'DOCTOR' && (
              <div className="space-y-1.5">
                <label htmlFor="specialty" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Medical Specialty
                </label>
                <input
                  id="specialty"
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Psychiatry, Neurology"
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>
            )}

            {/* Email (Readonly) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Email Address
              </label>
              <div className="flex items-center gap-2 rounded-md bg-neutral-50 px-3 py-2 border border-neutral-150 text-xs text-neutral-500 dark:bg-neutral-950 dark:border-neutral-850">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
            </div>

            {/* Clinic details */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Clinic Affiliation
              </label>
              <div className="flex items-center gap-2 rounded-md bg-neutral-50 px-3 py-2 border border-neutral-150 text-xs text-neutral-500 dark:bg-neutral-950 dark:border-neutral-850">
                <Building className="h-4 w-4" />
                <span>
                  {profile?.clinic?.name || 'No clinic linked. Go to Clinic tab to enroll.'}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-lg bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Saving Changes...' : 'Save Demographics'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </PageContainer>
  );
};

export default ProfilePage;
