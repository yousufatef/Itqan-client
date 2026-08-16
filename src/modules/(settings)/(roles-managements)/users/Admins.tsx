import UsersTable from './components/table/UsersTable';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/modules/(settings)/(roles-managements)/roles/hooks/usePermissions';

const Admins = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const hasAddPermission = hasPermission('admins.create');
  return (
    <PageLayout
      title={t('admin.title')}
      primaryLabel={t('admin.addNew')}
      onPrimaryClick={() => navigate('/settings/users/add')}
      showPrimaryButton={hasAddPermission}
    >
      <UsersTable />
    </PageLayout>
  );
};

export default Admins;
