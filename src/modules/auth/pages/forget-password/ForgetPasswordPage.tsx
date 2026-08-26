import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import CustomPasswordInput from '@/components/forms/CustomPasswordInput';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useResetAdminPassword } from '@/modules/auth/hooks/useResetAdminPassword';
import { useSetPasswordInvite } from '../../hooks/useNewPasswordInvite';
import useSyncFormLocalization from '@/hooks/useSyncFormLocalization';
import { Check, X } from 'lucide-react';
import AuthPageShell from '@/modules/auth/components/AuthPageShell';

function ForgetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [resetToken] = useState(() => token || sessionStorage.getItem('resetToken') || '');
  const location = useLocation();
  const isForgotPasswordReset = location.pathname === '/new-password';

  useEffect(() => {
    if (isForgotPasswordReset) {
      if (!resetToken) {
        void navigate('/forget-password', { replace: true });
      }
      return;
    }

    if (!token) {
      void navigate('/forget-password', { replace: true });
    }
  }, [token, resetToken, isForgotPasswordReset, navigate]);

  const schema = useMemo(() => {
    const stringField = z.string({ message: '' });

    return z
      .object({
        newPassword: stringField,
        confirmNewPassword: stringField,
      })
      .superRefine((data, ctx) => {
        if (data.newPassword !== data.confirmNewPassword) {
          ctx.addIssue({
            code: 'custom',
            path: ['confirmNewPassword'],
            message: t('forms.errors.passwordsMustMatch'),
          });
        }
      });
  }, [t]);

  const { resetAdminPassword, isLoading } = useResetAdminPassword();
  const { setPasswordInvite, isLoading: isSetPasswordInviteLoading } = useSetPasswordInvite();

  type FormData = z.infer<typeof schema>;
  const form = useForm<FormData>({
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    resolver: zodResolver(schema),
  });

  useSyncFormLocalization(form);

  const password =
    useWatch({
      control: form.control,
      name: 'newPassword',
    }) ?? '';

  const rules = [
    {
      label: t('forms.passwordRules.length'),
      isValid: password.length >= 8 && password.length <= 32,
    },
    {
      label: t('forms.passwordRules.lowercase'),
      isValid: /[a-z]/.test(password),
    },
    {
      label: t('forms.passwordRules.uppercase'),
      isValid: /[A-Z]/.test(password),
    },
    {
      label: t('forms.passwordRules.number'),
      isValid: /\d/.test(password),
    },
    {
      label: t('forms.passwordRules.specialCharacter'),
      isValid: /[$&+,:;=?@#|'<>.^*()%!-]/.test(password),
    },
  ];
  const isPasswordValid = rules.every((rule) => rule.isValid);

  const onSubmit = async (data: FormData) => {
    if (!isPasswordValid) return;

    try {
      if (isForgotPasswordReset) {
        if (!resetToken) {
          toast.error('Invalid or missing reset credentials');
          return;
        }

        await resetAdminPassword({
          resetToken,
          newPassword: data.newPassword,
        });
        return;
      }

      if (!token) {
        toast.error('Invalid or missing reset token');
        return;
      }

      await setPasswordInvite({
        password: data.newPassword,
        token: token,
      });
    } catch {
      // Error is already toasted by apiRequest / handleResponse
    }
  };

  return (
    <AuthPageShell
      title={t('pages.login.titlePassword')}
      description={t('pages.login.descriptionPassword')}
    >
      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
          autoComplete='off'
          className='flex w-full flex-col gap-4'
        >
          <CustomPasswordInput
            name='newPassword'
            placeholder={t('forms.placeholders.newpassword')}
            label={t('forms.labels.newPassword')}
            required
            control={form.control}
            inputClassName='rounded-[4px] bg-white! border-neutral-100'
          />

          <div>
            <CustomPasswordInput
              name='confirmNewPassword'
              placeholder={t('pages.login.confirmPassword')}
              label={t('forms.labels.confirmNewPassword')}
              required
              control={form.control}
              inputClassName='rounded-[4px] bg-white! border-neutral-100'
            />
            <div className='mt-2'>
              <p className='type-body-sm mx-4 text-neutral-400'>
                {t('forms.passwordRules.title')}
              </p>
              <ul className='type-body-sm mt-2 space-y-1'>
                {rules.map((rule) => (
                  <li
                    key={rule.label}
                    className='flex items-center gap-2'
                  >
                    <div className='relative h-4 w-4 overflow-hidden'>
                      <div
                        className={
                          'absolute inset-0 transition-all duration-300 ease-out ' +
                          (rule.isValid ? 'scale-100 opacity-100' : 'scale-75 opacity-0')
                        }
                      >
                        <Check className='text-success-500 h-4 w-4' aria-hidden='true' />
                      </div>
                      <div
                        className={
                          'absolute inset-0 transition-all duration-300 ease-out ' +
                          (rule.isValid ? 'scale-75 opacity-0' : 'scale-100 opacity-100')
                        }
                      >
                        <X className='text-error-500 h-4 w-4' aria-hidden='true' />
                      </div>
                    </div>
                    <span className={rule.isValid ? 'text-success-500' : 'text-error-500'}>
                      {rule.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className='mt-4 flex flex-col gap-4'>
            <Button
              type='submit'
              className='type-body-md bg-primary-500 hover:bg-primary-600 h-12 w-full rounded-lg'
              disabled={isLoading || isSetPasswordInviteLoading}
            >
              {isLoading || isSetPasswordInviteLoading ? (
                <Spinner />
              ) : (
                t('forms.buttonLabels.resetPassword')
              )}
            </Button>

            <Link
              to='/login'
              className='type-body-md text-primary-500 hover:text-primary-600 text-center underline underline-offset-4'
            >
              {t('pages.login.backToLogin')}
            </Link>
          </div>
        </form>
      </FormProvider>
    </AuthPageShell>
  );
}

export default ForgetPasswordPage;
