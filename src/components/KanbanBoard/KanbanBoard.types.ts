export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  columnId: string;
  assignee?: {
    name: string;
    avatar: string;
  };
  tags?: string[];
  dueDate?: Date;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  wipLimit?: number;
  collapsed?: boolean;
}

export type KanbanState = {
  columns: Column[];
  tasks: Task[];
};