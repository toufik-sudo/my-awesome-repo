import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useStore } from "./store";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import GaragePage from "./pages/GaragePage";
import DiagnosePage from "./pages/DiagnosePage";
import HistoryPage from "./pages/HistoryPage";
import VehicleFormPage from "./pages/VehicleFormPage";
import AuthPage from "./pages/AuthPage";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export default function App() {
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/garage" replace />} />
          <Route path="/garage" element={<GaragePage />} />
          <Route path="/garage/new" element={<VehicleFormPage />} />
          <Route path="/garage/:id/edit" element={<VehicleFormPage />} />
          <Route path="/diagnose" element={<DiagnosePage />} />
          <Route path="/diagnose/:sessionId" element={<DiagnosePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </>
  );
}
