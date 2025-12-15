import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, profile, loading } = useAuth();
  const [timeoutLoading, setTimeoutLoading] = useState(false);

  // Fallback para emails admin conhecidos
  const isKnownAdmin = user?.email === 'lailson@oxentecode.com.br' || user?.email === 'admin@conexaopalmeira.com';
  
  // Timeout para evitar loading infinito
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setTimeoutLoading(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setTimeoutLoading(false);
    }
  }, [loading]);

  if (loading && !timeoutLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Permitir acesso se for admin conhecido ou se profile.role for admin
  const hasAdminAccess = isKnownAdmin || profile?.role === 'admin';
  
  if (!hasAdminAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}