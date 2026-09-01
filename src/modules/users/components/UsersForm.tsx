import CustomInput from '@/components/forms';
import { CustomPhoneInput, CustomSelect } from '@/components/forms';
import EditModal from '@/components/shared/customs/EditModal';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import type { IUser, TRole } from '../types';
import useCreateUser from '../hooks/useCreateUser';
import useUpdateUser from '../hooks/useUpdateUser';

type UserFormValues = {
  username: string;
  email: string;
  phoneNumber: string | null;
  role: TRole;
};

type UserFormProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user?: IUser;
};

const userSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phoneNumber: z.string().min(1, 'رقم الهاتف مطلوب'),
  role: z.enum(['admin', 'parent', 'teacher']),
});

export default function UsersForm({ isOpen, setIsOpen, user }: UserFormProps) {
  const isEdit = !!user;
  const form = useLiveForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber,
      role: user?.userType || 'parent',
    },
  });

  const { control, handleSubmit } = form;

  const { mutate: createMutate, isPending: isCreatePending } = useCreateUser({
    onSuccess: () => setIsOpen(false),
  });
  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateUser({
    onSuccess: () => setIsOpen(false),
  });

  const handleFormSubmit = handleSubmit((values) => {
    if (isEdit && user) {
      updateMutate({
        // id: user.id,
        username: values.username,
        email: values.email,
        phoneNumber: values.phoneNumber,
        role: values.role,
      });
    } else {
      createMutate(values);
    }
  });
  return (
    <Form {...form}>
      <form
        id='user-form'
        className='h-full'
        onSubmit={handleFormSubmit}
      >
        <EditModal
          isOpen={isOpen}
          toggle={setIsOpen}
          title={isEdit ? 'تعديل مستخدم' : 'إضافة مستخدم'}
          formId='user-form'
          submitLabel={isEdit ? 'حفظ التعديلات' : 'إضافة'}
          isLoading={isCreatePending || isUpdatePending}
        >
          <CustomInput
            required
            control={control}
            name='username'
            label='اسم المستخدم'
            placeholder='أدخل اسم المستخدم'
          />
          <CustomInput
            required
            control={control}
            name='email'
            label='البريد الإلكتروني'
            placeholder='أدخل البريد الإلكتروني'
            type='email'
          />
          <CustomPhoneInput
            required
            control={control}
            name='phoneNumber'
            label='رقم الهاتف'
            placeholder='أدخل رقم الهاتف'
          />
          <CustomSelect
            required
            control={control}
            name='role'
            label='الدور'
            placeholder='اختر الدور'
            options={[
              { value: 'admin', label: 'مسؤول' },
              { value: 'parent', label: 'ولي أمر' },
              { value: 'teacher', label: 'معلم' },
            ]}
          />
        </EditModal>
      </form>
    </Form>
  );
}
