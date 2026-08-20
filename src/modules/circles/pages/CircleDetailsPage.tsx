import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import useLiveForm from '@/hooks/useLiveForm';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomCalendar } from '@/components/forms';
import { CustomTable } from '@/components/shared/customs';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StudentEvaluationForm, { type AttendanceStatus, type CircleStudent } from '../components/StudentEvaluationForm';
import useGetCircle from '../hooks/useGetCircle';
import { ArrowLeft } from 'lucide-react';

const detailItems = [
    { key: 'name', label: 'اسم الحلقة' },
    { key: 'teacherName', label: 'المعلم' },
    { key: 'days', label: 'الأيام' },
    { key: 'time', label: 'الوقت' },
] as const;

const initialStudents: CircleStudent[] = [
    { id: '1', name: 'أحمد حسن', attendance: 'present', evaluation: 'ممتاز', note: 'تلاوة متقنة' },
    { id: '2', name: 'سارة علي', attendance: 'absent', evaluation: '', note: '' },
    { id: '3', name: 'محمد سامي', attendance: 'present', evaluation: 'جيد جدًا', note: 'يحتاج إلى مراجعة المدود' },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const formatDate = (date: Date) => new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric', month: 'long', year: 'numeric',
}).format(date);

export default function CircleDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: circle, isPending } = useGetCircle(id);
    const [students, setStudents] = useState(initialStudents);
    const [reportDate, setReportDate] = useState<Date | undefined>(today);
    const [selectedStudentId, setSelectedStudentId] = useState<string>();
    const dateForm = useLiveForm<{ date?: Date }>({ defaultValues: { date: today } });
    const isReadOnly = Boolean(reportDate && reportDate < today);
    if (isPending) {
        return <div className='py-8 text-center'>جاري تحميل تفاصيل الحلقة...</div>;
    }

    if (!circle) {
        return <div className='py-8 text-center'>تعذر العثور على الحلقة.</div>;
    }

    const values = {
        name: circle.name,
        teacherName: circle.teacherName,
        days: circle.days.join('، '),
        time: `${circle.startTime} - ${circle.endTime}`,
    };

    const updateStudent = (studentId: string, updates: Partial<CircleStudent>) => {
        setStudents((current) => current.map((student) => (
            student.id === studentId ? { ...student, ...updates } : student
        )));
    };

    const selectedStudent = students.find((student) => student.id === selectedStudentId);

    const columns: ColumnDef<CircleStudent>[] = [
        { header: 'اسم الطالب', accessorKey: 'name' },
        {
            header: 'الحضور',
            cell: ({ row }) => (
                <Select
                    dir='rtl'
                    disabled={isReadOnly}
                    value={row.original.attendance}
                    onValueChange={(attendance: AttendanceStatus) => updateStudent(row.original.id, {
                        attendance,
                        ...(attendance === 'absent' ? { evaluation: '', note: '' } : {}),
                    })}
                >
                    <SelectTrigger className='w-32 bg-white'><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value='present'>حاضر</SelectItem>
                        <SelectItem value='absent'>غائب</SelectItem>
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
                    disabled={isReadOnly || row.original.attendance === 'absent'}
                    onClick={() => setSelectedStudentId(row.original.id)}
                >
                    {row.original.evaluation ? 'تعديل التقرير' : 'إضافة تقرير'}
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
            // primaryLabel='العودة إلى الحلقات'
            onPrimaryClick={() => navigate(-1)}

        >

            <section className='mt-4 border border-neutral-300 bg-white p-4 shadow-md'>
                <h1 className='mb-4 text-xl font-bold text-neutral-900'>تفاصيل الحلقة</h1>
                <div className='grid grid-cols-1 gap-0 border border-neutral-300 sm:grid-cols-2 rounded-md'>
                    {detailItems.map(({ key, label }) => (
                        <div key={key} className='border-b border-neutral-300 p-2 last:border-b-0 sm:even:border-s sm:nth-last-2:border-b-0'>
                            <p className='mb-2 text-sm font-bold'>{label}: <span className='font-medium text-neutral-700'>{values[key]}</span></p>
                        </div>
                    ))}
                </div>
            </section>

            <section className='mt-6 border border-neutral-300 bg-white p-4 shadow-md'>
                <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h2 className='text-xl font-bold text-neutral-900'>سجل الطلاب</h2>
                        <p className='mt-1 text-sm text-neutral-500'>متابعة حضور وتقييم الطلاب في جلسات الحلقة.</p>
                    </div>
                    <div className='w-full sm:w-auto sm:min-w-80'>
                        <CustomCalendar
                            control={dateForm.control}
                            name='date'
                            label='تاريخ التقرير'
                            placeholder='اختر تاريخ التقرير'
                            onValueChange={setReportDate}
                            formatValue={formatDate}
                            toDate={today}
                            dir='rtl'
                            wrapperClassName='w-full'
                            triggerClassName='w-full'
                        />
                    </div>
                </div>
                {isReadOnly ? (
                    <p className='mb-3 text-sm text-amber-700'>التقرير السابق للقراءة فقط.</p>
                ) : null}
                <CustomTable
                    dir='rtl'
                    columns={columns}
                    data={students}
                    emptyMessage='لا يوجد طلاب في الحلقة'
                    className='overflow-x-auto'
                />
            </section>
            {selectedStudent ? (
                <StudentEvaluationForm
                    student={selectedStudent}
                    isReadOnly={isReadOnly}
                    onClose={() => setSelectedStudentId(undefined)}
                    onSubmit={(values) => {
                        updateStudent(selectedStudent.id, values);
                        setSelectedStudentId(undefined);
                    }}
                />
            ) : null}

        </PageLayout>
    );
}
