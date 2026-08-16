import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { TOKEN } from '@/constants';

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const token = Cookies.get(TOKEN);

  if (token) {
    // User is authenticated, redirect to home/dashboard
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
