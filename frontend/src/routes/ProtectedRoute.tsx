import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { Role } from "../utils/types";

export function ProtectedRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <div className="insert-0 flex items-center justify-center bg-gray-100/10"><p>Checking authentication...</p></div>;
  }

  if (!user) return <Navigate to="/" replace />;

  if (!user.isEmailVerified) {
    return (
      <Navigate to="/verify-email" state={{ email: user.email }} replace />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
