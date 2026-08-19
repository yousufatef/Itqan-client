import PageLayout from '@/components/layout/PageLayout';
import UsersTable from './components/table/UsersTable';
import UsersForm from './components/UsersForm';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

function UsersPage() {
    const [isAddingUser, setIsAddingUser] = useState(false);

    return (
        <PageLayout
            title='المستخدمون'
            subtitle='هذا هو قسم المستخدمين حيث يمكنك إدارة جميع المستخدمين في النظام.'
            primaryLabel={
                <>
                    <PlusIcon className='text-white' />
                    إضافة مستخدم جديد
                </>
            }
            showPrimaryButton
            onPrimaryClick={() => setIsAddingUser(true)}
        >
            <UsersTable />
            {isAddingUser && (
                <UsersForm
                    isOpen={isAddingUser}
                    setIsOpen={setIsAddingUser}
                />
            )}
        </PageLayout>
    );
}

export default UsersPage;
