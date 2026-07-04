import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext.jsx';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useToast } from '../../../contexts/ToastContext.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import PageContainer from '../../../components/PageContainer.jsx';
import ConfirmDialog from '../../../components/ConfirmDialog.jsx';
import { Sun, Moon, Bell, ShieldAlert, Key, Trash } from 'lucide-react';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [passwordInput, setPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(true);
  const [marketingIntake, setMarketingIntake] = useState(false);

  // Dialog controls
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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

  const handleNotificationSave = (e) => {
    e.preventDefault();
    addToast('Alert preferences saved successfully.', 'success');
  };

  const handleDeleteAccountConfirm = () => {
    setDeleteConfirmOpen(false);
    addToast('Account deletion request queued (Admin verify required).', 'warning');
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
        
        {/* Left Side: Theme & Alerts Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Theme Selection */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6 flex items-center gap-2">
              <Sun className="h-4.5 w-4.5 text-indigo-500" />
              <span>Theme Preference</span>
            </h3>

            <div className="flex gap-4">
              <button
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer select-none transition-all duration-200 ${
                  theme === 'light'
                    ? 'border-neutral-950 bg-neutral-50/50 text-neutral-950 dark:border-white dark:bg-neutral-800 dark:text-white'
                    : 'border-neutral-200 text-neutral-400 hover:border-neutral-350 dark:border-neutral-800 dark:hover:border-neutral-700'
                }`}
              >
                <Sun className="h-6 w-6" />
                <span className="mt-2 text-xs font-bold">Light Workspace</span>
              </button>

              <button
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer select-none transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border-neutral-950 bg-neutral-50/50 text-neutral-950 dark:border-white dark:bg-neutral-800 dark:text-white'
                    : 'border-neutral-200 text-neutral-400 hover:border-neutral-350 dark:border-neutral-800 dark:hover:border-neutral-700'
                }`}
              >
                <Moon className="h-6 w-6" />
                <span className="mt-2 text-xs font-bold">Dark Workspace</span>
              </button>
            </div>
          </div>

          {/* Notifications Preferences */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6 flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-indigo-500" />
              <span>Alert Preferences</span>
            </h3>

            <form onSubmit={handleNotificationSave} className="space-y-4">
              <div className="space-y-3.5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="mt-1 h-3.5 w-3.5 rounded border-neutral-200 accent-neutral-955"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">Email Health Digests</span>
                    <p className="text-[10px] text-neutral-450 mt-0.5 leading-relaxed">
                      Receive weekly summaries detailing clinical contexts and symptom changes.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sessionCompleted}
                    onChange={(e) => setSessionCompleted(e.target.checked)}
                    className="mt-1 h-3.5 w-3.5 rounded border-neutral-200 accent-neutral-955"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">Finalized Intake Alerts</span>
                    <p className="text-[10px] text-neutral-450 mt-0.5 leading-relaxed">
                      Get alert badges instantly once your clinician finishes auditing logs (Socket.IO target).
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingIntake}
                    onChange={(e) => setMarketingIntake(e.target.checked)}
                    className="mt-1 h-3.5 w-3.5 rounded border-neutral-200 accent-neutral-955"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">Product Updates</span>
                    <p className="text-[10px] text-neutral-450 mt-0.5 leading-relaxed">
                      Stay informed of upcoming voice engine milestones and platform upgrades.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors"
                >
                  Save Alerts
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Change Password & Danger Zone */}
        <div className="space-y-6">
          
          {/* Change Credentials */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6 flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-indigo-500" />
              <span>Modify Password</span>
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-neutral-900 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors"
              >
                Change Password
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/20 p-6 dark:border-rose-950/20 dark:bg-rose-950/5 space-y-4">
            <h3 className="text-sm font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <Trash className="h-4.5 w-4.5" />
              <span>Danger Zone</span>
            </h3>
            
            <p className="text-[11px] leading-relaxed text-rose-850/80 dark:text-rose-455">
              Permanently delete your CortexCare account, historical voice transcript files, and AI context summary logs.
            </p>

            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="w-full rounded-lg bg-rose-600 hover:bg-rose-700 py-2 text-xs font-bold text-white transition-colors"
            >
              Deactivate Account
            </button>
          </div>

        </div>
      </div>

      {/* Confirmation modal */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Deactivate Account"
        message="Are you sure you want to deactivate your CortexCare clinical account? This will permanently wipe your PostgreSQL records and Cloudinary media."
        confirmLabel="Deactivate"
        cancelLabel="Cancel"
        onConfirm={handleDeleteAccountConfirm}
        onCancel={() => setDeleteConfirmOpen(false)}
        isDanger={true}
      />
    </PageContainer>
  );
};

export default SettingsPage;
