import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import GuestRoute from '@/components/routes/GuestRoute';
import MainLoader from '@/components/shared/loader/MainLoader';

// Eagerly loaded (part of the initial bundle — small and always needed)
import ErrorPage from '@/modules/error/ErrorPage';
import NotFoundPage from '@/modules/not-found/NotFoundPage';


// Lazily loaded pages — each becomes its own async chunk
const LoginPage = lazy(() => import('../modules/auth/pages/login/LoginPage'));
const ResetPasswordPage = lazy(
  () => import('@/modules/auth/pages/reset-password/ResetPasswordPage'),
);
const VerifyEmailPage = lazy(() => import('@/modules/auth/pages/verify-email/VerifyEmailPage'));
const ForgetPasswordPage = lazy(
  () => import('@/modules/auth/pages/forget-password/ForgetPasswordPage'),
);
const ExpiredPage = lazy(() => import('@/modules/auth/pages/error-page/Expired'));
const PasswordChangedPage = lazy(
  () => import('@/modules/auth/pages/password-changed/PasswordChangedPage'),
);

const UsersPage = lazy(() => import('@/modules/users/UsersPage'));
const StudentsPage = lazy(() => import('@/modules/students/StudentsPage'));
const CirclesPage = lazy(() => import('@/modules/circles/CirclesPage'));
const CircleDetails = lazy(() => import('@/modules/circles/components/CircleDetails'));

const PageLoader = () => <MainLoader className='min-h-dvh' />;

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

              { path: '', element: <UsersPage /> },
              { path: 'users', element: <UsersPage /> },
              { path: 'students', element: <StudentsPage /> },
              { path: 'circles', element: <CirclesPage /> },
              { path: 'circles/:id', element: <CircleDetails /> },

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
    element: <NotFoundPage />,
  },
]);
