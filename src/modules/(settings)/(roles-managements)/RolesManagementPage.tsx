import { useMemo } from 'react';
import { PlusIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsersTable from '@/modules/(settings)/(roles-managements)/users/components/table/UsersTable';
import RolesTable from '@/modules/(settings)/(roles-managements)/roles/table/RolesTable';
import GuestsTable from '@/modules/(settings)/(roles-managements)/guests/components/table/GuestsTable';
import CreateRoleDialog from '@/modules/(settings)/(roles-managements)/roles/components/CreateRoleDialog';
import CreateAdminDialog from '@/modules/(settings)/(roles-managements)/users/components/CreateAdminDialog';
import {
  ROLES_MANAGEMENT_ACTION_QUERY_KEY,
  ROLES_MANAGEMENT_ACTIONS,
  ROLES_MANAGEMENT_ENTITY_ID_QUERY_KEY,
  ROLES_MANAGEMENT_TAB_QUERY_KEY,
  ROLES_MANAGEMENT_TABS,
  type RolesManagementTab,
} from './constants/roles-management.constants';

const TABLE_QUERY_KEYS = ['pageNumber', 'pageSize', 'searchValue', 'searchTerm', 'sort', 'status'];

const RolesManagementPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabs = useMemo(
    () => [
      {
        value: ROLES_MANAGEMENT_TABS.roles,
        label: t('rolesManagement.tabs.roles'),
        content: <RolesTable />,
      },
      {
        value: ROLES_MANAGEMENT_TABS.users,
        label: t('rolesManagement.tabs.users'),
        content: <UsersTable />,
      },
      {
        value: ROLES_MANAGEMENT_TABS.guests,
        label: t('rolesManagement.tabs.guests'),
        content: <GuestsTable />,
      },
    ],
    [t],
  );

  const requestedTab = searchParams.get(ROLES_MANAGEMENT_TAB_QUERY_KEY) as RolesManagementTab | null;
  const activeTab =
    tabs.find((tab) => tab.value === requestedTab)?.value ?? ROLES_MANAGEMENT_TABS.roles;

  const requestedAction = searchParams.get(ROLES_MANAGEMENT_ACTION_QUERY_KEY);
  const requestedEntityId = searchParams.get(ROLES_MANAGEMENT_ENTITY_ID_QUERY_KEY);

  const isRoleDialogOpen =
    requestedAction === ROLES_MANAGEMENT_ACTIONS.addRole ||
    (requestedAction === ROLES_MANAGEMENT_ACTIONS.editRole && !!requestedEntityId);

  const roleIdForDialog =
    requestedAction === ROLES_MANAGEMENT_ACTIONS.editRole
      ? (requestedEntityId ?? undefined)
      : undefined;

  const isAdminDialogOpen =
    requestedAction === ROLES_MANAGEMENT_ACTIONS.addUser ||
    (requestedAction === ROLES_MANAGEMENT_ACTIONS.editUser && !!requestedEntityId);

  const adminIdForDialog =
    requestedAction === ROLES_MANAGEMENT_ACTIONS.editUser
      ? (requestedEntityId ?? undefined)
      : undefined;

  const clearDialogParams = () => {
    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams);
      nextSearchParams.delete(ROLES_MANAGEMENT_ACTION_QUERY_KEY);
      nextSearchParams.delete(ROLES_MANAGEMENT_ENTITY_ID_QUERY_KEY);
      return nextSearchParams;
    });
  };

  const openRoleDialog = (action: typeof ROLES_MANAGEMENT_ACTIONS.addRole) => {
    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams);
      nextSearchParams.set(ROLES_MANAGEMENT_TAB_QUERY_KEY, ROLES_MANAGEMENT_TABS.roles);
      nextSearchParams.set(ROLES_MANAGEMENT_ACTION_QUERY_KEY, action);
      nextSearchParams.delete(ROLES_MANAGEMENT_ENTITY_ID_QUERY_KEY);
      return nextSearchParams;
    });
  };

  const openAdminDialog = (action: typeof ROLES_MANAGEMENT_ACTIONS.addUser) => {
    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams);
      nextSearchParams.set(ROLES_MANAGEMENT_TAB_QUERY_KEY, ROLES_MANAGEMENT_TABS.users);
      nextSearchParams.set(ROLES_MANAGEMENT_ACTION_QUERY_KEY, action);
      nextSearchParams.delete(ROLES_MANAGEMENT_ENTITY_ID_QUERY_KEY);
      return nextSearchParams;
    });
  };

  const handleTabChange = (value: string) => {
    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams);
      nextSearchParams.set(ROLES_MANAGEMENT_TAB_QUERY_KEY, value);
      nextSearchParams.delete(ROLES_MANAGEMENT_ACTION_QUERY_KEY);
      nextSearchParams.delete(ROLES_MANAGEMENT_ENTITY_ID_QUERY_KEY);

      TABLE_QUERY_KEYS.forEach((key) => {
        nextSearchParams.delete(key);
      });

      return nextSearchParams;
    });
  };

  const renderPrimaryAction = () => {
    if (activeTab === ROLES_MANAGEMENT_TABS.roles) {
      return (
        <Button
          type='button'
          className='type-body-md! bg-primary-500 hover:bg-primary-600 h-12 shrink-0 gap-1 px-6 text-neutral-900'
          onClick={() => openRoleDialog(ROLES_MANAGEMENT_ACTIONS.addRole)}
        >
          <PlusIcon className='size-5' aria-hidden='true' />
          <span>{t('roles.create')}</span>
        </Button>
      );
    }

    if (activeTab === ROLES_MANAGEMENT_TABS.users) {
      return (
        <Button
          type='button'
          className='type-body-md! bg-primary-500 hover:bg-primary-600 h-12 shrink-0 gap-1 px-6 text-neutral-900'
          onClick={() => openAdminDialog(ROLES_MANAGEMENT_ACTIONS.addUser)}
        >
          <PlusIcon className='size-5' aria-hidden='true' />
          <span>{t('admin.addNew')}</span>
        </Button>
      );
    }

    return null;
  };

  return (
    <PageLayout
      title={t('rolesManagement.title')}
      subtitle={t('rolesManagement.subtitle')}
      className='gap-6'
    >
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className='flex w-full flex-col gap-6'
      >
        <div className='flex items-center justify-between gap-4'>
          <TabsList
            variant='line'
            className='h-8 items-end justify-start gap-6 rounded-none p-0'
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className='type-body-md h-8 px-0 py-0 data-active:text-primary-500'
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {renderPrimaryAction()}
        </div>

        {tabs.map(({ content, value }) => (
          <TabsContent key={value} value={value} className='mt-0'>
            {activeTab === value ? content : null}
          </TabsContent>
        ))}
      </Tabs>

      <CreateRoleDialog
        isOpen={isRoleDialogOpen}
        setIsOpen={(open) => {
          if (!open) clearDialogParams();
        }}
        roleId={roleIdForDialog}
      />
      <CreateAdminDialog
        isOpen={isAdminDialogOpen}
        setIsOpen={(open) => {
          if (!open) clearDialogParams();
        }}
        adminId={adminIdForDialog}
      />
    </PageLayout>
  );
};

export default RolesManagementPage;
