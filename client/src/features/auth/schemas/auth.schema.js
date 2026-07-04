import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  rememberMe: z.boolean().optional(),
});

export const RegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters.' }),
    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters.' }),
    email: z
      .string()
      .min(1, { message: 'Email address is required.' })
      .email({ message: 'Please enter a valid email address.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password.' }),
    role: z.enum(['PATIENT', 'DOCTOR'], {
      required_error: 'Please select a profile type.',
    }),
    specialty: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.role === 'DOCTOR') {
        return !!data.specialty && data.specialty.trim().length >= 2;
      }
      return true;
    },
    {
      message: 'Specialty field is required for Doctors.',
      path: ['specialty'],
    }
  );

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please enter a valid email address.' }),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
