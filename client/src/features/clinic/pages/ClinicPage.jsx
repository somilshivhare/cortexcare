import React, { useState } from 'react';
import { useClinicDetails, useClinicMembers, useCreateClinic, useJoinClinic, useLeaveClinic, useRegenerateClinicCode } from '../hooks/useClinic.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useToast } from '../../../contexts/ToastContext.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import PageContainer from '../../../components/PageContainer.jsx';
import EmptyState from '../../../components/EmptyState.jsx';
import ErrorState from '../../../components/ErrorState.jsx';
import Spinner from '../../../components/Spinner.jsx';
import Avatar from '../../../components/Avatar.jsx';
import { Building2, Plus, ArrowRight, UserCheck, Shield, Key, ClipboardList, Clock, Phone, MapPin, Search } from 'lucide-react';

const ClinicPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    addToast('Invite code copied to clipboard!', 'success');
  };
  
  const clinicQuery = useClinicDetails();
  const isDoctor = user?.role === 'DOCTOR';
  
  const membersQuery = useClinicMembers(!!clinicQuery.data?.clinic);

  const createMutation = useCreateClinic();
  const joinMutation = useJoinClinic();
  const leaveMutation = useLeaveClinic();
  const regenerateMutation = useRegenerateClinicCode();

  const [clinicNameInput, setClinicNameInput] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');

  // Search states
  const [doctorSearch, setDoctorSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');

  // Detail Modal state
  const [selectedMember, setSelectedMember] = useState(null); // { type: 'DOCTOR'|'PATIENT', data: memberObj }

  const handleCreateClinic = async (e) => {
    e.preventDefault();
    if (!clinicNameInput.trim()) {
      addToast('Clinic name is required.', 'error');
      return;
    }
    try {
      await createMutation.mutateAsync(clinicNameInput);
      addToast('Clinic created successfully!', 'success');
      setClinicNameInput('');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to create clinic.', 'error');
    }
  };

  const handleJoinClinic = async (e) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) {
      addToast('Invite code is required.', 'error');
      return;
    }
    try {
      await joinMutation.mutateAsync(inviteCodeInput);
      addToast('Successfully joined clinic!', 'success');
      setInviteCodeInput('');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to join clinic.', 'error');
    }
  };

  const handleLeaveClinic = async () => {
    if (!window.confirm('Are you sure you want to change your clinic? You will leave your current clinic.')) return;
    try {
      await leaveMutation.mutateAsync();
      addToast('Successfully left clinic!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to leave clinic.', 'error');
    }
  };

  const handleRegenerateCode = async () => {
    if (!window.confirm('Are you sure you want to generate a new invite code? The old code will become invalid immediately.')) return;
    try {
      await regenerateMutation.mutateAsync();
      addToast('New invite code generated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to regenerate code.', 'error');
    }
  };

  const isLoading = clinicQuery.isLoading || (isDoctor && membersQuery.isLoading && !!clinicQuery.data?.clinic);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Clinic Portal" breadcrumbs={[{ name: 'Workspace' }, { name: 'Clinic' }]} />
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner />
        </div>
      </PageContainer>
    );
  }

  if (clinicQuery.isError && clinicQuery.error?.response?.status === 404) {
    return (
      <PageContainer>
        <PageHeader title="Clinic Portal" breadcrumbs={[{ name: 'Workspace' }, { name: 'Clinic' }]} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
              <Key className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Join an Existing Clinic
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Enter the unique invite code provided by your general practitioner or clinic administrator.
            </p>

            <form onSubmit={handleJoinClinic} className="mt-6 space-y-4">
              <input
                type="text"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value)}
                placeholder="e.g. CC-1A2B3C"
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
              />
              <button
                type="submit"
                disabled={joinMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-neutral-900 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-955 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                <span>{joinMutation.isPending ? 'Joining...' : 'Link Clinic Account'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          {isDoctor ? (
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                <Plus className="h-5.5 w-5.5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Create a New Clinic Workspace
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                Create a secure clinic repository. You will receive a unique invite code to share with doctors and patients.
              </p>

              <form onSubmit={handleCreateClinic} className="mt-6 space-y-4">
                <input
                  type="text"
                  value={clinicNameInput}
                  onChange={(e) => setClinicNameInput(e.target.value)}
                  placeholder="e.g. Mercy General Hospital"
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-neutral-900 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-955 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50"
                >
                  <span>{createMutation.isPending ? 'Creating...' : 'Initialize Clinic'}</span>
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-250 bg-neutral-50/50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
              <Building2 className="mx-auto h-10 w-10 text-neutral-350" />
              <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">Awaiting Practitioner Link</h3>
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Patients cannot create clinic instances. Please obtain an invite code from your general practitioner.
              </p>
            </div>
          )}
        </div>
      </PageContainer>
    );
  }

  if (clinicQuery.isError) {
    return (
      <PageContainer>
        <PageHeader title="Clinic Portal" breadcrumbs={[{ name: 'Workspace' }, { name: 'Clinic' }]} />
        <ErrorState title="Failed to Load Clinic" message={clinicQuery.error?.message} onRetry={() => clinicQuery.refetch()} />
      </PageContainer>
    );
  }

  const clinic = clinicQuery.data?.clinic || {};
  const members = membersQuery.data?.members || { doctors: [], patients: [] };

  // Filter lists based on search
  const filteredDoctors = members.doctors.filter((doc) => {
    const fullName = `Dr. ${doc.firstName} ${doc.lastName}`.toLowerCase();
    const specialty = (doc.specialty || 'General Practitioner').toLowerCase();
    const query = doctorSearch.toLowerCase();
    return fullName.includes(query) || specialty.includes(query);
  });

  const filteredPatients = members.patients.filter((pat) => {
    const fullName = `${pat.firstName} ${pat.lastName}`.toLowerCase();
    const query = patientSearch.toLowerCase();
    return fullName.includes(query);
  });

  return (
    <PageContainer>
      <PageHeader 
        title="Clinic Portal" 
        breadcrumbs={[
          { name: 'Workspace', path: isDoctor ? '/doctor/dashboard' : '/patient/dashboard' }, 
          { name: 'Clinic' }
        ]} 
      />

      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-linear-to-r from-neutral-900 via-neutral-850 to-neutral-950 p-6 md:p-8 text-white shadow-xs dark:border-neutral-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent)] pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            {clinic.logoUrl ? (
              <img src={clinic.logoUrl} alt="Clinic Logo" className="h-16 w-16 rounded-xl object-cover border border-white/10 shrink-0" />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-white/10 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">Logo</div>
            )}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                <Building2 className="h-4.5 w-4.5" />
                <span>Affiliated Facility</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                {clinic.name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-neutral-400 font-medium">
                {clinic.timings && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /><span>{clinic.timings}</span>
                  </div>
                )}
                {clinic.phoneNumber && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /><span>{clinic.phoneNumber}</span>
                  </div>
                )}
                {clinic.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /><span>{clinic.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isDoctor && clinic.code && (
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[200px] flex flex-col justify-center relative group shrink-0">
              <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-wider">Invite Code</span>
              <div className="flex items-center justify-between gap-3 mt-1">
                <span className="text-lg font-mono font-bold tracking-widest text-white select-all">
                  {clinic.code}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyCode(clinic.code)}
                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy to Clipboard"
                  >
                    <ClipboardList className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleRegenerateCode}
                    disabled={regenerateMutation.isPending}
                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                    title="Generate New Code"
                  >
                    <Key className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isDoctor && (
            <button
              onClick={handleLeaveClinic}
              disabled={leaveMutation.isPending}
              className="px-4 py-2 rounded-lg bg-red-650 hover:bg-red-700 disabled:opacity-50 text-xs font-bold text-white transition-colors shadow-sm cursor-pointer shrink-0"
            >
              {leaveMutation.isPending ? 'Leaving...' : 'Change Clinic'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-8">
        
        {/* Doctors Directory */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-indigo-500" />
              <span>Staff Directory ({clinic.totalDoctors || 0})</span>
            </h3>
            
            {isDoctor && (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-455" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-full md:w-44 rounded-md border border-neutral-200 bg-white text-[10px] text-neutral-900 outline-none focus:border-neutral-955 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>
            )}
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filteredDoctors.length === 0 ? (
              <p className="py-4 text-xs text-neutral-550">No staff found.</p>
            ) : (
              filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedMember({ type: 'DOCTOR', data: doc })}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0 cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={doc.avatarUrl || localStorage.getItem(`avatar_DOCTOR_${doc.userId}`) || ''} 
                      name={`Dr. ${doc.firstName} ${doc.lastName}`} 
                      size="sm" 
                    />
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Dr. {doc.firstName} {doc.lastName}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-450 uppercase tracking-wider font-semibold">
                    {doc.specialty || 'General Practitioner'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Patients Directory */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="h-4.5 w-4.5 text-emerald-500" />
              <span>Enrolled Patients ({clinic.totalPatients || 0})</span>
            </h3>

            {isDoctor && (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-450" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-full md:w-44 rounded-md border border-neutral-200 bg-white text-[10px] text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>
            )}
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {isDoctor ? (
              filteredPatients.length === 0 ? (
                <p className="py-4 text-xs text-neutral-555">No patients found.</p>
              ) : (
                filteredPatients.map((pat) => (
                  <div
                    key={pat.id}
                    onClick={() => setSelectedMember({ type: 'PATIENT', data: pat })}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar 
                        src={pat.avatarUrl || localStorage.getItem(`avatar_PATIENT_${pat.userId}`) || ''} 
                        name={`${pat.firstName} ${pat.lastName}`} 
                        size="sm" 
                      />
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {pat.firstName} {pat.lastName}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-455 uppercase tracking-wider font-semibold">
                      Registered Patient
                    </span>
                  </div>
                ))
              )
            ) : (
              <div className="py-4 text-xs text-neutral-450 leading-relaxed">
                Patient directory access is restricted to medical staff.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Details View Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar
                src={
                  selectedMember.type === 'DOCTOR'
                    ? (selectedMember.data.avatarUrl || localStorage.getItem(`avatar_DOCTOR_${selectedMember.data.userId}`) || '')
                    : (selectedMember.data.avatarUrl || localStorage.getItem(`avatar_PATIENT_${selectedMember.data.userId}`) || '')
                }
                name={
                  selectedMember.type === 'DOCTOR'
                    ? `Dr. ${selectedMember.data.firstName} ${selectedMember.data.lastName}`
                    : `${selectedMember.data.firstName} ${selectedMember.data.lastName}`
                }
                size="lg"
              />
              
              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  {selectedMember.type === 'DOCTOR' ? 'Practitioner Details' : 'Patient Information'}
                </h3>
                <h4 className="text-base font-bold text-neutral-950 dark:text-white mt-1">
                  {selectedMember.type === 'DOCTOR'
                    ? `Dr. ${selectedMember.data.firstName} ${selectedMember.data.lastName}`
                    : `${selectedMember.data.firstName} ${selectedMember.data.lastName}`}
                </h4>
                <p className="text-xs text-neutral-450 uppercase tracking-wider font-semibold mt-0.5">
                  {selectedMember.type === 'DOCTOR'
                    ? (selectedMember.data.specialty || 'General Practitioner')
                    : 'Registered Patient'}
                </p>
              </div>

              <div className="w-full text-left space-y-3.5 border-t border-neutral-100 pt-4 dark:border-neutral-800 text-xs">
                {selectedMember.type === 'DOCTOR' ? (
                  <>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Email Address</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedMember.data.user?.email || 'Not provided'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Phone Number</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedMember.data.phoneNumber || 'Not provided'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">License Number</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedMember.data.licenseNumber || 'Not provided'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Qualification</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedMember.data.qualification || 'Not provided'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Experience</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedMember.data.experience || 'Not provided'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Biography</span>
                      <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed max-h-32 overflow-y-auto pr-1">
                        {selectedMember.data.bio || 'No professional biography available.'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Email Address</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedMember.data.user?.email || 'Not provided'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Phone Number</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedMember.data.phoneNumber || 'Not provided'}
                      </span>
                    </div>
                    <div className="space-y-1 flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Date of Birth</span>
                        <span className="text-neutral-900 dark:text-white font-medium">
                          {selectedMember.data.dob || 'Not provided'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Gender</span>
                        <span className="text-neutral-900 dark:text-white font-medium">
                          {selectedMember.data.gender || 'Not provided'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Blood Group</span>
                        <span className="text-neutral-900 dark:text-white font-medium">
                          {selectedMember.data.bloodGroup || 'Not provided'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Height / Weight</span>
                        <span className="text-neutral-900 dark:text-white font-medium">
                          {selectedMember.data.height || '--'} / {selectedMember.data.weight || '--'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Allergies</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedMember.data.allergies || 'None reported'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Emergency Contact</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {selectedMember.data.emergencyContact || 'Not provided'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Home Address</span>
                      <p className="text-neutral-550 dark:text-neutral-400 leading-relaxed">
                        {selectedMember.data.address || 'Not provided'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="w-full rounded-lg bg-neutral-950 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default ClinicPage;
