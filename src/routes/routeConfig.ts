import { ComponentType } from "react";
import { Role } from "@/utils/permissions";

/**
 * Route configuration interface
 */
export interface RouteConfig {
  path: string;
  component: () => Promise<{ default: ComponentType<any> }>;
  allowedRoles: Role[];
  title?: string;
  description?: string;
}

/**
 * Lazy-loaded page components
 */
const pageComponents = {
  // Auth
  LoginPage: () => import("@/pages/auth/LoginPage"),

  // Dashboard
  Dashboard: () => import("@/pages/dashboards"),

  // Projects
  Projects: () => import("@/pages/projects"),
  ProjectAdd: () => import("@/pages/projects/new"),
  ProjectEdit: () => import("@/pages/projects/edit"),

  // Proposals
  Proposals: () => import("@/pages/proposals"),
  ProposalAdd: () => import("@/pages/proposals/new"),
  ProposalEdit: () => import("@/pages/proposals/edit"),
  MyProposals: () => import("@/pages/proposals/my-proposals"),
  GroupProposals: () => import("@/pages/proposals/group-proposals"),
  ApprovedProposals: () => import("@/pages/proposals/approved-proposals"),

  // Documents
  Documents: () => import("@/pages/documents"),
  DocumentAdd: () => import("@/pages/documents/new"),
  DocumentEdit: () => import("@/pages/documents/edit"),

  // Evaluations
  Evaluations: () => import("@/pages/evaluations"),
  EvaluationAdd: () => import("@/pages/evaluations/new"),
  EvaluationEdit: () => import("@/pages/evaluations/edit"),

  // Requests
  Requests: () => import("@/pages/requests"),
  RequestAdd: () => import("@/pages/requests/new"),
  RequestEdit: () => import("@/pages/requests/edit"),

  // Schedules
  Schedules: () => import("@/pages/schedules"),
  ScheduleAdd: () => import("@/pages/schedules/new"),
  ScheduleEdit: () => import("@/pages/schedules/edit"),

  // Reports
  Reports: () => import("@/pages/reports"),

  // Users
  Users: () => import("@/pages/users"),
  UserAdd: () => import("@/pages/users/new"),
  UserEdit: () => import("@/pages/users/edit"),

  // Groups
  Groups: () => import("@/pages/groups"),

  // Announcements
  Announcements: () => import("@/pages/announcements"),
  AnnouncementAdd: () => import("@/pages/announcements/new"),
  AnnouncementEdit: () => import("@/pages/announcements/edit"),

  // Distribution
  Distribution: () => import("@/pages/distribution"),
  DistributionAdd: () => import("@/pages/distribution/new"),
  DistributionEdit: () => import("@/pages/distribution/edit"),

  // Supervisor Requests
  SupervisorRequests: () => import("@/pages/supervisor-requests"),

  // Demo
  ComponentsDemo: () => import("@/pages/ComponentsDemo"),
} as const;

/**
 * All available roles
 */
const ALL_ROLES: Role[] = [
  "student",
  "supervisor",
  "committee",
  "discussion",
  "admin",
];

/**
 * Public routes (no authentication required)
 */
export const publicRoutes: RouteConfig[] = [
  {
    path: "/login",
    component: pageComponents.LoginPage,
    allowedRoles: [],
    title: "Login",
  },
];

/**
 * Protected routes (authentication required)
 */
export const protectedRoutes: RouteConfig[] = [
  // Dashboard
  {
    path: "/",
    component: pageComponents.Dashboard,
    allowedRoles: ALL_ROLES,
    title: "Dashboard",
  },
  {
    path: "/dashboard",
    component: pageComponents.Dashboard,
    allowedRoles: ALL_ROLES,
    title: "Dashboard",
  },

  // Projects
  {
    path: "/projects",
    component: pageComponents.Projects,
    allowedRoles: ["student", "supervisor", "committee", "discussion"],
    title: "Projects",
  },
  {
    path: "/projects/new",
    component: pageComponents.ProjectAdd,
    allowedRoles: ["student"],
    title: "New Project",
  },
  {
    path: "/projects/:id/edit",
    component: pageComponents.ProjectEdit,
    allowedRoles: ["student", "supervisor"],
    title: "Edit Project",
  },

  // Proposals
  {
    path: "/proposals",
    component: pageComponents.Proposals,
    allowedRoles: ["student", "supervisor", "committee"],
    title: "Proposals",
  },
  {
    path: "/proposals/new",
    component: pageComponents.ProposalAdd,
    allowedRoles: ["student"],
    title: "New Proposal",
  },
  {
    path: "/proposals/my",
    component: pageComponents.MyProposals,
    allowedRoles: ["student"],
    title: "My Proposals",
  },
  {
    path: "/proposals/group",
    component: pageComponents.GroupProposals,
    allowedRoles: ["student"],
    title: "Group Proposals",
  },
  {
    path: "/proposals/approved",
    component: pageComponents.ApprovedProposals,
    allowedRoles: ["student"],
    title: "Approved Proposals",
  },
  {
    path: "/proposals/:id/edit",
    component: pageComponents.ProposalEdit,
    allowedRoles: ["student"],
    title: "Edit Proposal",
  },

  // Documents
  {
    path: "/documents",
    component: pageComponents.Documents,
    allowedRoles: ["student", "supervisor", "committee"],
    title: "Documents",
  },
  {
    path: "/documents/new",
    component: pageComponents.DocumentAdd,
    allowedRoles: ["student", "supervisor"],
    title: "New Document",
  },
  {
    path: "/documents/:id/edit",
    component: pageComponents.DocumentEdit,
    allowedRoles: ["student", "supervisor"],
    title: "Edit Document",
  },

  // Evaluations
  {
    path: "/evaluations",
    component: pageComponents.Evaluations,
    allowedRoles: ["student", "supervisor", "discussion"],
    title: "Evaluations",
  },
  {
    path: "/evaluations/new",
    component: pageComponents.EvaluationAdd,
    allowedRoles: ["supervisor", "discussion"],
    title: "New Evaluation",
  },
  {
    path: "/evaluations/:id/edit",
    component: pageComponents.EvaluationEdit,
    allowedRoles: ["supervisor", "discussion"],
    title: "Edit Evaluation",
  },

  // Requests
  {
    path: "/requests",
    component: pageComponents.Requests,
    allowedRoles: ["student", "supervisor", "committee"],
    title: "Requests",
  },
  {
    path: "/requests/new",
    component: pageComponents.RequestAdd,
    allowedRoles: ["student"],
    title: "New Request",
  },
  {
    path: "/requests/:id/edit",
    component: pageComponents.RequestEdit,
    allowedRoles: ["student"],
    title: "Edit Request",
  },

  // Schedules
  {
    path: "/schedules",
    component: pageComponents.Schedules,
    allowedRoles: ["supervisor", "committee"],
    title: "Schedules",
  },
  {
    path: "/schedules/new",
    component: pageComponents.ScheduleAdd,
    allowedRoles: ["committee"],
    title: "New Schedule",
  },
  {
    path: "/schedules/:id/edit",
    component: pageComponents.ScheduleEdit,
    allowedRoles: ["committee"],
    title: "Edit Schedule",
  },

  // Reports
  {
    path: "/reports",
    component: pageComponents.Reports,
    allowedRoles: ["committee", "admin"],
    title: "Reports",
  },

  // Users
  {
    path: "/users",
    component: pageComponents.Users,
    allowedRoles: ["admin"],
    title: "Users",
  },
  {
    path: "/users/new",
    component: pageComponents.UserAdd,
    allowedRoles: ["admin"],
    title: "New User",
  },
  {
    path: "/users/:id/edit",
    component: pageComponents.UserEdit,
    allowedRoles: ["admin"],
    title: "Edit User",
  },
  {
    path: "/permissions",
    component: pageComponents.Users,
    allowedRoles: ["admin"],
    title: "Permissions",
  },

  // Groups
  {
    path: "/groups",
    component: pageComponents.Groups,
    allowedRoles: ["student", "supervisor"],
    title: "Groups",
  },
  {
    path: "/group-management",
    component: pageComponents.Groups,
    allowedRoles: ["student"],
    title: "Group Management",
  },

  // Supervisor Requests
  {
    path: "/supervisor-requests",
    component: pageComponents.SupervisorRequests,
    allowedRoles: ["supervisor"],
    title: "Supervisor Requests",
  },

  // Announcements
  {
    path: "/announcements",
    component: pageComponents.Announcements,
    allowedRoles: ["committee"],
    title: "Announcements",
  },
  {
    path: "/announcements/new",
    component: pageComponents.AnnouncementAdd,
    allowedRoles: ["committee"],
    title: "New Announcement",
  },
  {
    path: "/announcements/:id/edit",
    component: pageComponents.AnnouncementEdit,
    allowedRoles: ["committee"],
    title: "Edit Announcement",
  },

  // Distribution
  {
    path: "/distribution",
    component: pageComponents.Distribution,
    allowedRoles: ["committee"],
    title: "Distribution",
  },
  {
    path: "/distribution/new",
    component: pageComponents.DistributionAdd,
    allowedRoles: ["committee"],
    title: "New Distribution",
  },
  {
    path: "/distribution/:id/edit",
    component: pageComponents.DistributionEdit,
    allowedRoles: ["committee"],
    title: "Edit Distribution",
  },

  // Demo
  {
    path: "/components-demo",
    component: pageComponents.ComponentsDemo,
    allowedRoles: ALL_ROLES,
    title: "Components Demo",
  },
];

/**
 * Default redirect paths
 */
export const DEFAULT_PATHS = {
  authenticated: "/dashboard",
  unauthenticated: "/login",
} as const;
