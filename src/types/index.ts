export interface Task {
  task_id: string;
  task_category: string;
  task_short_description: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly'|'Annual' | 'One-Time'|'Once in six years';
  task_due_date: string;
  status: 'active' | 'completed' | 'pending';
  description?: string;
  subtasks?: Subtask[];
  actions?: Action[];
  last_run_date?: string;
  next_run_date?: string;
  renewal_date?: string;
  cadence?: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
}

export interface Action {
  action_id: string;
  action_instruction: string;
  tools_used: string[];
  frequency?: string;
  status?: 'configured' | 'not-configured';
}

export interface Subtask {
  subtask_id: string;
  subtask_short_description: string;
  status: 'completed' | 'due' | 'in-progress';
  subtask_description?: string;
  due_date?: string;
  task_id?: string;
  last_status_change_date?: string;
  subtask_create_date?: string;
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