import PageLayout from '@/components/layout/PageLayout';
import FinancialTable from './components/table/FinancialTable';
import FinancialStatistics from './components/FinancialStatistics';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import FinancialForm from './components/FinancialForm';

function FinancialPage() {
    const [isAddingStudent, setIsAddingStudent] = useState(false);

    return (
        <PageLayout
            title='المالية'
            subtitle='إدارة فواتير الطلاب والمدفوعات والمبالغ المتبقية.'
            primaryLabel={
                <>
                    <PlusIcon className='text-white' />
                    إضافة فاتورة جديدة
                </>
            }
            showPrimaryButton
            onPrimaryClick={() => setIsAddingStudent(true)}
        >
            <FinancialStatistics />
            <FinancialTable />
            {isAddingStudent && (
                <FinancialForm
                    isOpen={isAddingStudent}
                    setIsOpen={setIsAddingStudent}
                />
            )}
        </PageLayout>
    );
}

export default FinancialPage;
