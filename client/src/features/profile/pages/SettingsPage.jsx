import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext.jsx';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useToast } from '../../../contexts/ToastContext.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import PageContainer from '../../../components/PageContainer.jsx';
import api from '../../../services/api.js';
import { Sun, Moon, Bell, Key, Trash } from 'lucide-react';

const SettingsInput = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{label}</label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
    />
  </div>
);

const AlertCheckbox = ({ label, description, checked, onChange }) => (
  <label className="flex items-start gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-1 h-3.5 w-3.5 rounded border-neutral-200 accent-neutral-955"
    />
    <div>
      <span className="text-xs font-bold text-neutral-900 dark:text-white">{label}</span>
      <p className="text-[10px] text-neutral-450 mt-0.5 leading-relaxed">{description}</p>
    </div>
  </label>
);

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const [passwordInput, setPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(true);
  const [marketingIntake, setMarketingIntake] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwordInput || !newPasswordInput || !confirmPasswordInput) {
      addToast('All password fields are required.', 'error');
      return;
    }
    if (newPasswordInput.length < 8) {
      addToast('New password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    addToast('Password updated successfully (Local Security Mock).', 'success');
    setPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  const handleDeleteAccountConfirm = async () => {
    if (deleteInput !== 'delete my account') return;
    try {
      setIsDeleting(true);
      await api.delete('/auth/account');
      addToast('Your account was successfully deleted.', 'success');
      await logout();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to delete account.', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setDeleteInput('');
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Account Settings" 
        breadcrumbs={[
          { name: 'Workspace', path: user?.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard' }, 
          { name: 'Settings' }
        ]} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6 flex items-center gap-2">
              <Sun className="h-4.5 w-4.5 text-indigo-500" /><span>Theme Preference</span>
            </h3>
            <div className="flex gap-4">
              {['light', 'dark'].map((t) => (
                <button
                  key={t}
                  onClick={() => theme !== t && toggleTheme()}
                  className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer select-none transition-all duration-200 ${
                    theme === t
                      ? 'border-neutral-950 bg-neutral-50/50 text-neutral-950 dark:border-white dark:bg-neutral-800 dark:text-white'
                      : 'border-neutral-200 text-neutral-400 hover:border-neutral-350 dark:border-neutral-800 dark:hover:border-neutral-700'
                  }`}
                >
                  {t === 'light' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                  <span className="mt-2 text-xs font-bold uppercase tracking-wider text-[10px]">
                    {t === 'light' ? 'Light Workspace' : 'Dark Workspace'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6 flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-indigo-500" /><span>Alert Preferences</span>
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); addToast('Alert preferences saved.', 'success'); }} className="space-y-4">
              <div className="space-y-3.5">
                <AlertCheckbox label="Email Health Digests" description="Receive weekly summaries detailing clinical contexts and symptom changes." checked={emailAlerts} onChange={setEmailAlerts} />
                <AlertCheckbox label="Finalized Intake Alerts" description="Get alert badges instantly once your clinician finishes auditing logs." checked={sessionCompleted} onChange={setSessionCompleted} />
                <AlertCheckbox label="Product Updates" description="Stay informed of upcoming voice engine milestones and platform upgrades." checked={marketingIntake} onChange={setMarketingIntake} />
              </div>
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button type="submit" className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-955 transition-colors">
                  Save Alerts
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6 flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-indigo-500" /><span>Modify Password</span>
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <SettingsInput label="Current Password" value={passwordInput} onChange={setPasswordInput} />
              <SettingsInput label="New Password" value={newPasswordInput} onChange={setNewPasswordInput} />
              <SettingsInput label="Confirm New Password" value={confirmPasswordInput} onChange={setConfirmPasswordInput} />
              <button type="submit" className="w-full rounded-lg bg-neutral-900 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors">
                Change Password
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-rose-250 bg-rose-50/20 p-6 dark:border-rose-950/20 dark:bg-rose-950/5 space-y-4">
            <h3 className="text-sm font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <Trash className="h-4.5 w-4.5" /><span>Danger Zone</span>
            </h3>
            <p className="text-[11px] leading-relaxed text-rose-850/80 dark:text-rose-455">
              Permanently delete your CortexCare account, historical voice transcript files, and AI context summary logs.
            </p>
            <button onClick={() => setDeleteConfirmOpen(true)} className="w-full rounded-lg bg-rose-600 hover:bg-rose-700 py-2 text-xs font-bold text-white transition-colors">
              Deactivate Account
            </button>
          </div>
        </div>
      </div>

      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-rose-250/20 bg-white p-6 shadow-md dark:border-rose-950/20 dark:bg-neutral-900">
            <h3 className="text-sm font-bold text-rose-800 dark:text-rose-400">Confirm Account Deletion</h3>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Are you sure you want to deactivate your CortexCare clinical account? This will permanently wipe your PostgreSQL records, completed clinical contexts, attachments, and active consultations.
            </p>
            <div className="mt-4 space-y-1.5">
              <label htmlFor="confirmInput" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 block">
                Type <span className="text-neutral-900 dark:text-white font-black select-none">delete my account</span> to confirm:
              </label>
              <input
                id="confirmInput"
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="delete my account"
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-rose-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-rose-500 transition-colors"
              />
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => { setDeleteConfirmOpen(false); setDeleteInput(''); }}
                className="rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteInput !== 'delete my account' || isDeleting}
                onClick={handleDeleteAccountConfirm}
                className="rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default SettingsPage;
