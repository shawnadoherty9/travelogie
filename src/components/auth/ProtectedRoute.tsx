import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: rolesLoading } = useRoles();

  // Show loading spinner while checking authentication status
  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check admin role if required
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};