import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Standard Dashboard shell with role-aware header navigation and profile settings.
 */
const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isDoctor = user?.role === 'DOCTOR';

  // Navigation tabs configured by user role
  const navItems = isDoctor
    ? [
        { name: 'Dashboard', path: '/doctor/dashboard' },
        { name: 'Clinic', path: '/doctor/clinic' },
        { name: 'Profile', path: '/doctor/profile' },
      ]
    : [
        { name: 'Dashboard', path: '/patient/dashboard' },
        { name: 'Profile', path: '/patient/profile' },
      ];

  return (
    <div className="min-h-screen w-full bg-neutral-50/50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded bg-neutral-900 dark:bg-neutral-50" />
              <span className="font-bold tracking-tight">CortexCare</span>
            </Link>

            {/* Navigation links */}
            <nav className="hidden space-x-1 sm:flex">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-50'
                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {user?.role}
              </span>
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                {user?.email}
              </span>
            </div>

            <button
              onClick={logout}
              className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800/50"
            >
              Sign Out
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
