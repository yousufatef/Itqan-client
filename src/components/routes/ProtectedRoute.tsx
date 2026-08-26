import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { TOKEN } from '@/constants';
import { useUser } from '@/modules/auth/hooks/useUser';
import type { UserRole } from '@/modules/auth/types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = Cookies.get(TOKEN);
  const { user, isLoading } = useUser();

  if (!token) {
    // Redirect to login page with callback URL to return after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optionally return a loader here instead of null
  if (isLoading) {
    return null;
  }

  // Check role if allowedRoles are specified
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const hasRole = allowedRoles.includes(user.roleName as UserRole) || user.isSuperAdmin;
    if (!hasRole) {
      // User doesn't have permission, redirect to home or forbidden page
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
