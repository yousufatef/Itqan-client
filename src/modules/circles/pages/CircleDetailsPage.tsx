import { CustomCalendar } from '@/components/forms';
import PageLayout from '@/components/layout/PageLayout';
import { CustomTable } from '@/components/shared/customs';
import { Button } from '@/components/ui/button';
import useLiveForm from '@/hooks/useLiveForm';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StudentEvaluationForm, {
    evaluationOptions,
    type CircleStudentRow,
    type EvaluationFormValues,
} from '../components/StudentEvaluationForm';
import useCreateDailyRecord from '../hooks/useCreateDailyRecord';
import useGetCircle from '../hooks/useGetCircle';
import useGetDailyRecords from '../hooks/useGetDailyRecords';
import useUpdateDailyRecord from '../hooks/useUpdateDailyRecord';
import type { AttendanceStatusType, ITimeObject } from '../types';

const DAY_TRANSLATIONS: Record<string, string> = {
    Sunday: 'الأحد',
    Monday: 'الإثنين',
    Tuesday: 'الثلاثاء',
    Wednesday: 'الأربعاء',
    Thursday: 'الخميس',
    Friday: 'الجمعة',
    Saturday: 'السبت',
};

const detailItems = [
    { key: 'circleName', label: 'اسم الحلقة' },
    { key: 'teacherName', label: 'المعلم' },
    { key: 'days', label: 'الأيام' },
    { key: 'time', label: 'الوقت' },
] as const;

const today = new Date();
today.setHours(0, 0, 0, 0);

const formatDateForDisplay = (date: Date) =>
    new Intl.DateTimeFormat('ar-EG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);

const formatDateForApi = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function formatTime(timeVal: string | ITimeObject | undefined) {
    if (!timeVal) return '';
    if (typeof timeVal === 'string') return timeVal;
    const hour = String(timeVal.hour || 0).padStart(2, '0');
    const minute = String(timeVal.minute || 0).padStart(2, '0');
    return `${hour}:${minute}`;
}

export default function CircleDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: circle, isPending: isCirclePending } = useGetCircle(id);

    const [reportDate, setReportDate] = useState<Date | undefined>(today);
    const dateStr = reportDate ? formatDateForApi(reportDate) : undefined;

    const { data: dailyRecords, isPending: isRecordsPending } = useGetDailyRecords(id, dateStr);
    const { mutate: mutateCreateRecord, isPending: isCreating } = useCreateDailyRecord();
    const { mutate: mutateUpdateRecord, isPending: isUpdating } = useUpdateDailyRecord();

    const [students, setStudents] = useState<CircleStudentRow[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<number>();

    const dateForm = useLiveForm<{ date?: Date }>({ defaultValues: { date: today } });
    const isReadOnly = Boolean(reportDate && reportDate < today);

    const recordsList = Array.isArray(dailyRecords) ? dailyRecords : [];

    useEffect(() => {
        if (!circle) return;

        const circleStudents = circle.students || [];

        const getStatus = (status?: string | null): AttendanceStatusType =>
            status?.toLowerCase() === 'absent' ? 'absent' : 'present';

        if (recordsList.length > 0) {
            const mappedRows: CircleStudentRow[] = recordsList.map((rec) => {
                const stName =
                    circleStudents.find((s) => s.id === rec.studentId)?.name ||
                    rec.studentName ||
                    `طالب #${rec.studentId}`;
                const recId = rec.id ?? rec.recordId;
                return {
                    recordId: recId ?? undefined,
                    studentId: rec.studentId,
                    studentName: stName,
                    attendanceStatus: getStatus(rec.attendanceStatus),
                    evaluation: rec.evaluation ? rec.evaluation.toLowerCase() : '',
                    notes: rec.notes || '',
                };
            });
            setStudents(mappedRows);
        } else if (circleStudents.length > 0) {
            const mappedRows: CircleStudentRow[] = circleStudents.map((st) => ({
                studentId: st.id,
                studentName: st.name,
                attendanceStatus: 'present',
                evaluation: '',
                notes: '',
            }));
            setStudents(mappedRows);
        } else if (circle.studentIds && circle.studentIds.length > 0) {
            const mappedRows: CircleStudentRow[] = circle.studentIds.map((stId) => ({
                studentId: stId,
                studentName: `طالب #${stId}`,
                attendanceStatus: 'present',
                evaluation: '',
                notes: '',
            }));
            setStudents(mappedRows);
        } else {
            setStudents([]);
        }
    }, [circle, dailyRecords]);

    if (isCirclePending) {
        return <div className='py-8 text-center'>جاري تحميل تفاصيل الحلقة...</div>;
    }

    if (!circle) {
        return <div className='py-8 text-center'>تعذر العثور على الحلقة.</div>;
    }

    const teacherDisplayName =
        circle.teacherName || circle.teacher?.username || (circle.teacherId ? `معلم #${circle.teacherId}` : '-');

    const formattedDays = (circle.days || []).map((d) => DAY_TRANSLATIONS[d] || d).join('، ');

    const values = {
        circleName: circle.circleName,
        teacherName: teacherDisplayName,
        days: formattedDays,
        time: `${formatTime(circle.timeFrom)} - ${formatTime(circle.timeTo)}`,
    };

    const handleModalSubmit = (formValues: EvaluationFormValues) => {
        if (!selectedStudent || !id) return;

        const updatedAttendance = formValues.attendanceStatus?.toLowerCase() === 'absent' ? 'absent' : 'present';
        const updatedEval = updatedAttendance === 'absent' ? undefined : (formValues.evaluation || undefined);
        const updatedNotes = formValues.notes || undefined;

        const recId = selectedStudent.recordId;
        if (recId) {
            mutateUpdateRecord(
                {
                    circleId: id,
                    recordId: recId,
                    payload: {
                        attendanceStatus: updatedAttendance,
                        evaluation: updatedEval,
                        notes: updatedNotes,
                    },
                    date: dateStr,
                },
                {
                    onSuccess: () => {
                        setSelectedStudentId(undefined);
                    },
                },
            );
        } else {
            mutateCreateRecord(
                {
                    circleId: id,
                    payload: {
                        studentId: selectedStudent.studentId,
                        attendanceStatus: updatedAttendance,
                        evaluation: updatedEval,
                        notes: updatedNotes,
                    },
                    date: dateStr,
                },
                {
                    onSuccess: () => {
                        setSelectedStudentId(undefined);
                    },
                },
            );
        }
    };

    const selectedStudent = students.find((st) => st.studentId === selectedStudentId);

    const columns: ColumnDef<CircleStudentRow>[] = [
        { header: 'اسم الطالب', accessorKey: 'studentName' },
        {
            header: 'حالة الحضور',
            cell: ({ row }) => {
                if (!row.original.recordId) {
                    return <span className='text-neutral-400'>غير مسجل</span>;
                }
                const isAbsent = row.original.attendanceStatus?.toLowerCase() === 'absent';
                return isAbsent ? (
                    <span className='inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800'>
                        غائب
                    </span>
                ) : (
                    <span className='inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800'>
                        حاضر
                    </span>
                );
            },
        },
        {
            header: 'التقييم',
            cell: ({ row }) => {
                if (row.original.attendanceStatus?.toLowerCase() === 'absent') {
                    return <span className='text-neutral-400'>— (غائب)</span>;
                }
                const evalObj = evaluationOptions.find(
                    (opt) => opt.value === row.original.evaluation?.toLowerCase(),
                );
                return evalObj ? (
                    <span className='font-medium text-neutral-800'>{evalObj.label}</span>
                ) : (
                    <span className='text-neutral-400'>—</span>
                );
            },
        },
        {
            header: 'الملاحظات',
            cell: ({ row }) => (
                <span className='block max-w-xs truncate text-neutral-700'>
                    {row.original.notes || '—'}
                </span>
            ),
        },
        {
            header: 'الإجراءات',
            cell: ({ row }) => (
                <Button
                    type='button'
                    variant='outline'
                    disabled={isReadOnly}
                    onClick={() => setSelectedStudentId(row.original.studentId)}
                >
                    {row.original.recordId ? 'تعديل' : 'تقييم'}
                </Button>
            ),
        },
    ];

    return (
        <PageLayout
            title='تفاصيل الحلقة'
            subtitle='عرض بيانات الحلقة والطلاب المسجلين بها.'
            showPrimaryButton
            primaryLabel={<ArrowLeft />}
            onPrimaryClick={() => navigate(-1)}
        >
            <section className='mt-4 border border-neutral-300 bg-white p-4 shadow-md'>
                <h1 className='mb-4 text-xl font-bold text-neutral-900'>تفاصيل الحلقة</h1>
                <div className='grid grid-cols-1 gap-0 rounded-md border border-neutral-300 sm:grid-cols-2'>
                    {detailItems.map(({ key, label }) => (
                        <div
                            key={key}
                            className='border-b border-neutral-300 p-2 last:border-b-0 sm:even:border-s sm:nth-last-2:border-b-0'
                        >
                            <p className='mb-2 text-sm font-bold'>
                                {label}: <span className='font-medium text-neutral-700'>{values[key]}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className='mt-6 border border-neutral-300 bg-white p-4 shadow-md'>
                <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h2 className='text-xl font-bold text-neutral-900'>سجل الطلاب اليومي</h2>
                        <p className='mt-1 text-sm text-neutral-500'>متابعة حضور وتقييم الطلاب في جلسات الحلقة.</p>
                    </div>
                    <div className='flex flex-wrap items-center gap-3 w-full sm:w-auto'>
                        <div className='w-full sm:w-auto sm:min-w-72'>
                            <CustomCalendar
                                control={dateForm.control}
                                name='date'
                                label='تاريخ التقرير'
                                placeholder='اختر تاريخ التقرير'
                                onValueChange={setReportDate}
                                formatValue={formatDateForDisplay}
                                toDate={today}
                                dir='rtl'
                                wrapperClassName='w-full'
                                triggerClassName='w-full'
                            />
                        </div>
                    </div>
                </div>
                {isReadOnly ? (
                    <p className='mb-3 text-sm text-amber-700'>التقرير السابق للقراءة فقط.</p>
                ) : null}
                {isRecordsPending ? (
                    <div className='py-8 text-center'>جاري تحميل سجلات الطلاب...</div>
                ) : (
                    <CustomTable
                        dir='rtl'
                        columns={columns}
                        data={students}
                        emptyMessage='لا يوجد طلاب في هذه الحلقة'
                        className='overflow-x-auto'
                    />
                )}
            </section>
            {selectedStudent ? (
                <StudentEvaluationForm
                    student={selectedStudent}
                    isReadOnly={isReadOnly}
                    isSubmitting={isUpdating || isCreating}
                    onClose={() => setSelectedStudentId(undefined)}
                    onSubmit={handleModalSubmit}
                />
            ) : null}
        </PageLayout>
    );
}
