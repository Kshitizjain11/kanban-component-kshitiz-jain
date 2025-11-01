import React, { useCallback, useMemo, useState } from 'react';
import { useSortable, SortableContext } from '@dnd-kit/sortable';
import clsx from 'clsx';
import type { Task, Column } from './KanbanBoard.types';

interface KanbanColumnProps {
  column: Column;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  darkMode?: boolean;
  renderCard: (task: Task, onClick: () => void, darkMode?: boolean) => React.ReactElement;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, onAddTask, onEditTask, darkMode = false, renderCard }) => {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: { type: 'Column', column }
  });

  // Simple virtualization for long lists
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const itemHeight = 120;
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const start = Math.floor(scrollTop / itemHeight);
    const end = start + 20;
    setVisibleRange({ start, end });
  }, []);

  const visibleTasks = useMemo(
    () => column.tasks.slice(visibleRange.start, visibleRange.end),
    [column.tasks, visibleRange]
  );

  return (
    <div
      ref={setNodeRef}
      id={column.id}
      role="region"
      aria-label={`${column.title} column. ${column.tasks.length} tasks.`}
      className={clsx(
        'shrink-0 w-full md:w-80 flex flex-col rounded-lg',
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      )}
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h3 className={clsx(
            'font-medium',
            darkMode ? 'text-white' : 'text-gray-800'
          )}>{column.title}</h3>
          <span className={clsx(
            'text-xs px-2 py-1 rounded-full',
            darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
          )}>{column.tasks.length}</span>
        </div>
      </div>
      <div className="flex-1 p-2 overflow-y-auto min-h-[200px]" aria-live="polite" onScroll={handleScroll} style={{ height: '70vh' }}>
        <div style={{ height: column.tasks.length * itemHeight }}>
          <SortableContext items={visibleTasks.map(task => task.id)}>
            {visibleTasks.map(task =>
              renderCard(task, () => onEditTask(task), darkMode)
            )}
          </SortableContext>
        </div>
      </div>
      <div className="p-2 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onAddTask}
          className={clsx(
            'w-full py-2 px-3 rounded-md flex items-center justify-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            darkMode
              ? 'bg-gray-600 hover:bg-gray-700 text-black'
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
          )}
        >
          <i className="fa-solid fa-plus text-xs mr-1"></i>
          Add Task
        </button>
      </div>
    </div>
  );
};
export default KanbanColumn;
