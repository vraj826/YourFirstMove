export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  due_date: string;
  due_time?: string;
  end_time?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_critical: boolean;
  is_completed: boolean;
  completed_at?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  endTime?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  isCritical?: boolean;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  endTime?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  isCritical?: boolean;
  isCompleted?: boolean;
  displayOrder?: number;
}
