import React from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import RegisterForm from '../components/RegisterForm.jsx';
import SocialDivider from '../components/SocialDivider.jsx';

const RegisterPage = () => {
  return (
    <div className="space-y-4">
      <AuthCard
        title="Create CortexCare Workspace"
        subtitle="Set up your secure credentials to isolate clinical consultation files"
      >
        <RegisterForm />
        <SocialDivider />
      </AuthCard>

      <div className="text-center text-xs text-neutral-500">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="font-bold text-neutral-900 hover:underline dark:text-white"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
