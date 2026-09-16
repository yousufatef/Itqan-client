import { CustomSelect, CustomTextarea } from '@/components/forms';
import EditModal from '@/components/shared/customs/EditModal';
import { Form } from '@/components/ui/form';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AttendanceStatusType } from '../types';

export type CircleStudentRow = {
    studentId: number;
    studentName: string;
    attendanceStatus: AttendanceStatusType;
    evaluation: string;
    notes: string;
};

const evaluationOptions = [
    { label: 'ممتاز', value: 'EXCELLENT' },
    { label: 'جيد جدًا', value: 'VERY_GOOD' },
    { label: 'جيد', value: 'GOOD' },
    { label: 'ضعيف', value: 'POOR' },
];

const evaluationSchema = z.object({
    evaluation: z.string().min(1, 'يرجى اختيار تقييم الطالب'),
    notes: z.string().trim().min(1, 'الملاحظات مطلوبة'),
});

export type EvaluationFormValues = z.infer<typeof evaluationSchema>;

type StudentEvaluationFormProps = {
    student: CircleStudentRow;
    isReadOnly: boolean;
    onSubmit: (values: EvaluationFormValues) => void;
    onClose: () => void;
};

export default function StudentEvaluationForm({
    student,
    isReadOnly,
    onSubmit,
    onClose,
}: StudentEvaluationFormProps) {
    const defaultEval =
        evaluationOptions.find(
            (opt) => opt.value === student.evaluation || opt.label === student.evaluation,
        )?.value || student.evaluation || 'EXCELLENT';

    const form = useLiveForm<EvaluationFormValues>({
        resolver: zodResolver(evaluationSchema),
        defaultValues: {
            evaluation: defaultEval,
            notes: student.notes,
        },
    });

    return (
        <Form {...form}>
            <form
                id='student-evaluation-form'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <EditModal
                    isOpen
                    toggle={(open) => {
                        if (!open) onClose();
                    }}
                    title={`تقييم الطالب: ${student.studentName}`}
                    subtitle={
                        isReadOnly
                            ? 'هذا التقرير قديم ولا يمكن تعديله.'
                            : 'سجل التقييم والملاحظات الخاصة بالطالب.'
                    }
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
                        name='notes'
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
