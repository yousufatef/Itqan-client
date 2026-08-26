import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import CustomPasswordInput from '@/components/forms/CustomPasswordInput';
import { Link } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogin } from '@/modules/auth/hooks/useLogin';
import CustomInput from '@/components/forms/CustomInput';
import useSyncFormLocalization from '@/hooks/useSyncFormLocalization';
import AuthPageShell from '@/modules/auth/components/AuthPageShell';

function LoginPage() {
  const { t } = useTranslation();

  const schema = useMemo(() => {
    return z.object({
      email: z
        .string()
        .min(1, { message: t('forms.errors.email.required') })
        .email({ message: t('forms.errors.email.invalid') }),
      password: z.string().min(1, { message: t('forms.errors.password.required') }),
    });
  }, [t]);
  type FormData = z.infer<typeof schema>;

  const { login, isLoading } = useLogin();
  const form = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  useSyncFormLocalization(form);

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
    } catch {
      // Error is already toasted by apiRequest / handleResponse
    }
  };

  return (
    <AuthPageShell
      title={t('pages.login.title')}
      description={t('pages.login.description')}
    >
      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
          autoComplete='off'
          className='flex w-full flex-col gap-4'
        >
          <CustomInput
            name='email'
            placeholder={t('forms.placeholders.email')}
            label={t('forms.labels.email')}
            required
            control={form.control}
            startIcon={<Mail className='size-5' aria-hidden='true' />}
            inputClassName='rounded-[4px] bg-white! border-neutral-100'
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault();
              }
            }}
          />

          <div>
            <CustomPasswordInput
              name='password'
              placeholder={t('forms.placeholders.password')}
              label={t('forms.labels.password')}
              required
              control={form.control}
              startIcon={<Lock className='size-5' aria-hidden='true' />}
              inputClassName='rounded-[4px] bg-white! border-neutral-100'
            />

            <Link
              to='/forget-password'
              className='type-body-md text-primary-500 hover:text-primary-600 mt-4 block text-end underline underline-offset-4'
            >
              {t('pages.login.forgetPassword')}
            </Link>
          </div>

          <Button
            type='submit'
            className='type-body-md bg-primary-500 hover:bg-primary-600 mt-2 h-12 w-full rounded-lg '
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : t('forms.buttonLabels.signin')}
          </Button>
        </form>
      </FormProvider>
    </AuthPageShell>
  );
}

export default LoginPage;
