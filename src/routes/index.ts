/**
 * Routes module exports
 * Provides clean access to route components and configuration
 */

export { default as AppRoutes } from "./AppRoutes";
export { default } from "./AppRoutes";

// Route configuration exports
export type { RouteConfig } from "./routeConfig";
export { publicRoutes, protectedRoutes, DEFAULT_PATHS } from "./routeConfig";

// Route helper utilities
export { renderProtectedRoute, renderPublicRoute } from "./routeHelpers";
