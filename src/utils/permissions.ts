import { User } from "@/context/AuthContext";

export type Role =
  | "student"
  | "supervisor"
  | "committee"
  | "discussion"
  | "admin";

export interface Permission {
  resource: string;
  action: string;
  roles: Role[];
}

// Define permissions for different resources and actions
export const permissions: Permission[] = [
  // Projects
  {
    resource: "projects",
    action: "view",
    roles: ["student", "supervisor", "committee", "discussion"],
  },
  { resource: "projects", action: "create", roles: ["student"] },
  { resource: "projects", action: "edit", roles: ["student", "supervisor", "committee"] },
  { resource: "projects", action: "delete", roles: ["student"] },
  {
    resource: "projects",
    action: "evaluate",
    roles: ["supervisor", "discussion"],
  },
  { resource: "projects", action: "register", roles: ["student"] },
  { resource: "projects", action: "browse", roles: ["student"] },
  { resource: "projects", action: "assign_supervisor", roles: ["committee"] },
  { resource: "projects", action: "approve", roles: ["committee"] },
  { resource: "projects", action: "reject", roles: ["committee"] },
  { resource: "projects", action: "manage_grades", roles: ["committee"] },

  // Proposals
  {
    resource: "proposals",
    action: "view",
    roles: ["student", "supervisor", "committee"],
  },
  { resource: "proposals", action: "create", roles: ["student", "supervisor"] },
  { resource: "proposals", action: "edit", roles: ["student"] },
  { resource: "proposals", action: "delete", roles: ["student"] },
  { resource: "proposals", action: "review", roles: ["committee"] },
  { resource: "proposals", action: "approve", roles: ["committee"] },
  { resource: "proposals", action: "reject", roles: ["committee"] },
  { resource: "proposals", action: "announce", roles: ["committee"] },

  // Documents
  {
    resource: "documents",
    action: "view",
    roles: ["student", "supervisor", "committee"],
  },
  { resource: "documents", action: "upload", roles: ["student", "supervisor"] },
  { resource: "documents", action: "edit", roles: ["student", "supervisor"] },
  { resource: "documents", action: "delete", roles: ["student", "supervisor"] },

  // Evaluations
  {
    resource: "evaluations",
    action: "view",
    roles: ["student", "supervisor", "discussion"],
  },
  {
    resource: "evaluations",
    action: "create",
    roles: ["supervisor", "discussion"],
  },
  {
    resource: "evaluations",
    action: "edit",
    roles: ["supervisor", "discussion"],
  },

  // Requests
  { resource: "requests", action: "view", roles: ["student", "supervisor", "committee"] },
  { resource: "requests", action: "create", roles: ["student"] },
  { resource: "requests", action: "approve", roles: ["supervisor", "committee"] },
  { resource: "requests", action: "reject", roles: ["supervisor", "committee"] },
  { resource: "requests", action: "handle", roles: ["supervisor", "committee"] },

  // Schedules
  { resource: "schedules", action: "view", roles: ["supervisor", "committee"] },
  { resource: "schedules", action: "create", roles: ["committee"] },
  { resource: "schedules", action: "edit", roles: ["committee"] },

  // Reports
  { resource: "reports", action: "view", roles: ["committee", "admin"] },
  { resource: "reports", action: "generate", roles: ["committee", "admin"] },

  // Users
  { resource: "users", action: "view", roles: ["admin"] },
  { resource: "users", action: "create", roles: ["admin"] },
  { resource: "users", action: "edit", roles: ["admin"] },
  { resource: "users", action: "delete", roles: ["admin"] },

  // Groups
  { resource: "groups", action: "view", roles: ["student", "supervisor"] },
  { resource: "groups", action: "manage", roles: ["student"] },
  { resource: "groups", action: "create", roles: ["student"] },
  { resource: "groups", action: "invite", roles: ["student"] },
  { resource: "groups", action: "leave", roles: ["student"] },

  // Announcements
  {
    resource: "announcements",
    action: "view",
    roles: ["student", "supervisor", "committee"],
  },
  { resource: "announcements", action: "create", roles: ["committee"] },
  { resource: "announcements", action: "edit", roles: ["committee"] },

  // Distribution
  { resource: "distribution", action: "view", roles: ["committee"] },
  { resource: "distribution", action: "manage", roles: ["committee"] },
  { resource: "distribution", action: "assign", roles: ["committee"] },

  // Project Registration
  { resource: "project_registration", action: "view", roles: ["student"] },
  { resource: "project_registration", action: "register", roles: ["student"] },
  { resource: "project_registration", action: "cancel", roles: ["student"] },

  // Supervisor Assignment
  { resource: "supervisor_assignment", action: "view", roles: ["committee"] },
  { resource: "supervisor_assignment", action: "assign", roles: ["committee"] },
  { resource: "supervisor_assignment", action: "remove", roles: ["committee"] },

  // Grades Management
  { resource: "grades", action: "view", roles: ["student", "supervisor", "committee", "discussion"] },
  { resource: "grades", action: "manage", roles: ["committee"] },
  { resource: "grades", action: "calculate", roles: ["committee"] },
  { resource: "grades", action: "export", roles: ["student", "supervisor", "committee"] },
];

/**
 * Check if a user has permission for a specific resource and action
 */
export function hasPermission(
  user: User | null,
  resource: string,
  action: string
): boolean {
  if (!user) return false;

  const permission = permissions.find(
    (p) => p.resource === resource && p.action === action
  );

  return permission?.roles.includes(user.role) ?? false;
}

/**
 * Check if a user has any of the specified roles
 */
export function hasRole(user: User | null, allowedRoles: Role[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

/**
 * Get all permissions for a specific role
 */
export function getRolePermissions(role: Role): Permission[] {
  return permissions.filter((p) => p.roles.includes(role));
}

/**
 * Check if user can access a route based on roles
 */
export function canAccessRoute(
  user: User | null,
  allowedRoles: Role[]
): boolean {
  return hasRole(user, allowedRoles);
}
