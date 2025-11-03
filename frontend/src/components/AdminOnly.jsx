import useAuthStore from '../store/authStore';

export default function AdminOnly({ children }) {
  const { user } = useAuthStore();

  if (user && user.role === 'Admin') {
    return <>{children}</>;
  }

  return null; // Render nothing if the user is not an admin
}