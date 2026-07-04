import React, { useState } from 'react';
import { useClinicDetails, useClinicMembers, useCreateClinic, useJoinClinic } from '../hooks/useClinic.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useToast } from '../../../contexts/ToastContext.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import PageContainer from '../../../components/PageContainer.jsx';
import EmptyState from '../../../components/EmptyState.jsx';
import ErrorState from '../../../components/ErrorState.jsx';
import StatCard from '../../../components/StatCard.jsx';
import Spinner from '../../../components/Spinner.jsx';
import { Building2, Plus, ArrowRight, UserCheck, Shield, Key, Sparkles, ClipboardList } from 'lucide-react';

const ClinicPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const clinicQuery = useClinicDetails();
  const isDoctor = user?.role === 'DOCTOR';
  
  // Only doctors can fetch members list
  const membersQuery = useClinicMembers(isDoctor && !!clinicQuery.data?.clinic);

  const createMutation = useCreateClinic();
  const joinMutation = useJoinClinic();

  const [clinicNameInput, setClinicNameInput] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');

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

  // Not in a clinic view
  if (clinicQuery.isError && clinicQuery.error?.response?.status === 404) {
    return (
      <PageContainer>
        <PageHeader title="Clinic Portal" breadcrumbs={[{ name: 'Workspace' }, { name: 'Clinic' }]} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
          {/* Join Clinic Panel */}
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
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-neutral-900 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                <span>{joinMutation.isPending ? 'Joining...' : 'Link Clinic Account'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          {/* Create Clinic Panel (Doctors only) */}
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
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-neutral-900 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50"
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

  // Handle other generic errors
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

  return (
    <PageContainer>
      <PageHeader 
        title="Clinic Portal" 
        breadcrumbs={[
          { name: 'Workspace', path: isDoctor ? '/doctor/dashboard' : '/patient/dashboard' }, 
          { name: 'Clinic' }
        ]} 
      />

      {/* Stats header card */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-linear-to-r from-neutral-900 via-neutral-850 to-neutral-950 p-6 md:p-8 text-white shadow-xs dark:border-neutral-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent)] pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              <Building2 className="h-4.5 w-4.5" />
              <span>Affiliated Facility</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              {clinic.name}
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Review stats, active clinicians, and medical enrollment directories.
            </p>
          </div>

          {/* Doctor Invite Code Card */}
          {isDoctor && clinic.code && (
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[200px] flex flex-col justify-center">
              <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-wider">Invite Code</span>
              <span className="text-lg font-mono font-bold tracking-widest text-white mt-1 select-all">
                {clinic.code}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Members Directory Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-8">
        
        {/* Doctors list */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <Shield className="h-4.5 w-4.5 text-indigo-500" />
            <span>Staff Directory ({clinic.totalDoctors || 0})</span>
          </h3>

          <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
            {isDoctor ? (
              members.doctors.length === 0 ? (
                <p className="py-4 text-xs text-neutral-500">No doctors enrolled.</p>
              ) : (
                members.doctors.map((doc) => (
                  <div key={doc.id} className="flex justify-between py-3 first:pt-0 last:pb-0">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Dr. {doc.firstName} {doc.lastName}
                    </span>
                    <span className="text-[10px] text-neutral-450 uppercase tracking-wider font-semibold">
                      {doc.specialty || 'General Practitioner'}
                    </span>
                  </div>
                ))
              )
            ) : (
              <div className="py-4 text-xs text-neutral-500 leading-relaxed">
                Directory list is restricted to licensed medical practitioners only.
              </div>
            )}
          </div>
        </div>

        {/* Patients list */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <UserCheck className="h-4.5 w-4.5 text-emerald-500" />
            <span>Enrolled Patients ({clinic.totalPatients || 0})</span>
          </h3>

          <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
            {isDoctor ? (
              members.patients.length === 0 ? (
                <p className="py-4 text-xs text-neutral-500">No patients enrolled.</p>
              ) : (
                members.patients.map((pat) => (
                  <div key={pat.id} className="flex justify-between py-3 first:pt-0 last:pb-0">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {pat.firstName} {pat.lastName}
                    </span>
                    <span className="text-[10px] text-neutral-450 uppercase tracking-wider font-semibold">
                      Registered Patient
                    </span>
                  </div>
                ))
              )
            ) : (
              <div className="py-4 text-xs text-neutral-500 leading-relaxed">
                Directory list is restricted to licensed medical practitioners only.
              </div>
            )}
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default ClinicPage;
