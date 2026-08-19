import PageLayout from '@/components/layout/PageLayout';
import StudentsTable from './components/table/UsersTable';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import StudentsForm from './components/StudentsForm';

function StudentsPage() {
    const [isAddingStudent, setIsAddingStudent] = useState(false);

    return (
        <PageLayout
            title='الطلاب'
            subtitle='هذا هو قسم الطلاب حيث يمكنك إدارة جميع الطلاب في النظام.'
            primaryLabel={
                <>
                    <PlusIcon className='text-white' />
                    إضافة طالب جديد
                </>
            }
            showPrimaryButton
            onPrimaryClick={() => setIsAddingStudent(true)}
        >
            <StudentsTable />
            {isAddingStudent && (
                <StudentsForm
                    isOpen={isAddingStudent}
                    setIsOpen={setIsAddingStudent}
                />
            )}
        </PageLayout>
    );
}

export default StudentsPage;
