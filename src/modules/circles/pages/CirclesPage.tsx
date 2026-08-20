import PageLayout from '@/components/layout/PageLayout';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import CirclesTable from '../components/table/CirclesTable';
import CirclesForm from '../components/CirclesForm';

function CirclesPage() {
    const [isAddingCircle, setIsAddingCircle] = useState(false);

    return (
        <PageLayout
            title='الحلقات'
            subtitle='هذا هو قسم الحلقات حيث يمكنك إدارة جميع الحلقات في النظام.'
            primaryLabel={
                <>
                    <PlusIcon className='text-white' />
                    إضافة حلقة جديدة
                </>
            }
            showPrimaryButton
            onPrimaryClick={() => setIsAddingCircle(true)}
        >
            <CirclesTable />
            {isAddingCircle && (
                <CirclesForm
                    isOpen={isAddingCircle}
                    setIsOpen={setIsAddingCircle}
                />
            )}
        </PageLayout>
    );
}

export default CirclesPage;
