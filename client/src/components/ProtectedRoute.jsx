import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Wraps routes that require authentication.
 * Shows loading state while session is being verified.
 * Redirects to /login with return URL if unauthenticated.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow animate-pulse-glow">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
