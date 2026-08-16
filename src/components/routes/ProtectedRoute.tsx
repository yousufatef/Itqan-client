import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { TOKEN } from '@/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = Cookies.get(TOKEN);

  if (!token) {
    // Redirect to login page with callback URL to return after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
