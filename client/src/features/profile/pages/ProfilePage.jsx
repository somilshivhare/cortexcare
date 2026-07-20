import React, { useState, useRef } from 'react';
import { useProfile } from '../hooks/useProfile.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useToast } from '../../../contexts/ToastContext.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import PageContainer from '../../../components/PageContainer.jsx';
import Avatar from '../../../components/Avatar.jsx';
import Spinner from '../../../components/Spinner.jsx';
import { Upload, Trash2, Mail, Building, Clock, Phone, MapPin, Award } from 'lucide-react';

const FormInput = ({ id, label, value, onChange, ...props }) => (
  <div className="space-y-1.5 animate-fadeIn">
    <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
      {label}
    </label>
    <input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
      {...props}
    />
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { profile, avatarUrl, updateAvatar, updateProfile, isUpdating, isLoading } = useProfile(user?.role);
  const fileInputRef = useRef(null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [bio, setBio] = useState('');

  React.useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setPhoneNumber(profile.phoneNumber || '');
      setAddress(profile.address || '');
      setSpecialty(profile.specialty || '');
      setLicenseNumber(profile.licenseNumber || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Profile Settings" breadcrumbs={[{ name: 'Workspace' }, { name: 'Profile' }]} />
        <div className="flex justify-center py-20"><Spinner /></div>
      </PageContainer>
    );
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast('Image size must be less than 2MB.', 'error');
      return;
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      addToast('Only JPEG, PNG, or WebP files are supported.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateAvatar(reader.result);
      addToast('Profile avatar uploaded successfully (Cloudinary Ready).', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      addToast('First and last names are required.', 'error');
      return;
    }
    try {
      const payload = { firstName, lastName, avatarUrl };
      if (user?.role === 'DOCTOR') {
        payload.specialty = specialty;
        payload.licenseNumber = licenseNumber;
        payload.bio = bio;
      } else {
        payload.phoneNumber = phoneNumber;
        payload.address = address;
      }
      await updateProfile(payload);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update profile.', 'error');
    }
  };

  const completionPct = (() => {
    let completed = 0;
    if (firstName) completed++;
    if (lastName) completed++;
    if (avatarUrl) completed++;
    if (profile?.clinicId) completed++;
    if (user?.role === 'DOCTOR' ? specialty : user?.email) completed++;
    return Math.round((completed / 5) * 100);
  })();

  const displayName = profile ? `${profile.firstName} ${profile.lastName}` : user?.email;
  const clinic = profile?.clinic;

  return (
    <PageContainer>
      <PageHeader 
        title="Profile Settings" 
        breadcrumbs={[
          { name: 'Workspace', path: user?.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard' }, 
          { name: 'Profile' }
        ]} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Avatar Panel + Clinic Affiliation Card */}
        <div className="space-y-6">
          {/* Avatar Panel */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs space-y-6 text-center">
            <div className="flex flex-col items-center">
              <Avatar src={avatarUrl} name={displayName} size="xl" className="shadow-xs" />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-350 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" />Upload
                </button>
                {avatarUrl && (
                  <button
                    onClick={() => { updateAvatar(''); addToast('Profile avatar removed.', 'success'); }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />Remove
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            </div>

            <div className="space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-800 text-left">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-450">
                <span>Profile Completion</span>
                <span>{completionPct}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-150 rounded-full dark:bg-neutral-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${completionPct}%` }} />
              </div>
            </div>
          </div>

          {/* Clinic Card */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="h-4.5 w-4.5 text-indigo-500" />
              <span>Clinic Workspace</span>
            </h3>

            {clinic ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {clinic.logoUrl ? (
                    <img src={clinic.logoUrl} alt="Clinic Logo" className="h-12 w-12 rounded-lg object-cover border border-neutral-200 dark:border-neutral-800 shrink-0" />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 text-[10px] font-bold uppercase shrink-0">Logo</div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">{clinic.name}</h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50 px-1.5 py-0.5 border border-neutral-200/80 rounded-md dark:bg-neutral-950 dark:border-neutral-850 mt-1 inline-block">
                      Invite: {clinic.code}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-550 dark:text-neutral-400">
                  {clinic.timings && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{clinic.timings}</span>
                    </div>
                  )}
                  {clinic.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{clinic.phoneNumber}</span>
                    </div>
                  )}
                  {clinic.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400 mt-0.5 shrink-0" />
                      <span>{clinic.address}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-neutral-450 leading-relaxed">
                You are not associated with a clinic workspace. Enroll or create a clinic to enable clinical features.
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Demographics Editor */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
            Demographic Information
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="firstName" label="First Name" type="text" value={firstName} onChange={setFirstName} />
              <FormInput id="lastName" label="Last Name" type="text" value={lastName} onChange={setLastName} />
            </div>

            {user?.role === 'DOCTOR' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput id="specialty" label="Medical Specialty" type="text" value={specialty} onChange={setSpecialty} placeholder="e.g. Psychiatry, Neurology" />
                <FormInput id="licenseNumber" label="Medical License Number" type="text" value={licenseNumber} onChange={setLicenseNumber} placeholder="e.g. MD-9482103" />
                
                <div className="space-y-1.5 md:col-span-2 animate-fadeIn">
                  <label htmlFor="bio" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Professional Biography</label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your background and clinical history..."
                    rows={3}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white resize-none"
                  />
                </div>
              </div>
            )}

            {user?.role === 'PATIENT' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput id="phoneNumber" label="Phone Number" type="text" value={phoneNumber} onChange={setPhoneNumber} placeholder="e.g. +1 (555) 019-2834" />
                <div className="md:col-span-2">
                  <FormInput id="address" label="Home Address" type="text" value={address} onChange={setAddress} placeholder="e.g. 123 Main St, New York, NY 10001" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email Address</label>
              <div className="flex items-center gap-2 rounded-md bg-neutral-50 px-3 py-2 border border-neutral-150 text-xs text-neutral-500 dark:bg-neutral-950 dark:border-neutral-850">
                <Mail className="h-4 w-4" /><span>{user?.email}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-lg bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-955 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50"
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
