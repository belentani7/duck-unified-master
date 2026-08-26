import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingScreen } from "@/components/LoadingScreen";
import ClientPortal from "@/pages/ClientPortal";
import Home from "@/pages/Home";
import { useEffect, useState } from "react";

export function useAuthGate() {
  const auth = useAuth();
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    if (!auth.loading) { setTimedOut(false); return; }
    const timer = window.setTimeout(() => setTimedOut(true), 3000);
    return () => window.clearTimeout(timer);
  }, [auth.loading]);
  return { ...auth, timedOut };
}

export function RoleAwareHome() {
  const { loading, user, timedOut } = useAuthGate();
  if (loading && !timedOut) return <LoadingScreen phrase="Carregando seu espaço Duck..." indeterminate />;
  return user?.role === "viewer" ? <ClientPortal /> : <Home offlineMode={timedOut && loading && !user} />;
}

export function RoleAwarePortal() {
  const { loading, user, timedOut } = useAuthGate();
  if (loading && !timedOut) return <LoadingScreen phrase="Validando acesso ao portal..." indeterminate />;
  return user?.role === "viewer" ? <ClientPortal /> : <div role="status">Acesso ao portal disponível apenas para clientes viewer.</div>;
}
