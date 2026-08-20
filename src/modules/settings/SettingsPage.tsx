import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Mail, Phone, UserRound } from 'lucide-react';

import { CustomInput, CustomPhoneInput } from '@/components/forms';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import useLiveForm from '@/hooks/useLiveForm';
import { useUser } from '@/modules/auth/hooks/useUser';
import useUpdateUserDetails from '@/modules/auth/hooks/useUpdateUserDetails';

type SettingsFormValues = {
    username: string;
    email: string;
    phoneNumber: string;
};

const settingsSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, 'اسم المستخدم مطلوب')
        .max(50, 'اسم المستخدم يجب ألا يتجاوز 50 حرفاً'),
    email: z.string().trim().min(1, 'البريد الإلكتروني مطلوب').email('البريد الإلكتروني غير صحيح'),
    phoneNumber: z.string().trim().min(1, 'رقم الهاتف مطلوب').max(20, 'رقم الهاتف غير صحيح'),
});

function SettingsPage() {
    const { user, isLoading, isError } = useUser();
    const updateUser = useUpdateUserDetails();
    const form = useLiveForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            username: '',
            email: '',
            phoneNumber: '',
        },
    });

    const { control, handleSubmit, reset, trigger, formState } = form;

    useEffect(() => {
        if (!user) return;

        const values = {
            username: user.username ?? user.userName ?? '',
            email: user.email ?? '',
            phoneNumber: user.phoneNumber ?? '',
        };

        reset(values);
        void trigger();
    }, [reset, trigger, user]);

    const handleFormSubmit = handleSubmit((values) => {
        if (!user?.id) return;

        updateUser.mutate({
            id: user.id,
            ...values,
        });
    });

    return (
        <PageLayout
            title='إعدادات الحساب'
            subtitle='يمكنك تعديل بيانات الحساب المستخدم حالياً.'
        >
            {isLoading ? (
                <div className='py-8 text-center text-neutral-500'>جاري تحميل بيانات الحساب...</div>
            ) : isError || !user ? (
                <div className='py-8 text-center text-red-600'>تعذر تحميل بيانات الحساب.</div>
            ) : (
                <div className='max-w-3xl space-y-5'>
                    <Card className='border-neutral-200 shadow-sm'>
                        <CardHeader className='border-b border-neutral-100 px-5 py-5 sm:px-6'>
                            <CardTitle>بيانات الحساب</CardTitle>
                            <p className='type-body-sm text-neutral-500'>
                                حدّث البيانات التالية ثم اضغط على حفظ التعديلات.
                            </p>
                        </CardHeader>
                        <CardContent className='p-5 sm:p-6'>
                            {updateUser.isError ? (
                                <div className='mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
                                    <AlertCircle className='mt-0.5 size-4 shrink-0' />
                                    <span>تعذر حفظ التعديلات. يرجى مراجعة البيانات والمحاولة مرة أخرى.</span>
                                </div>
                            ) : null}

                            <Form {...form}>
                                <form
                                    className='space-y-6'
                                    onSubmit={handleFormSubmit}
                                >
                                    <div className='grid gap-5 md:grid-cols-2'>
                                        <CustomInput
                                            required
                                            control={control}
                                            name='username'
                                            label='اسم المستخدم'
                                            placeholder='أدخل اسم المستخدم'
                                            autoComplete='username'
                                            startIcon={<UserRound className='size-4' />}
                                        />
                                        <CustomInput
                                            required
                                            control={control}
                                            name='email'
                                            label='البريد الإلكتروني'
                                            placeholder='أدخل البريد الإلكتروني'
                                            type='email'
                                            autoComplete='email'
                                            startIcon={<Mail className='size-4' />}
                                        />
                                    </div>
                                    <CustomPhoneInput
                                        required
                                        control={control}
                                        name='phoneNumber'
                                        label='رقم الهاتف'
                                        placeholder='أدخل رقم الهاتف'
                                        startIcon={<Phone className='size-4' />}
                                    />
                                    <div className='flex flex-col-reverse gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:justify-end'>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            disabled={!formState.isDirty || updateUser.isPending}
                                            onClick={() => reset()}
                                        >
                                            إلغاء
                                        </Button>
                                        <Button
                                            type='submit'
                                            disabled={!formState.isValid || !formState.isDirty || updateUser.isPending}
                                        >
                                            {updateUser.isPending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </PageLayout>
    );
}

export default SettingsPage;
