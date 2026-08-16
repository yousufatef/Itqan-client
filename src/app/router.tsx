import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import GuestRoute from '@/components/routes/GuestRoute';
import { WithPermissions } from '@/components/shared/permissions/WithPermissions';
import { UnderDevelopment } from '@/components/shared/empty-states';
import MainLoader from '@/components/shared/loader/MainLoader';

// Eagerly loaded (part of the initial bundle — small and always needed)
import ErrorPage from '@/modules/error/ErrorPage';
import AccessDeniedPage from '@/modules/error/AccessDeniedPage';


// Lazily loaded pages — each becomes its own async chunk
const LoginPage = lazy(() => import('../modules/auth/pages/login/LoginPage'));
const ResetPasswordPage = lazy(
  () => import('@/modules/auth/pages/reset-password/ResetPasswordPage'),
);
const PromoCode = lazy(
  () => import('@/modules/(financial)/promo-code/pages/PromoCode'),
);
const VerifyEmailPage = lazy(() => import('@/modules/auth/pages/verify-email/VerifyEmailPage'));
const ForgetPasswordPage = lazy(
  () => import('@/modules/auth/pages/forget-password/ForgetPasswordPage'),
);
const ExpiredPage = lazy(() => import('@/modules/auth/pages/error-page/Expired'));
const PasswordChangedPage = lazy(
  () => import('@/modules/auth/pages/password-changed/PasswordChangedPage'),
);

const RolesManagement = lazy(
  () => import('@/modules/(settings)/(roles-managements)/RolesManagementPage'),
);

const Users = lazy(() => import('@/modules/(settings)/user-mangement/Users'));


const FinancialInvoicesPage = lazy(
  () => import('@/modules/(financial)/invoices/components/table/InvoicesFinancialTable'),
);
const FinancialTaxesPage = lazy(() => import('@/modules/(financial)/taxes/pages/Taxes'));



const SettingsCitiesPage = lazy(
  () => import('@/modules/(settings)/cities/components/table/CitiesSettingsTable'),
);
const SmartGuilde = lazy(
  () => import('@/modules/(settings)/smart-guide/pages/SmartGuide'),
);

const PageLoader = () => <MainLoader className='min-h-dvh' />;

function RedirectEditAdmin() {
  const { adminId } = useParams();
  return (
    <Navigate
      to={`/settings/roles?tab=users&action=edit-user&id=${adminId ?? ''}`}
      replace
    />
  );
}

function RedirectEditRole() {
  const { roleId } = useParams();
  return (
    <Navigate
      to={`/settings/roles?tab=roles&action=edit-role&id=${roleId ?? ''}`}
      replace
    />
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    children: [
      {
        children: [
          {
            element: (
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <AppLayout />
                </Suspense>
              </ProtectedRoute>
            ),
            children: [

              {
                path: 'financial/invoices',
                element: <FinancialInvoicesPage />,
              },
              {
                path: 'financial/taxes',
                element: <FinancialTaxesPage />,
              },
              {
                path: 'financial/promo-code',
                element: <PromoCode />,
              },

              {
                path: 'settings/cities',
                element: <SettingsCitiesPage />,
              },
              {
                path: 'settings/smart-guide',
                element: <SmartGuilde />,
              },
              {
                path: 'contacts',
                element: (
                  <WithPermissions
                    permissions={['contactus.read']}
                    fallback={<AccessDeniedPage />}
                  >
                    <UnderDevelopment title='Contact Messages' />
                  </WithPermissions>
                ),
              },

              // {
              //   path: 'users',
              //   element: (

              //     <Users />
              //   ),
              // },
              {
                path: '',
                element: (

                  <Users />
                ),
              },
              {
                path: 'transactions',
                element: <UnderDevelopment title='Transactions' />,
              },

              {
                path: 'settings',
                element: <UnderDevelopment title='Settings' />,
              },
              {
                path: 'settings/admins',
                element: (
                  <Navigate
                    to='/settings/roles?tab=users'
                    replace
                  />
                ),
              },
              {
                path: 'settings/admins/add',
                element: (
                  <Navigate
                    to='/settings/roles?tab=users&action=add-user'
                    replace
                  />
                ),
              },
              {
                path: 'settings/admins/edit/:adminId',
                element: <RedirectEditAdmin />,
              },
              {
                path: 'settings/users/add',
                element: (
                  <Navigate
                    to='/settings/roles?tab=users&action=add-user'
                    replace
                  />
                ),
              },
              {
                path: 'settings/users/edit/:adminId',
                element: <RedirectEditAdmin />,
              },
              {
                path: 'settings/roles',
                element: (
                  <RolesManagement />
                ),
              },
              {
                path: 'settings/roles/add',
                element: (
                  <Navigate
                    to='/settings/roles?tab=roles&action=add-role'
                    replace
                  />
                ),
              },
              {
                path: 'settings/roles/edit/:roleId',
                element: <RedirectEditRole />,
              },

              {
                path: 'activity-log',
                element: <UnderDevelopment title='Activity log' />,
              },

            ],
          },
        ],
      },
    ],
  },
  {
    element: (
      <GuestRoute>
        <Suspense fallback={<PageLoader />}>
          <AuthLayout />
        </Suspense>
      </GuestRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/forget-password',
        element: <ResetPasswordPage />,
      },
      {
        path: '/new-password',
        element: <ForgetPasswordPage />,
      },
      {
        path: '/verify-email',
        element: <VerifyEmailPage />,
      },
      {
        path: '/reset-password',
        element: <ForgetPasswordPage />,
      },
      {
        path: '/expired-page',
        element: <ExpiredPage />,
      },
      {
        path: '/password-changed',
        element: <PasswordChangedPage />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
