import CustomInput from '@/components/forms';
import { CustomCalendar, CustomComboboxSingle, CustomPhoneInput } from '@/components/forms';
import EditModal from '@/components/shared/customs/EditModal';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import useCreateStudent from '../hooks/useCreateStudent';
import useUpdateStudent from '../hooks/useUpdateStudent';
import type { IStudent } from '../types';
import useGetUsers from '@/modules/users/hooks/useGetUsers';

type StudentFormValues = {
  name: string;
  phone: string;
  dateOfBirth: Date;
  parentId: string;
};

type StudentFormProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  student?: IStudent;
};

const studentSchema = z.object({
  name: z.string().min(1, 'اسم المستخدم مطلوب'),
  phone: z.string(),
  dateOfBirth: z.date({ error: 'تاريخ الميلاد مطلوب' }),
  parentId: z.string().min(1, 'ولي الأمر مطلوب'),
});

const parseDateOfBirth = (value: string) => {
  if (!value) return undefined;

  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateOfBirth = (date?: Date) => {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function StudentsForm({ isOpen, setIsOpen, student }: StudentFormProps) {
  const isEdit = !!student;
  const { data: usersData } = useGetUsers({ searchValue: '', role: 'parent' });
  const parentOptions = (usersData?.result.data ?? [])
    .filter((user) => user.role === 'parent')
    .map((user) => ({ value: user.id, label: user.username }));

  const form = useLiveForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || '',
      phone: student?.phone || '',
      dateOfBirth: parseDateOfBirth(student?.dateOfBirth || ''),
      parentId: student?.parentId || '',
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
    const payload = {
      ...values,
      dateOfBirth: formatDateOfBirth(values.dateOfBirth),
    };

    if (isEdit && student) {
      updateMutate({ id: student.id, values: payload });
    } else {
      createMutate(payload);
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
            control={control}
            name='phone'
            label='رقم الهاتف'
            optional
            placeholder='أدخل رقم الهاتف'
          />
          <CustomCalendar
            required
            control={control}
            name='dateOfBirth'
            label='تاريخ الميلاد'
            placeholder='اختر تاريخ الميلاد'
            calendarTitle='اختر تاريخ الميلاد'
            resetLabel='مسح'
            saveLabel='حفظ'
            formatValue={(date) => new Intl.DateTimeFormat('ar', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).format(date)}
            dir='rtl'
          />
          <CustomComboboxSingle
            required
            control={control}
            name='parentId'
            label='ولي الأمر'
            placeholder='اختر ولي الأمر'
            searchPlaceholder='ابحث عن ولي الأمر'
            options={parentOptions}
          />
        </EditModal>
      </form>
    </Form>
  );
}
