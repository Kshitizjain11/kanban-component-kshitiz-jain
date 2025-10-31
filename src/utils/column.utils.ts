import { sampleTasks } from './task.utils';
import type { Column } from '../components/KanbanBoard/KanbanBoard.types';

export function getColumnById<T extends { id: string }>(columns: T[], id: string): T | undefined {
  return columns.find(c => c.id === id);
}

export const sampleColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: sampleTasks.filter(task => task.columnId === 'todo')
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: sampleTasks.filter(task => task.columnId === 'in-progress')
  },
  {
    id: 'review',
    title: 'Review',
    tasks: sampleTasks.filter(task => task.columnId === 'review')
  },
  {
    id: 'done',
    title: 'Done',
    tasks: sampleTasks.filter(task => task.columnId === 'done')
  }
];