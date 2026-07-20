import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import Avatar from '../components/Avatar.jsx';
import { useNotifications, NotificationDrawer, NotificationBadge } from '../features/notifications/index.js';
import { useProfile } from '../features/profile/hooks/useProfile.js';
import {
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  Mic,
  FileText,
  Calendar,
  Hospital,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  HelpCircle,
  Activity,
  Sparkles
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isDoctor = user?.role === 'DOCTOR';

  // Read Avatar image from our simulated profile hook
  const { avatarUrl } = useProfile(user?.role);
  
  // Read notifications
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = (notification) => {
    // 1. Mark as read
    markAsRead(notification.id);
    
    // 2. Close drawer
    setNotificationsOpen(false);

    // 3. Navigate based on type
    const rolePrefix = isDoctor ? '/doctor' : '/patient';
    const title = notification.title.toLowerCase();

    if (title.includes('consent')) {
      navigate(`${rolePrefix}/settings`);
    } else if (title.includes('clinic')) {
      navigate(`${rolePrefix}/clinic`);
    } else if (title.includes('analysis finalized') || title.includes('gemini')) {
      const consultId = notification.consultationId || '5928';
      if (isDoctor) {
        navigate(`/doctor/consultation/${consultId}`);
      } else {
        navigate(`/patient/timeline/${consultId}`);
      }
    }
  };

  // Navigation items configured by user role
  const patientNavItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard, isComingSoon: false },
    { name: 'Consultations', path: '/patient/consultation', icon: Mic, isComingSoon: false },
    { name: 'Clinical Context', path: '/patient/clinical-context', icon: FileText, isComingSoon: false },
    { name: 'Clinic', path: '/patient/clinic', icon: Hospital, isComingSoon: false },
    { name: 'Profile', path: '/patient/profile', icon: User, isComingSoon: false },
    { name: 'Settings', path: '/patient/settings', icon: Settings, isComingSoon: false },
  ];

  const doctorNavItems = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard, isComingSoon: false },
    { name: 'Patients', path: '/doctor/patients', icon: User, isComingSoon: false },
    { name: 'Clinic', path: '/doctor/clinic', icon: Hospital, isComingSoon: false },
    { name: 'Profile', path: '/doctor/profile', icon: User, isComingSoon: false },
    { name: 'Settings', path: '/doctor/settings', icon: Settings, isComingSoon: false },
  ];

  const navItems = isDoctor ? doctorNavItems : patientNavItems;

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const activeItem = navItems.find((item) => location.pathname === item.path) || navItems[0];
  const displayName = user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex min-h-screen bg-neutral-50/50 text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-50">
      
      {/* 1. Left Sticky Sidebar (Desktop Layout) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-neutral-200/80 bg-white/80 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80">
        {/* Sidebar Header */}
        <div className="flex h-16 items-center px-6 border-b border-neutral-200/80 dark:border-neutral-800/80 gap-2.5">
          <div className="h-6 w-6 rounded bg-neutral-900 dark:bg-neutral-50 flex items-center justify-center">
            <span className="text-[10px] font-black text-white dark:text-neutral-950">CC</span>
          </div>
          <span className="font-bold tracking-tight">CortexCare</span>
          <span className="text-[9px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded px-1 py-0.5">
            v1.0
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-current' : 'text-neutral-400 group-hover:text-current'}`} />
                  <span>{item.name}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Section */}
        <div className="p-4 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-3.5">
          <div className="flex items-center gap-3 px-2">
            <Avatar src={avatarUrl} name={displayName} size="sm" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-450">
                {user?.role}
              </span>
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-350 truncate">
                {user?.email}
              </span>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-1 rounded-lg border border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50 transition-colors shrink-0"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 py-2 text-xs font-bold text-neutral-700 dark:border-neutral-800 dark:text-neutral-350 dark:hover:bg-neutral-850/50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Nav Header Overlay & Menu Drawer */}
      <div className="flex flex-col flex-1 md:pl-64 min-w-0">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 dark:border-neutral-800/80 dark:bg-neutral-900/80">
          
          <div className="flex items-center gap-3">
            {/* Hamburger button on Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Path */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold uppercase tracking-wider">
              <span>{user?.role}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-neutral-900 dark:text-neutral-100">{activeItem?.name}</span>
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3.5">
            {/* Notifications Drawer Button */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-500 hover:text-neutral-955 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
            >
              <Bell className="h-4.5 w-4.5" />
              <NotificationBadge count={unreadCount} />
            </button>

            {/* Theme Toggle (Mobile specific fallback position) */}
            <button
              onClick={toggleTheme}
              className="md:hidden p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" title="System Online" />
          </div>

        </header>

        {/* 3. Main Outlet Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto min-w-0">
          <Outlet />
        </main>
      </div>

      {/* 4. Mobile Navigation Drawer Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-neutral-900/20 backdrop-blur-xs">
          <div className="relative flex w-full max-w-xs flex-col bg-white dark:bg-neutral-900 h-full shadow-xl animate-slide-in">
            
            {/* Close Mobile Drawer */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
              <span className="font-bold tracking-tight">CortexCare</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Drawer List */}
            <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 group text-left ${
                      isActive
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.name}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* User Drawer Footer */}
            <div className="p-4 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-3.5">
              <div className="flex items-center gap-3 px-2">
                <Avatar src={avatarUrl} name={displayName} size="sm" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                    {user?.role}
                  </span>
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-350 truncate">
                    {user?.email}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 py-2 text-xs font-bold text-neutral-700 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. Notifications Drawer Overlay */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllRead={markAllAsRead}
      />
    </div>
  );
};

export default DashboardLayout;
