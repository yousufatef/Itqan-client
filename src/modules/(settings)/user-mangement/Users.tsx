
import PageLayout from '@/components/layout/PageLayout';
import { useTranslation } from 'react-i18next';
import UsersTable from './components/table/UsersTable';

const Users = () => {

  const { t } = useTranslation();
  return (
    <PageLayout
      title={t('users.title')}
    >
      <UsersTable />
    </PageLayout>
  );
};

export default Users;
