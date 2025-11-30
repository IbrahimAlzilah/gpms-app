export interface DashboardStat {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
  bgColor: string;
  color: string;
  onClick?: () => void;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  status: "success" | "pending" | "warning" | "info";
  icon: string;
}

export interface StudentDashboardData {
  stats: DashboardStat[];
  activities: Activity[];
}

export interface SupervisorDashboardData {
  stats: DashboardStat[];
  activities: Activity[];
}

export interface CommitteeDashboardData {
  stats: DashboardStat[];
  activities: Activity[];
}

export interface DiscussionDashboardData {
  stats: DashboardStat[];
  activities: Activity[];
}

export interface AdminDashboardData {
  stats: DashboardStat[];
  activities: Activity[];
}

export type DashboardData =
  | StudentDashboardData
  | SupervisorDashboardData
  | CommitteeDashboardData
  | DiscussionDashboardData
  | AdminDashboardData;
