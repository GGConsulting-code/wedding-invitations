import { useMemo } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { AdminDashboardPage } from "../features/admin/pages/AdminDashboardPage";
import { PublicInvitationPage } from "../features/invitation/pages/PublicInvitationPage";
import { ProtectedRoute } from "../components/common/ProtectedRoute";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="not-found">
      <p className="eyebrow">Error 404</p>
      <h1>Esta página no está en la lista</h1>
      <p>Revisa el enlace o vuelve a un lugar conocido.</p>
      <button className="button button--primary" type="button" onClick={() => navigate("/login")}>
        <ArrowLeft size={18} aria-hidden="true" />
        Volver al inicio
      </button>
    </main>
  );
}

export function AppRouter() {
  const router = useMemo(
    () =>
      createBrowserRouter([
        { path: "/", element: <Navigate to="/login" replace /> },
        { path: "/login", element: <LoginPage /> },
        {
          path: "/administracion/*",
          element: (
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          ),
        },
        { path: "/invitacion", element: <PublicInvitationPage /> },
        { path: "*", element: <NotFoundPage /> },
      ]),
    [],
  );

  return <RouterProvider router={router} />;
}
