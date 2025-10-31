import type { Task } from '../components/KanbanBoard/KanbanBoard.types';

export function isOverdue(dueDate: Date): boolean {
  return new Date() > dueDate;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getPriorityColor(priority: string): string {
  const colors = {
    low: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
    medium: 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500',
    high: 'bg-orange-100 text-orange-700 border-l-4 border-orange-500',
    urgent: 'bg-red-100 text-red-700 border-l-4 border-red-500',
  } as const;
  // @ts-expect-error narrow fallback
  return colors[priority] || colors.medium;
}

export function reorderTasks<T>(tasks: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export function moveTaskBetweenColumns<T>(
  sourceColumn: T[],
  destColumn: T[],
  sourceIndex: number,
  destIndex: number
): { source: T[]; destination: T[] } {
  const sourceClone = Array.from(sourceColumn);
  const destClone = Array.from(destColumn);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destIndex, 0, removed);
  return { source: sourceClone, destination: destClone };
}


export const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Create UI Components',
    description: 'Build reusable UI components for the application',
    priority: 'high',
    columnId: 'todo',
    assignee: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    tags: ['UI', 'Design', 'Frontend'],
    dueDate: new Date(Date.now() + 86400000 * 3)
  },
  {
    id: 'task-2',
    title: 'Implement Drag and Drop',
    description: 'Add drag and drop functionality to the Kanban board',
    priority: 'medium',
    columnId: 'in-progress',
    assignee: {
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    tags: ['Feature', 'Interaction'],
    dueDate: new Date(Date.now() + 86400000 * 5)
  },
  {
    id: 'task-3',
    title: 'Write Unit Tests',
    description: 'Create unit tests for all components',
    priority: 'low',
    columnId: 'todo',
    assignee: {
      name: 'Bob Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    tags: ['Testing', 'QA'],
    dueDate: new Date(Date.now() + 86400000 * 7)
  },
  {
    id: 'task-4',
    title: 'Fix Accessibility Issues',
    description: 'Ensure all components are accessible',
    priority: 'urgent',
    columnId: 'review',
    assignee: {
      name: 'Alice Brown',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    tags: ['A11y', 'Bug'],
    dueDate: new Date(Date.now() - 86400000)
  },
  {
    id: 'task-5',
    title: 'Deploy to Production',
    description: 'Deploy the application to production environment',
    priority: 'high',
    columnId: 'done',
    assignee: {
      name: 'Charlie Wilson',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    tags: ['DevOps', 'Release'],
    dueDate: new Date(Date.now() - 86400000 * 2)
  }
];