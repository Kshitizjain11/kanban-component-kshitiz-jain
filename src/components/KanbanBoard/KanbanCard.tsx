import React from 'react';
import clsx from 'clsx';
import { isOverdue, getPriorityColor } from '../../utils/task.utils';
import { format } from 'date-fns';
import type { Task } from './KanbanBoard.types';

interface KanbanCardProps {
  task: Task;
  onClick: () => void;
  darkMode?: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = React.memo(({ task, onClick, darkMode = false }) => {
  const priorityBadge = getPriorityColor(task.priority);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      id={task.id}
      role="button"
      tabIndex={0}
      aria-label={`${task.title}. Status: ${task.columnId}. Priority: ${task.priority}. Press space to grab.`}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      className={clsx(
        'mb-2 p-3 rounded-md cursor-pointer shadow-sm hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className={clsx(
          'font-medium text-sm',
          darkMode ? 'text-white' : 'text-gray-900'
        )}>{task.title}</h4>
        <span className={clsx('text-xs px-2 py-0.5 rounded-full', priorityBadge)}>{task.priority}</span>
      </div>
      <p className={clsx(
        'text-xs mb-3 line-clamp-2',
        darkMode ? 'text-gray-400' : 'text-gray-600'
      )}>{task.description}</p>
      <div className="flex justify-between items-center">
        {task.assignee && (
          <div className="flex items-center">
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-6 h-6 rounded-full mr-1"
            />
            <span className={clsx(
              'text-xs',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>{task.assignee.name}</span>
          </div>
        )}
        {task.dueDate && (
          <span className={clsx(
            'text-xs',
            darkMode ? 'text-gray-400' : 'text-gray-600',
            isOverdue(new Date(task.dueDate)) ? 'text-red-500' : ''
          )}>
            {format(new Date(task.dueDate), 'MMM d')}
          </span>
        )}
      </div>
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className={clsx(
                'text-xs px-1.5 py-0.5 rounded',
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
export default KanbanCard;
