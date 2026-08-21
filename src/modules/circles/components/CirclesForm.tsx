import CustomInput from '@/components/forms';
import { CustomMultiSelect, CustomSelect, CustomTimeInput } from '@/components/forms';
import EditModal from '@/components/shared/customs/EditModal';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import useCreateCircle from '../hooks/useCreateCircle';
import useUpdateCircle from '../hooks/useUpdateCircle';
import useGetStudents from '@/modules/students/hooks/useGetStudents';
import useGetUsers from '@/modules/users/hooks/useGetUsers';
import type { ICircle } from '../types';

type CircleFormValues = {
  name: string;
  teacherName: string;
  studentIds: string[];
  startTime: string;
  endTime: string;
  days: string[];
  isActive: boolean;
};

type CircleFormProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  circle?: ICircle;
};

const circleSchema = z.object({
  name: z.string().min(1, 'اسم الحلقة مطلوب'),
  teacherName: z.string().min(1, 'اسم المعلم مطلوب'),
  studentIds: z.array(z.string()),
  startTime: z.string().min(1, 'وقت البداية مطلوب'),
  endTime: z.string().min(1, 'وقت النهاية مطلوب'),
  days: z.array(z.string()).min(1, 'أيام الحلقة مطلوبة'),
  isActive: z.boolean(),
});

const dayOptions = [
  { value: 'السبت', label: 'السبت' },
  { value: 'الأحد', label: 'الأحد' },
  { value: 'الإثنين', label: 'الإثنين' },
  { value: 'الثلاثاء', label: 'الثلاثاء' },
  { value: 'الأربعاء', label: 'الأربعاء' },
  { value: 'الخميس', label: 'الخميس' },
  { value: 'الجمعة', label: 'الجمعة' },
];

export default function CirclesForm({ isOpen, setIsOpen, circle }: CircleFormProps) {
  const isEdit = !!circle;
  const form = useLiveForm<CircleFormValues>({
    resolver: zodResolver(circleSchema),
    defaultValues: {
      name: circle?.name || '',
      teacherName: circle?.teacherName || '',
      studentIds: circle?.studentIds || [],
      startTime: circle?.startTime || '',
      endTime: circle?.endTime || '',
      days: circle?.days || [],
      isActive: circle?.isActive ?? true,
    },
  });

  const { control, handleSubmit } = form;
  const { data: usersData, isPending: isTeachersPending } = useGetUsers({ role: 'teacher' });
  const { data: studentsData, isPending: isStudentsPending } = useGetStudents();

  const teacherOptions = (usersData?.result.data ?? [])
    .filter((user) => user.isActive)
    .map((user) => ({ value: user.username, label: user.username }));
  const studentOptions = (studentsData?.result.data ?? []).map((student) => ({
    value: student.id,
    label: student.name,
  }));

  const { mutate: createMutate, isPending: isCreatePending } = useCreateCircle({
    onSuccess: () => setIsOpen(false),
  });
  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateCircle({
    onSuccess: () => setIsOpen(false),
  });

  const handleFormSubmit = handleSubmit((values) => {
    if (isEdit && circle) {
      updateMutate({ id: circle.id, values });
    } else {
      createMutate(values);
    }
  });
  return (
    <Form {...form}>
      <form
        id='circle-form'
        className='h-full'
        onSubmit={handleFormSubmit}
      >
        <EditModal
          isOpen={isOpen}
          toggle={setIsOpen}
          title={isEdit ? 'تعديل حلقة' : 'إضافة حلقة'}
          formId='circle-form'
          submitLabel={isEdit ? 'حفظ التعديلات' : 'إضافة'}
          isLoading={isCreatePending || isUpdatePending}
        >
          <CustomInput
            required
            control={control}
            name='name'
            label='اسم الحلقة'
            placeholder='أدخل اسم الحلقة'
          />
          <CustomSelect
            required
            control={control}
            name='teacherName'
            label='اسم المعلم'
            placeholder={isTeachersPending ? 'جاري تحميل المعلمين...' : 'اختر المعلم'}
            options={teacherOptions}
            disabled={isTeachersPending}
          />
          {!isEdit && (
            <CustomMultiSelect
              control={control}
              name='studentIds'
              label='إضافة الطلاب للحلقة'
              optional
              placeholder={isStudentsPending ? 'جاري تحميل الطلاب...' : 'اختر الطلاب'}
              options={studentOptions}
              disabled={isStudentsPending}
            />
          )}
          <CustomTimeInput
            required
            control={control}
            name='startTime'
            label='وقت البداية'
            hourAriaLabel='ساعة وقت البداية'
            minuteAriaLabel='دقائق وقت البداية'
            periodAriaLabel='الفترة الصباحية أو المسائية لوقت البداية'
          />
          <CustomTimeInput
            required
            control={control}
            name='endTime'
            label='وقت النهاية'
            hourAriaLabel='ساعة وقت النهاية'
            minuteAriaLabel='دقائق وقت النهاية'
            periodAriaLabel='الفترة الصباحية أو المسائية لوقت النهاية'
          />
          <CustomMultiSelect
            required
            control={control}
            name='days'
            label='أيام الحلقة'
            placeholder='اختر أيام الحلقة'
            options={dayOptions}
          />
        </EditModal>
      </form>
    </Form>
  );
}
