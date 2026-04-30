import { Navigate } from 'react-router-dom';
import { sessionModel } from '../models/sessionModel';

export default function ProtectedRoute({ children, roles }) {
  const token = sessionModel.getToken();
  const user = sessionModel.getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
