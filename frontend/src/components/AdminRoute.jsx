import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-4">Loading authorization...</div>;
  }

  if (user && user.role?.id === 1) {
    return <Outlet />;
  }
  return <Navigate to="/login" replace />;
};

export default AdminRoute;