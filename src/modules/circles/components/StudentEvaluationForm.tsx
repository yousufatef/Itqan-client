import { CustomSelect, CustomTextarea } from '@/components/forms';
import EditModal from '@/components/shared/customs/EditModal';
import { Form } from '@/components/ui/form';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import type { AttendanceStatusType } from '../types';

export type CircleStudentRow = {
    recordId?: number | string;
    studentId: number;
    studentName: string;
    attendanceStatus: AttendanceStatusType;
    evaluation: string;
    notes: string;
};

export const attendanceOptions = [
    { label: 'حاضر', value: 'present' },
    { label: 'غائب', value: 'absent' },
];

export const evaluationOptions = [
    { label: 'ممتاز', value: 'excellent' },
    { label: 'جيد جداً', value: 'very_good' },
    { label: 'جيد', value: 'good' },
    { label: 'مقبول', value: 'acceptable' },
    { label: 'ضعيف', value: 'weak' },
];

const evaluationSchema = z.object({
    attendanceStatus: z.enum(['present', 'absent', 'PRESENT', 'ABSENT']),
    evaluation: z.string().optional(),
    notes: z.string().optional(),
});

export type EvaluationFormValues = z.infer<typeof evaluationSchema>;

type StudentEvaluationFormProps = {
    student: CircleStudentRow;
    isReadOnly: boolean;
    isSubmitting?: boolean;
    onSubmit: (values: EvaluationFormValues) => void;
    onClose: () => void;
};

export default function StudentEvaluationForm({
    student,
    isReadOnly,
    isSubmitting = false,
    onSubmit,
    onClose,
}: StudentEvaluationFormProps) {
    const studentEvalLower = student.evaluation?.toLowerCase();
    const defaultEval =
        evaluationOptions.find(
            (opt) => opt.value === studentEvalLower || opt.label === student.evaluation,
        )?.value || (studentEvalLower ?? '');

    const currentAttendance = student.attendanceStatus?.toLowerCase() === 'absent' ? 'absent' : 'present';

    const form = useLiveForm<EvaluationFormValues>({
        resolver: zodResolver(evaluationSchema),
        defaultValues: {
            attendanceStatus: currentAttendance,
            evaluation: defaultEval,
            notes: student.notes || '',
        },
    });

    const watchedAttendance = form.watch('attendanceStatus');
    const isAbsent = watchedAttendance === 'absent';

    useEffect(() => {
        if (isAbsent) {
            form.setValue('evaluation', '');
            form.setValue('notes', '');
        }
    }, [isAbsent, form]);

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
                    submitLabel={isSubmitting ? 'جاري الحفظ...' : 'حفظ التقرير'}
                    contentClassName='xl:grid-cols-1'
                >
                    <CustomSelect
                        control={form.control}
                        name='attendanceStatus'
                        label='الحضور'
                        placeholder='اختر حالة الحضور'
                        options={attendanceOptions}
                        required
                        disabled={isReadOnly || isSubmitting}
                    />
                    <CustomSelect
                        control={form.control}
                        name='evaluation'
                        label='التقييم'
                        placeholder='اختر تقييم الطالب'
                        options={evaluationOptions}
                        disabled={isReadOnly || isSubmitting || isAbsent}
                    />
                    <CustomTextarea
                        control={form.control}
                        name='notes'
                        label='الملاحظات'
                        placeholder='أدخل ملاحظاتك عن الطالب'
                        disabled={isReadOnly || isSubmitting || isAbsent}
                    />
                </EditModal>
            </form>
        </Form>
    );
}
