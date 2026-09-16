import { CustomCalendar } from '@/components/forms';
import PageLayout from '@/components/layout/PageLayout';
import { CustomTable } from '@/components/shared/customs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useLiveForm from '@/hooks/useLiveForm';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StudentEvaluationForm, { type CircleStudentRow } from '../components/StudentEvaluationForm';
import useCreateDailyRecords from '../hooks/useCreateDailyRecords';
import useGetCircle from '../hooks/useGetCircle';
import useGetDailyRecords from '../hooks/useGetDailyRecords';
import type { AttendanceStatusType, CreateDailyRecordItem, ITimeObject } from '../types';

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
    { key: 'name', label: 'اسم الحلقة' },
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
    const { mutate: saveDailyRecords, isPending: isSaving } = useCreateDailyRecords();

    const [students, setStudents] = useState<CircleStudentRow[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<number>();

    const dateForm = useLiveForm<{ date?: Date }>({ defaultValues: { date: today } });
    const isReadOnly = Boolean(reportDate && reportDate < today);

    useEffect(() => {
        if (!circle) return;

        const circleStudents = circle.students || [];
        const recordMap = new Map((dailyRecords || []).map((r) => [r.studentId, r]));

        if (circleStudents.length > 0) {
            const mappedRows: CircleStudentRow[] = circleStudents.map((st) => {
                const rec = recordMap.get(st.id);
                return {
                    studentId: st.id,
                    studentName: st.name,
                    attendanceStatus: rec?.attendanceStatus || 'PRESENT',
                    evaluation: rec?.evaluation || '',
                    notes: rec?.notes || '',
                };
            });
            setStudents(mappedRows);
        } else if (dailyRecords && dailyRecords.length > 0) {
            const mappedRows: CircleStudentRow[] = dailyRecords.map((rec) => ({
                studentId: rec.studentId,
                studentName: rec.studentName || `طالب #${rec.studentId}`,
                attendanceStatus: rec.attendanceStatus || 'PRESENT',
                evaluation: rec.evaluation || '',
                notes: rec.notes || '',
            }));
            setStudents(mappedRows);
        } else if (circle.studentIds && circle.studentIds.length > 0) {
            const mappedRows: CircleStudentRow[] = circle.studentIds.map((stId) => {
                const rec = recordMap.get(stId);
                return {
                    studentId: stId,
                    studentName: rec?.studentName || `طالب #${stId}`,
                    attendanceStatus: rec?.attendanceStatus || 'PRESENT',
                    evaluation: rec?.evaluation || '',
                    notes: rec?.notes || '',
                };
            });
            setStudents(mappedRows);
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
        name: circle.name,
        teacherName: teacherDisplayName,
        days: formattedDays,
        time: `${formatTime(circle.startTime)} - ${formatTime(circle.endTime)}`,
    };

    const updateStudent = (studentId: number, updates: Partial<CircleStudentRow>) => {
        setStudents((current) =>
            current.map((student) =>
                student.studentId === studentId ? { ...student, ...updates } : student,
            ),
        );
    };

    const handleSaveRecords = () => {
        if (!id) return;
        const recordsPayload: CreateDailyRecordItem[] = students.map((st) => ({
            studentId: st.studentId,
            attendanceStatus: st.attendanceStatus,
            evaluation: st.evaluation || undefined,
            notes: st.notes || undefined,
        }));

        saveDailyRecords({
            circleId: id,
            records: recordsPayload,
        });
    };

    const selectedStudent = students.find((st) => st.studentId === selectedStudentId);

    const columns: ColumnDef<CircleStudentRow>[] = [
        { header: 'اسم الطالب', accessorKey: 'studentName' },
        {
            header: 'الحضور',
            cell: ({ row }) => (
                <Select
                    dir='rtl'
                    disabled={isReadOnly}
                    value={row.original.attendanceStatus}
                    onValueChange={(attendanceStatus: AttendanceStatusType) =>
                        updateStudent(row.original.studentId, {
                            attendanceStatus,
                            ...(attendanceStatus === 'ABSENT' ? { evaluation: '', notes: 'غائب' } : {}),
                        })
                    }
                >
                    <SelectTrigger className='w-32 bg-white'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='PRESENT'>حاضر</SelectItem>
                        <SelectItem value='ABSENT'>غائب</SelectItem>
                    </SelectContent>
                </Select>
            ),
        },
        {
            header: 'التقييم والملاحظات',
            cell: ({ row }) => (
                <Button
                    type='button'
                    variant='outline'
                    disabled={isReadOnly || row.original.attendanceStatus === 'ABSENT'}
                    onClick={() => setSelectedStudentId(row.original.studentId)}
                >
                    {row.original.evaluation ? 'تعديل التتقرير' : 'إضافة تقرير'}
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
                                label='تاريخ التتقرير'
                                placeholder='اختر تاريخ التتقرير'
                                onValueChange={setReportDate}
                                formatValue={formatDateForDisplay}
                                toDate={today}
                                dir='rtl'
                                wrapperClassName='w-full'
                                triggerClassName='w-full'
                            />
                        </div>
                        {!isReadOnly && (
                            <Button
                                onClick={handleSaveRecords}
                                disabled={isSaving || students.length === 0}
                                className='flex items-center gap-1.5'
                            >
                                <Save className='size-4' />
                                {isSaving ? 'جاري الحفظ...' : 'حفظ التقرير اليومي'}
                            </Button>
                        )}
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
                    onClose={() => setSelectedStudentId(undefined)}
                    onSubmit={(formValues) => {
                        updateStudent(selectedStudent.studentId, {
                            evaluation: formValues.evaluation,
                            notes: formValues.notes,
                        });
                        setSelectedStudentId(undefined);
                    }}
                />
            ) : null}
        </PageLayout>
    );
}
