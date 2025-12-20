import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-4">Loading authorization...</div>;
  }

  if (user && (user.role)) {
    return <Outlet />;
  }
  return <Navigate to="/login" replace />;
};

export default UserRoute;