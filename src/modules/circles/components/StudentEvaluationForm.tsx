import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useLiveForm from '@/hooks/useLiveForm';
import { CustomSelect, CustomTextarea } from '@/components/forms';
import EditModal from '@/components/shared/customs/EditModal';
import { Form } from '@/components/ui/form';

export type AttendanceStatus = 'present' | 'absent';

export type CircleStudent = {
    id: string;
    name: string;
    attendance: AttendanceStatus;
    evaluation: string;
    note: string;
};

const evaluationValues = ['ممتاز', 'جيد جدًا', 'جيد', 'ضعيف'] as const;
const evaluationOptions = evaluationValues.map((value) => ({ label: value, value }));

const evaluationSchema = z.object({
    evaluation: z.string().refine(
        (value) => evaluationValues.includes(value as (typeof evaluationValues)[number]),
        'يرجى اختيار تقييم الطالب',
    ),
    note: z.string().trim().min(1, 'الملاحظات مطلوبة'),
});

type EvaluationFormValues = z.infer<typeof evaluationSchema>;

type StudentEvaluationFormProps = {
    student: CircleStudent;
    isReadOnly: boolean;
    onSubmit: (values: EvaluationFormValues) => void;
    onClose: () => void;
};

export default function StudentEvaluationForm({ student, isReadOnly, onSubmit, onClose }: StudentEvaluationFormProps) {
    const form = useLiveForm<EvaluationFormValues>({
        resolver: zodResolver(evaluationSchema),
        defaultValues: { evaluation: student.evaluation, note: student.note },
    });

    return (
        <Form {...form}>
            <form id='student-evaluation-form' onSubmit={form.handleSubmit(onSubmit)}>
                <EditModal
                    isOpen
                    toggle={(open) => { if (!open) onClose(); }}
                    title={`تقييم الطالب: ${student.name}`}
                    subtitle={isReadOnly ? 'هذا التقرير قديم ولا يمكن تعديله.' : 'سجل التقييم والملاحظات الخاصة بالطالب.'}
                    formId='student-evaluation-form'
                    submitLabel='حفظ التقرير'
                    contentClassName='xl:grid-cols-1'
                >
                    <CustomSelect
                        control={form.control}
                        name='evaluation'
                        label='التقييم'
                        placeholder='اختر تقييم الطالب'
                        options={evaluationOptions}
                        required
                        disabled={isReadOnly}
                    />
                    <CustomTextarea
                        control={form.control}
                        name='note'
                        label='الملاحظات'
                        placeholder='أدخل ملاحظاتك عن الطالب'
                        required
                        disabled={isReadOnly}
                    />
                </EditModal>
            </form>
        </Form>
    );
}
