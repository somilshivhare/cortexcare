import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { LoginSchema } from '../schemas/auth.schema.js';
import { useAuth } from '../hooks/useAuth.js';
import { getDashboardRedirect } from '../utils/redirection.js';
import LoadingButton from './LoadingButton.jsx';
import FormError from './FormError.jsx';
import PasswordInput from './PasswordInput.jsx';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const passwordVal = watch('password', '');

  const onSubmit = async (values) => {
    try {
      setApiError(null);
      const data = await login({
        email: values.email,
        password: values.password,
      });
      // Redirect based on role helper
      if (data && data.user) {
        const dest = getDashboardRedirect(data.user.role);
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setApiError(err.response?.data?.error || 'Invalid credentials. Please verify and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* API Level Error Banner */}
      <FormError message={apiError} />

      {/* Email Address */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          disabled={isSubmitting}
          placeholder="doctor@cortexcare.app"
          {...register('email')}
          className={`w-full rounded-md border bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:bg-neutral-900 dark:text-white dark:focus:border-white ${
            errors.email ? 'border-red-300 focus:border-red-500' : 'border-neutral-200 dark:border-neutral-800'
          }`}
        />
        {errors.email && <span className="text-[10px] font-semibold text-red-550">{errors.email.message}</span>}
      </div>

      {/* Password Input with live checks */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <PasswordInput
            value={field.value}
            onChange={field.onChange}
            error={errors.password}
            placeholder="••••••••"
          />
        )}
      />

      {/* Remember me & Forgot Password links */}
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center space-x-2 text-neutral-500 cursor-pointer select-none">
          <input
            type="checkbox"
            disabled={isSubmitting}
            {...register('rememberMe')}
            className="rounded border-neutral-300 text-neutral-900 focus:ring-0 dark:border-neutral-750"
          />
          <span>Remember me</span>
        </label>
        <Link
          to="/auth/forgot-password"
          className="font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-450 dark:hover:text-white transition-colors"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Action Submit */}
      <LoadingButton type="submit" isLoading={isSubmitting}>
        Sign In
      </LoadingButton>

    </form>
  );
};

export default LoginForm;
