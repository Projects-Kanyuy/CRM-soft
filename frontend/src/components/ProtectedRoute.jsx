import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children }) {
  const { user } = useAuthStore();

  if (!user) {
    // If user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return children;
}