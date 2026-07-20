import React from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import LoginForm from '../components/LoginForm.jsx';
import SocialDivider from '../components/SocialDivider.jsx';

const LoginPage = () => {
  console.log('[DEBUG] LoginPage rendered');
  return (
    <div className="space-y-4">
      <AuthCard
        title="Sign In to CortexCare"
        subtitle="Enter your credentials to access your clinical workspace console"
      >
        <LoginForm />
        <SocialDivider />
      </AuthCard>

      <div className="text-center text-xs text-neutral-500">
        Don't have an account?{' '}
        <Link
          to="/auth/register"
          className="font-bold text-neutral-900 hover:underline dark:text-white"
        >
          Create Workspace
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
