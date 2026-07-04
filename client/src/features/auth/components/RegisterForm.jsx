import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RegisterSchema } from '../schemas/auth.schema.js';
import { useAuth } from '../hooks/useAuth.js';
import { getDashboardRedirect } from '../utils/redirection.js';
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
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'PATIENT',
      specialty: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values) => {
    try {
      setApiError(null);
      
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
      };

      if (values.role === 'DOCTOR') {
        payload.specialty = values.specialty;
      }

      const data = await registerUser(payload);
      if (data && data.user) {
        const dest = getDashboardRedirect(data.user.role);
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
            onChange={(val) => {
              field.onChange(val);
              if (val === 'PATIENT') setValue('specialty', ''); // clear specialty
            }}
          />
        )}
      />
      {errors.role && <span className="text-[10px] font-semibold text-red-550">{errors.role.message}</span>}

      {/* Names row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            disabled={isSubmitting}
            placeholder="John"
            {...register('firstName')}
            className={`w-full rounded-md border bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:bg-neutral-900 dark:text-white dark:focus:border-white ${
              errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-neutral-200 dark:border-neutral-800'
            }`}
          />
          {errors.firstName && <span className="text-[10px] font-semibold text-red-550">{errors.firstName.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lastName" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            disabled={isSubmitting}
            placeholder="Doe"
            {...register('lastName')}
            className={`w-full rounded-md border bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:bg-neutral-900 dark:text-white dark:focus:border-white ${
              errors.lastName ? 'border-red-300 focus:border-red-500' : 'border-neutral-200 dark:border-neutral-800'
            }`}
          />
          {errors.lastName && <span className="text-[10px] font-semibold text-red-550">{errors.lastName.message}</span>}
        </div>
      </div>

      {/* Specialty field (Doctor role conditional slide-down) */}
      <AnimatePresence>
        {selectedRole === 'DOCTOR' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden space-y-1.5"
          >
            <label htmlFor="specialty" className="text-[10px] font-bold uppercase tracking-wider text-neutral-450">
              Medical Specialty
            </label>
            <input
              id="specialty"
              type="text"
              disabled={isSubmitting}
              placeholder="Neurology, Cardiology, etc."
              {...register('specialty')}
              className={`w-full rounded-md border bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition-colors focus:border-neutral-950 dark:bg-neutral-900 dark:text-white dark:focus:border-white ${
                errors.specialty ? 'border-red-300 focus:border-red-500' : 'border-neutral-200 dark:border-neutral-800'
              }`}
            />
            {errors.specialty && <span className="text-[10px] font-semibold text-red-550">{errors.specialty.message}</span>}
          </motion.div>
        )}
      </AnimatePresence>

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
          Create Workspace
        </LoadingButton>
      </div>

    </form>
  );
};

export default RegisterForm;
