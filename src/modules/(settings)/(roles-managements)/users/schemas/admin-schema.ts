import { z } from 'zod';
import type { TFunction } from 'i18next';

const egyptPhoneRegex = /^(010|011|012|015)[0-9]{8}$/;
const internationalPhoneRegex = /^\+?[0-9\s()-]{8,20}$/;

const phoneSchema = (t: TFunction, international = false) =>
  z
    .string()
    .min(1, t('forms.errors.phone.required'))
    .min(8, t('forms.errors.phone.min'))
    .regex(international ? internationalPhoneRegex : egyptPhoneRegex, t('forms.errors.phone.invalid'));

export const createAdminDialogSchema = (t: TFunction) =>
  z
    .object({
      firstName: z
        .string()
        .min(1, t('forms.errors.fullname.required'))
        .min(2, t('forms.errors.fullname.min'))
        .max(50, t('forms.errors.fullname.max'))
        .regex(/^[A-Za-z\u0600-\u06FF\s'-]+$/, t('forms.errors.fullname.invalid')),
      lastName: z
        .string()
        .min(1, t('forms.errors.fullname.required'))
        .min(2, t('forms.errors.fullname.min'))
        .max(50, t('forms.errors.fullname.max'))
        .regex(/^[A-Za-z\u0600-\u06FF\s'-]+$/, t('forms.errors.fullname.invalid')),
      email: z.email(t('forms.errors.email.invalid')),
      roleId: z.string().min(1, t('forms.errors.role.required')),
      phoneNumber: phoneSchema(t, true),
      password: z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      if (!values.password || values.password.length < 8) {
        ctx.addIssue({
          code: 'custom',
          path: ['password'],
          message: t('forms.errors.password.min', { defaultValue: 'Password is required (min 8)' }),
        });
      }

      if (values.password !== values.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          path: ['confirmPassword'],
          message: t('forms.errors.password.mismatch', {
            defaultValue: 'Passwords do not match',
          }),
        });
      }
    });

export type CreateAdminDialogValues = z.infer<ReturnType<typeof createAdminDialogSchema>>;

const adminNameSchema = (t: TFunction) =>
  z
    .string()
    .min(1, t('forms.errors.fullname.required'))
    .min(2, t('forms.errors.fullname.min'))
    .max(50, t('forms.errors.fullname.max'))
    .regex(/^[A-Za-z\u0600-\u06FF\s'-]+$/, t('forms.errors.fullname.invalid'));

export const editAdminDialogSchema = (t: TFunction) =>
  z.object({
    firstName: adminNameSchema(t),
    lastName: adminNameSchema(t),
    email: z.email(t('forms.errors.email.invalid')),
    roleId: z.string().min(1, t('forms.errors.role.required')),
    phoneNumber: phoneSchema(t, true),
  });

export type EditAdminDialogValues = z.infer<ReturnType<typeof editAdminDialogSchema>>;

export const createAdminSchema = (t: TFunction, isEdit = false) =>
  z
    .object({
      fullName: z
        .string()
        .min(1, t('forms.errors.fullname.required'))
        .min(2, t('forms.errors.fullname.min'))
        .max(100, t('forms.errors.fullname.max'))
        .regex(/^[A-Za-z\u0600-\u06FF\s'-]+$/, t('forms.errors.fullname.invalid')),
      email: z.email(t('forms.errors.email.invalid')),
      phoneNumber: phoneSchema(t),
      roleId: z.string().min(1, t('forms.errors.role.required')),
      password: z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      if (isEdit) return;

      if (!values.password || values.password.length < 8) {
        ctx.addIssue({
          code: 'custom',
          path: ['password'],
          message: t('forms.errors.password.min', { defaultValue: 'Password is required (min 8)' }),
        });
      }

      if (values.password !== values.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          path: ['confirmPassword'],
          message: t('forms.errors.password.mismatch', {
            defaultValue: 'Passwords do not match',
          }),
        });
      }
    });

export type AdminFormValues = z.infer<ReturnType<typeof createAdminSchema>>;
