import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { RegisterSchema } from '../schemas/auth.schema.js';
import { useAuth } from '../hooks/useAuth.js';
import LoadingButton from './LoadingButton.jsx';
import FormError from './FormError.jsx';
import PasswordInput from './PasswordInput.jsx';
import RoleSelector from './RoleSelector.jsx';

const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'PATIENT',
    },
  });

  const onSubmit = async (values) => {
    try {
      setApiError(null);
      
      const payload = {
        email: values.email,
        password: values.password,
        role: values.role,
      };

      const data = await registerUser(payload);
      if (data && data.user) {
        const dest = data.user.role === 'ADMIN' 
          ? '/admin/accounts' 
          : data.user.role === 'DOCTOR' 
            ? '/doctor/onboarding' 
            : '/patient/onboarding';
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setApiError(err.response?.data?.error || 'Registration failed. Please check inputs and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      {/* API Level Error Banner */}
      <FormError message={apiError} />

      {/* Role Selection Option Cards */}
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <RoleSelector
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {errors.role && <span className="text-[10px] font-semibold text-red-550">{errors.role.message}</span>}

      {/* Email Address */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          disabled={isSubmitting}
          placeholder="yourname@domain.com"
          {...register('email')}
          className={`w-full rounded-md border bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:bg-neutral-900 dark:text-white dark:focus:border-white ${
            errors.email ? 'border-red-300 focus:border-red-500' : 'border-neutral-200 dark:border-neutral-800'
          }`}
        />
        {errors.email && <span className="text-[10px] font-semibold text-red-550">{errors.email.message}</span>}
      </div>

      {/* Password with Complexity indicators */}
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

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          disabled={isSubmitting}
          placeholder="••••••••"
          {...register('confirmPassword')}
          className={`w-full rounded-md border bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:bg-neutral-900 dark:text-white dark:focus:border-white ${
            errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-neutral-200 dark:border-neutral-800'
          }`}
        />
        {errors.confirmPassword && <span className="text-[10px] font-semibold text-red-550">{errors.confirmPassword.message}</span>}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <LoadingButton type="submit" isLoading={isSubmitting}>
          Create Account
        </LoadingButton>
      </div>

    </form>
  );
};

export default RegisterForm;
