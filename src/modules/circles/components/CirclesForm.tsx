import CustomInput, { CustomMultiSelect, CustomSelect, CustomTimeInput } from '@/components/forms';
import { formatTo24HourTime } from '@/components/forms/time-input.utils';
import EditModal from '@/components/shared/customs/EditModal';
import { Form } from '@/components/ui/form';
import useLiveForm from '@/hooks/useLiveForm';
import useGetStudents from '@/modules/students/hooks/useGetStudents';
import useGetUsers from '@/modules/users/hooks/useGetUsers';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useCreateCircle from '../hooks/useCreateCircle';
import useUpdateCircle from '../hooks/useUpdateCircle';
import type { CreateCirclePayload, ICircle, ITimeObject, UpdateCirclePayload } from '../types';

type CircleFormValues = {
  name: string;
  teacherId: string;
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
  teacherId: z.string().min(1, 'اسم المعلم مطلوب'),
  studentIds: z.array(z.string()),
  startTime: z.string().min(1, 'وقت البداية مطلوب'),
  endTime: z.string().min(1, 'وقت النهاية مطلوب'),
  days: z.array(z.string()).min(1, 'أيام الحلقة مطلوبة'),
  isActive: z.boolean(),
});

const dayOptions = [
  { value: 'Sunday', label: 'الأحد' },
  { value: 'Monday', label: 'الإثنين' },
  { value: 'Tuesday', label: 'الثلاثاء' },
  { value: 'Wednesday', label: 'الأربعاء' },
  { value: 'Thursday', label: 'الخميس' },
  { value: 'Friday', label: 'الجمعة' },
  { value: 'Saturday', label: 'السبت' },
];

function formatTimeTo24H(timeValue: string | ITimeObject | undefined): string {
  if (!timeValue) return '00:00';
  if (typeof timeValue === 'object' && timeValue !== null) {
    const hh = String(timeValue.hour || 0).padStart(2, '0');
    const mm = String(timeValue.minute || 0).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  return formatTo24HourTime(timeValue) || '00:00';
}

export default function CirclesForm({ isOpen, setIsOpen, circle }: CircleFormProps) {
  const isEdit = !!circle;

  const defaultTeacherId = circle?.teacherId
    ? String(circle.teacherId)
    : circle?.teacher?.id
      ? String(circle.teacher.id)
      : '';

  const defaultStudentIds = circle?.studentIds
    ? circle.studentIds.map(String)
    : circle?.students
      ? circle.students.map((s) => String(s.id))
      : [];

  const form = useLiveForm<CircleFormValues>({
    resolver: zodResolver(circleSchema),
    defaultValues: {
      name: circle?.name || '',
      teacherId: defaultTeacherId,
      studentIds: defaultStudentIds,
      startTime: formatTimeTo24H(circle?.startTime),
      endTime: formatTimeTo24H(circle?.endTime),
      days: circle?.days || [],
      isActive: circle?.isActive ?? true,
    },
  });

  const { control, handleSubmit } = form;
  const { data: usersData, isPending: isTeachersPending } = useGetUsers({ role: 'teacher' });
  const { data: studentsData, isPending: isStudentsPending } = useGetStudents();

  const teacherOptions = (usersData?.result?.data ?? [])
    .map((user) => ({ value: String(user.id), label: user.username || `معلم #${user.id}` }));

  const studentOptions = (studentsData?.result?.data ?? []).map((student) => ({
    value: String(student.id),
    label: student.name,
  }));

  const { mutate: createMutate, isPending: isCreatePending } = useCreateCircle({
    onSuccess: () => setIsOpen(false),
  });
  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateCircle({
    onSuccess: () => setIsOpen(false),
  });

  const handleFormSubmit = handleSubmit((values) => {
    const startTimeStr = formatTimeTo24H(values.startTime);
    const endTimeStr = formatTimeTo24H(values.endTime);
    const teacherIdNum = Number(values.teacherId);
    const studentIdsNums = values.studentIds.map(Number);

    if (isEdit && circle) {
      const updatePayload: UpdateCirclePayload = {
        name: values.name,
        teacherId: teacherIdNum,
        studentIds: studentIdsNums,
        days: values.days,
        startTime: startTimeStr,
        endTime: endTimeStr,
        isActive: values.isActive,
      };
      updateMutate({ id: circle.id, values: updatePayload });
    } else {
      const createPayload: CreateCirclePayload = {
        name: values.name,
        teacherId: teacherIdNum,
        studentIds: studentIdsNums,
        days: values.days,
        startTime: startTimeStr,
        endTime: endTimeStr,
      };
      createMutate(createPayload);
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
            name='teacherId'
            label='اسم المعلم'
            placeholder={isTeachersPending ? 'جاري تحميل المعلمين...' : 'اختر المعلم'}
            options={teacherOptions}
            disabled={isTeachersPending}
          />
          <CustomMultiSelect
            control={control}
            name='studentIds'
            label='إضافة الطلاب للحلقة'
            optional
            placeholder={isStudentsPending ? 'جاري تحميل الطلاب...' : 'اختر الطلاب'}
            options={studentOptions}
            disabled={isStudentsPending}
          />
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
