import CustomInput from '@/components/forms';
import { CustomSwitch } from '@/components/forms';
import EditModal from '@/components/shared/customs/EditModal';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import useCreateCircle from '../hooks/useCreateCircle';
import useUpdateCircle from '../hooks/useUpdateCircle';
import type { ICircle } from '../types';

type CircleFormValues = {
  name: string;
  teacherName: string;
  startTime: string;
  endTime: string;
  days: string;
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
  startTime: z.string().min(1, 'وقت البداية مطلوب'),
  endTime: z.string().min(1, 'وقت النهاية مطلوب'),
  days: z.string().min(1, 'أيام الحلقة مطلوبة'),
  isActive: z.boolean(),
});

export default function CirclesForm({ isOpen, setIsOpen, circle }: CircleFormProps) {
  const isEdit = !!circle;
  const form = useLiveForm<CircleFormValues>({
    resolver: zodResolver(circleSchema),
    defaultValues: {
      name: circle?.name || '',
      teacherName: circle?.teacherName || '',
      startTime: circle?.startTime || '',
      endTime: circle?.endTime || '',
      days: circle?.days.join(', ') || '',
      isActive: circle?.isActive ?? true,
    },
  });

  const { control, handleSubmit } = form;

  const { mutate: createMutate, isPending: isCreatePending } = useCreateCircle({
    onSuccess: () => setIsOpen(false),
  });
  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateCircle({
    onSuccess: () => setIsOpen(false),
  });

  const handleFormSubmit = handleSubmit((values) => {
    const circleValues = {
      ...values,
      days: values.days.split(',').map((day) => day.trim()).filter(Boolean),
    };

    if (isEdit && circle) {
      updateMutate({ id: circle.id, values: circleValues });
    } else {
      createMutate(circleValues);
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
          <CustomInput
            required
            control={control}
            name='teacherName'
            label='اسم المعلم'
            placeholder='أدخل اسم المعلم'
          />
          <CustomInput
            required
            control={control}
            name='startTime'
            label='وقت البداية'
            type='time'
          />
          <CustomInput
            required
            control={control}
            name='endTime'
            label='وقت النهاية'
            type='time'
          />
          <CustomInput
            required
            control={control}
            name='days'
            label='أيام الحلقة'
            placeholder='مثال: الأحد، الإثنين'
          />
          <CustomSwitch
            control={control}
            name='isActive'
            label='حالة الحلقة'
            description='تظهر الحلقة كنشطة في النظام'
          />
        </EditModal>
      </form>
    </Form>
  );
}
