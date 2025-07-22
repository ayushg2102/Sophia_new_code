export interface Task {
  task_id: string;
  task_category: string;
  task_short_description: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'One-Time';
  task_due_date: string;
  status: 'active' | 'completed' | 'pending';
  description?: string;
  subtasks?: Subtask[];
  actions?: Action[];
}

export interface Action {
  action_id: string;
  instructions: string;
  tools_used: string[];
}

export interface Subtask {
  subtask_id: string;
  subtask_short_description: string;
  status: 'completed' | 'due' | 'in-progress';
  started_at?: string;
  completed_at?: string;
  duration?: string;
  period_considered?: string;
  employees_analyzed?: number;
  employee_contributions?: EmployeeContribution[];
  instructions?: string;
}

export interface EmployeeContribution {
  name: string;
  latest_contribution: number;
  latest_contribution_date: string | null;
  ytd_contribution: number;
}

export interface DashboardMetrics {
  active_tasks: number;
  due_this_week: number;
  completed: number;
  actions_pending: number;
}