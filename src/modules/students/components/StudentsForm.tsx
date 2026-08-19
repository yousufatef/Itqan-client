import CustomInput from '@/components/forms';
import { CustomPhoneInput } from '@/components/forms';
import EditModal from '@/components/shared/customs/EditModal';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import useCreateStudent from '../hooks/useCreateStudent';
import useUpdateStudent from '../hooks/useUpdateStudent';
import type { IStudent } from '../types';

type StudentFormValues = {
  name: string;
  phone: string;
  dateOfBirth: string;
};

type StudentFormProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  student?: IStudent;
};

const studentSchema = z.object({
  name: z.string().min(1, 'اسم المستخدم مطلوب'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  dateOfBirth: z.string().min(1, 'تاريخ الميلاد مطلوب'),
});

export default function StudentsForm({ isOpen, setIsOpen, student }: StudentFormProps) {
  const isEdit = !!student;
  const form = useLiveForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || '',
      phone: student?.phone || '',
      dateOfBirth: student?.dateOfBirth || '',
    },
  });

  const { control, handleSubmit } = form;

  const { mutate: createMutate, isPending: isCreatePending } = useCreateStudent({
    onSuccess: () => setIsOpen(false),
  });
  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateStudent({
    onSuccess: () => setIsOpen(false),
  });

  const handleFormSubmit = handleSubmit((values) => {
    if (isEdit && student) {
      updateMutate({ id: student.id, values });
    } else {
      createMutate(values);
    }
  });
  return (
    <Form {...form}>
      <form
        id='student-form'
        className='h-full'
        onSubmit={handleFormSubmit}
      >
        <EditModal
          isOpen={isOpen}
          toggle={setIsOpen}
          title={isEdit ? 'تعديل طالب' : 'إضافة طالب'}
          formId='student-form'
          submitLabel={isEdit ? 'حفظ التعديلات' : 'إضافة'}
          isLoading={isCreatePending || isUpdatePending}
        >
          <CustomInput
            required
            control={control}
            name='name'
            label='اسم الطالب'
            placeholder='أدخل اسم الطالب'
          />
          <CustomPhoneInput
            required
            control={control}
            name='phone'
            label='رقم الهاتف'
            placeholder='أدخل رقم الهاتف'
          />
          <CustomInput
            required
            control={control}
            name='dateOfBirth'
            label='تاريخ الميلاد'
            placeholder='أدخل تاريخ الميلاد'
            type='date'
          />
        </EditModal>
      </form>
    </Form>
  );
}
