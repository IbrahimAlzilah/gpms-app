import { lazy, ComponentType } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth";
import { RouteConfig } from "./routeConfig";

/**
 * Renders a protected route from route configuration
 */
export const renderProtectedRoute = (config: RouteConfig) => {
  const LazyComponent = lazy(config.component);

  return (
    <Route
      key={config.path}
      path={config.path}
      element={
        <ProtectedRoute allowedRoles={config.allowedRoles}>
          <LazyComponent />
        </ProtectedRoute>
      }
    />
  );
};

/**
 * Renders a public route from route configuration
 */
export const renderPublicRoute = (config: RouteConfig) => {
  const LazyComponent = lazy(config.component);

  return (
    <Route
      key={config.path}
      path={config.path}
      element={<LazyComponent />}
    />
  );
};

