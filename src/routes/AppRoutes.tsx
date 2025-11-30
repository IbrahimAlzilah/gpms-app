import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { publicRoutes, protectedRoutes, DEFAULT_PATHS } from "./routeConfig";
import { renderPublicRoute, renderProtectedRoute } from "./routeHelpers";

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render public routes for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {publicRoutes.map(renderPublicRoute)}
          <Route path="*" element={<Navigate to={DEFAULT_PATHS.unauthenticated} replace />}
          />
        </Routes>
      </Suspense>
    );
  }

  // Render protected routes for authenticated users
  return (
    <MainLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {protectedRoutes.map(renderProtectedRoute)}
          <Route path="*" element={<Navigate to={DEFAULT_PATHS.authenticated} replace />}
          />
        </Routes>
      </Suspense>
    </MainLayout>
  );
};

export default AppRoutes;
