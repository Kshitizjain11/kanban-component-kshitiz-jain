import React, { useState } from 'react';
import clsx from 'clsx';
import { isOverdue, getInitials } from '../../utils/task.utils';
import { format } from 'date-fns';
import type { Task } from './KanbanBoard.types';
import { MdEdit } from 'react-icons/md';
import { FaClone, FaTrash } from 'react-icons/fa6';

interface KanbanCardProps {
  task: Task;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  darkMode?: boolean;
  isSelected?: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = React.memo(({ 
  task, 
  onClick, 
  onEdit,
  onDelete,
  onDuplicate,
  darkMode = false,
  isSelected = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const priorityColorMap: Record<string, string> = {
    low: 'border-blue-500',
    medium: 'border-yellow-500',
    high: 'border-orange-500',
    urgent: 'border-red-500',
  };

  const priorityBadgeColorMap: Record<string, { bg: string; text: string }> = {
    low: { bg: 'bg-blue-100', text: 'text-blue-700' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    high: { bg: 'bg-orange-100', text: 'text-orange-700' },
    urgent: { bg: 'bg-red-100', text: 'text-red-700' },
  };

  const priorityBadgeColorDarkMap: Record<string, { bg: string; text: string }> = {
    low: { bg: 'bg-blue-900/30', text: 'text-blue-300' },
    medium: { bg: 'bg-yellow-900/30', text: 'text-yellow-300' },
    high: { bg: 'bg-orange-900/30', text: 'text-orange-300' },
    urgent: { bg: 'bg-red-900/30', text: 'text-red-300' },
  };

  const borderColor = priorityColorMap[task.priority] || 'border-yellow-500';
  const priorityBadge = darkMode 
    ? priorityBadgeColorDarkMap[task.priority] || priorityBadgeColorDarkMap.medium
    : priorityBadgeColorMap[task.priority] || priorityBadgeColorMap.medium;
  
  const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  
  // Show max 3 tags
  const visibleTags = task.tags?.slice(0, 3) || [];
  const hasMoreTags = (task.tags?.length || 0) > 3;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter/Space to activate/open card
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
      return;
    }
    
    // Escape is handled at board level for modal, but can also close quick actions
    if (e.key === 'Escape') {
      // If there are quick actions visible, just blur focus
      if (isHovered) {
        (e.currentTarget as HTMLElement).blur();
      }
      return;
    }

    // Arrow keys, Home, and End are handled at board level
    // We don't prevent default here to allow board-level navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      // Let the board-level handler manage navigation
      return;
    }
  };

  const handleQuickActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      id={task.id}
      role="button"
      tabIndex={0}
      aria-label={`${task.title}. Status: ${task.columnId}. Priority: ${task.priority}. Press space or enter to open. Use arrow keys to navigate between tasks.`}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        'mb-2 p-3 rounded-xl cursor-pointer transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        borderColor,
        isSelected 
          ? 'ring-2 ring-blue-500 shadow-lg' 
          : 'shadow-sm hover:shadow-md',
        darkMode ? 'bg-gray-800' : 'bg-white',
        'relative'
      )}
    >
      {/* Priority colored left border */}
      <div className={clsx('absolute left-0 top-0 bottom-0 w-1 rounded-l-xl', borderColor)} />
      
      {/* Quick Actions on Hover */}
      {isHovered && (onEdit || onDelete || onDuplicate) && (
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          {onEdit && (
            <button
              onClick={(e) => handleQuickActionClick(e, onEdit)}
              className={clsx(
                'w-6 h-6 rounded-full flex items-center justify-center text-md',
                'bg-white/90 hover:bg-white shadow-sm transition-opacity',
                darkMode ? 'text-gray-800' : 'text-gray-700'
              )}
              aria-label="Edit task"
            >
              <MdEdit/>
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={(e) => handleQuickActionClick(e, onDuplicate)}
              className={clsx(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                'bg-white/90 hover:bg-white shadow-sm transition-opacity',
                darkMode ? 'text-gray-800' : 'text-gray-700'
              )}
              aria-label="Duplicate task"
            >
              <FaClone/>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => handleQuickActionClick(e, onDelete)}
              className={clsx(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                'bg-white/90 hover:bg-white shadow-sm transition-opacity',
                darkMode ? 'text-red-600' : 'text-red-500'
              )}
              aria-label="Delete task"
            >
              <FaTrash/>
            </button>
          )}
        </div>
      )}

      <div className="pl-2">
        {/* Title and Priority Badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className={clsx(
            'font-bold text-sm line-clamp-2 flex-1',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>{task.title}</h4>
          {/* Priority Badge */}
          <span className={clsx(
            'text-xs font-medium px-2 py-0.5 rounded-full shrink-0',
            priorityBadge.bg,
            priorityBadge.text
          )}>
            {priorityLabel}
          </span>
        </div>

        {/* Description - truncated to 2 lines */}
        {task.description && (
          <p className={clsx(
            'text-xs mb-3 line-clamp-2',
            darkMode ? 'text-gray-400' : 'text-gray-600'
          )}>{task.description}</p>
        )}

        {/* Tags - max 3 visible */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {visibleTags.map((tag, index) => (
              <span
                key={index}
                className={clsx(
                  'text-xs px-1.5 py-0.5 rounded bg-neutral-100 text-gray-700'
                )}
              >
                {tag}
              </span>
            ))}
            {hasMoreTags && (
              <span className={clsx(
                'text-xs px-1.5 py-0.5 rounded bg-neutral-100 text-gray-500'
              )}>
                +{task.tags!.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer: Assignee, Due Date, and optional icons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Assignee - avatar or initials */}
            {task.assignee ? (
              <div className="flex items-center gap-1">
                {task.assignee.avatar ? (
                  <img
                    src={task.assignee.avatar}
                    alt={task.assignee.name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                    darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                  )}>
                    {getInitials(task.assignee.name)}
                  </div>
                )}
                <span className={clsx(
                  'text-xs truncate max-w-[80px]',
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                )}>{task.assignee.name}</span>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {/* Due Date - red if overdue */}
            {task.dueDate && (
              <span className={clsx(
                'text-xs',
                isOverdue(new Date(task.dueDate)) 
                  ? 'text-red-500 font-medium' 
                  : darkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                {format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

KanbanCard.displayName = 'KanbanCard';
export default KanbanCard;
