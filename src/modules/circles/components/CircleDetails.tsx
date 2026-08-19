import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import useGetCircle from '../hooks/useGetCircle';

const detailItems = [
    { key: 'name', label: 'اسم الحلقة' },
    { key: 'teacherName', label: 'المعلم' },
    { key: 'days', label: 'الأيام' },
    { key: 'time', label: 'الوقت' },
] as const;

export default function CircleDetails() {
    const { id } = useParams();
    const { data: circle, isPending } = useGetCircle(id);

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

    return (
        <PageLayout
            title='تفاصيل الحلقة'
            subtitle='عرض بيانات الحلقة والطلاب المسجلين بها.'
        >
            <div className='flex items-center justify-between'>
                <Button asChild variant='outline' className='gap-2'>
                    <Link to='/circles'>
                        <ArrowRight className='size-4' />
                        العودة إلى الحلقات
                    </Link>
                </Button>
                <span className='rounded-md bg-primary-100 px-3 py-2 text-sm font-semibold text-primary-700'>
                    {circle.isActive ? 'نشطة' : 'غير نشطة'}
                </span>
            </div>

            <section className='border border-neutral-800 bg-white p-4 shadow-sm'>
                <h1 className='mb-4 text-xl font-bold text-neutral-900'>تفاصيل الحلقة</h1>
                <div className='grid grid-cols-1 gap-0 border border-neutral-700 sm:grid-cols-2'>
                    {detailItems.map(({ key, label }) => (
                        <div key={key} className='border-b border-neutral-700 p-4 last:border-b-0 sm:even:border-s sm:nth-last-2:border-b-0'>
                            <p className='mb-2 text-sm font-semibold text-neutral-600'>{label}</p>
                            <p className='font-medium text-neutral-900'>{values[key]}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className='border border-neutral-800 bg-white p-4 shadow-sm'>
                <h2 className='mb-4 text-xl font-bold text-neutral-900'>طلاب الحلقة</h2>
                <div className='overflow-x-auto border border-neutral-700'>
                    <table className='w-full min-w-160 text-right'>
                        <thead className='border-b border-neutral-700'>
                            <tr>
                                <th className='p-4 font-bold'>اسم الطالب</th>
                                <th className='p-4 font-bold'>الحضور</th>
                                <th className='p-4 font-bold'>التقييم</th>
                                <th className='p-4 font-bold'>الملاحظات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={4} className='h-44 p-4 text-center text-neutral-500'>
                                    لا يوجد طلاب مسجلون في هذه الحلقة.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </PageLayout>
    );
}
