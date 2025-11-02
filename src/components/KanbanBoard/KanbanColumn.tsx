import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSortable, SortableContext } from '@dnd-kit/sortable';
import clsx from 'clsx';
import type { Task, Column } from './KanbanBoard.types';
import { MdOutlineTaskAlt } from 'react-icons/md';
import { HiOutlineDotsVertical } from 'react-icons/hi';

interface KanbanColumnProps {
  column: Column;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onDuplicateTask?: (task: Task) => void;
  onRenameColumn?: (columnId: string, newTitle: string) => void;
  onSetWipLimit?: (columnId: string, limit: number | undefined) => void;
  onDeleteColumn?: (columnId: string) => void;
  onToggleCollapse?: (columnId: string) => void;
  darkMode?: boolean;
  renderCard: (task: Task, onClick: () => void, darkMode?: boolean) => React.ReactElement;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  onAddTask, 
  onEditTask,
  onDeleteTask: _onDeleteTask,
  onDuplicateTask: _onDuplicateTask,
  onRenameColumn,
  onSetWipLimit,
  onDeleteColumn,
  onToggleCollapse,
  darkMode = false, 
  renderCard 
}) => {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: { type: 'Column', column }
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [showWipInput, setShowWipInput] = useState(false);
  const [wipLimitValue, setWipLimitValue] = useState(column.wipLimit?.toString() || '');
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const taskCount = column.tasks.length;
  const isWipExceeded = column.wipLimit !== undefined && taskCount > column.wipLimit;
  const isCollapsed = column.collapsed === true;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideMenu = menuRef.current?.contains(target);
      const clickedInsideDropdown = menuDropdownRef.current?.contains(target);
      
      if (!clickedInsideMenu && !clickedInsideDropdown) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  // Focus rename input when opened
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  const handleRename = useCallback(() => {
    if (newTitle.trim() && onRenameColumn) {
      onRenameColumn(column.id, newTitle.trim());
    }
    setIsRenaming(false);
    setIsMenuOpen(false);
  }, [newTitle, column.id, onRenameColumn]);

  const handleSetWipLimit = useCallback(() => {
    const limit = wipLimitValue.trim() ? parseInt(wipLimitValue, 10) : undefined;
    if (onSetWipLimit && (!wipLimitValue.trim() || !isNaN(limit!))) {
      onSetWipLimit(column.id, limit);
    }
    setShowWipInput(false);
    setIsMenuOpen(false);
  }, [wipLimitValue, column.id, onSetWipLimit]);

  const handleMenuButtonClick = useCallback(() => {
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({ 
        top: rect.bottom + window.scrollY, 
        right: window.innerWidth - rect.right 
      });
    }
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);


  return (
    <div
      ref={setNodeRef}
      id={column.id}
      role="region"
      aria-label={`${column.title} column. ${taskCount} tasks.`}
        className={clsx(
        'shrink-0 flex flex-col rounded-xl overflow-hidden',
        'w-full sm:w-[280px] md:w-[300px] lg:w-[320px]',
        darkMode ? 'bg-gray-700' : 'bg-gray-50',
        isWipExceeded && 'ring-2 ring-red-300 dark:ring-red-600'
      )}
    >
      {/* Sticky Header */}
      <div className={clsx(
        'sticky top-0 z-10 p-3 border-b',
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200',
        isWipExceeded && darkMode ? 'bg-red-900/20' : isWipExceeded ? 'bg-red-50' : ''
      )}>
        <div className="flex justify-between items-center mb-2">
          {isRenaming ? (
            <input
              ref={renameInputRef}
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setNewTitle(column.title);
                  setIsRenaming(false);
                }
              }}
              className={clsx(
                'flex-1 px-2 py-1 text-sm font-medium rounded',
                darkMode 
                  ? 'bg-gray-800 text-white border border-gray-600' 
                  : 'bg-white text-gray-900 border border-gray-300'
              )}
            />
          ) : (
            <h3 className={clsx(
              'flex-1 font-medium text-sm',
              darkMode ? 'text-white' : 'text-gray-800'
            )}>{column.title}</h3>
          )}

          {/* Options Menu Button */}
          {(onRenameColumn || onSetWipLimit || onDeleteColumn || onToggleCollapse) && (
            <div className="relative" ref={menuRef}>
              <button
                ref={menuButtonRef}
                onClick={handleMenuButtonClick}
                className={clsx(
                  'w-6 h-6 rounded flex items-center justify-center text-md',
                  darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
                )}
                aria-label="Column options"
              >
                <HiOutlineDotsVertical/>
              </button>

              {/* Options Menu Dropdown */}
              {isMenuOpen && (
                <div ref={menuDropdownRef} className={clsx(
                  'fixed w-48 rounded-lg shadow-lg z-50',
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                )}
                style={{ 
                  top: `${menuPosition.top}px`, 
                  right: `${menuPosition.right}px` 
                }}>
                  {onRenameColumn && (
                    <button
                      onClick={() => {
                        setIsRenaming(true);
                        setIsMenuOpen(false);
                      }}
                      className={clsx(
                        'w-full px-3 py-2 text-left text-sm rounded-t-lg',
                        darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                      )}
                    >
                      Rename column
                    </button>
                  )}
                  {onSetWipLimit && (
                    <div>
                      <button
                        onClick={() => {
                          setShowWipInput(true);
                          setIsMenuOpen(false);
                        }}
                        className={clsx(
                          'w-full px-3 py-2 text-left text-sm',
                          darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                        )}
                      >
                        Set WIP limit
                      </button>
                      {showWipInput && (
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                          <input
                            type="number"
                            min="1"
                            placeholder="Enter limit"
                            value={wipLimitValue}
                            onChange={(e) => setWipLimitValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSetWipLimit();
                              if (e.key === 'Escape') {
                                setShowWipInput(false);
                                setWipLimitValue(column.wipLimit?.toString() || '');
                              }
                            }}
                            className={clsx(
                              'w-full px-2 py-1 text-sm rounded',
                              darkMode 
                                ? 'bg-gray-900 text-white border border-gray-600' 
                                : 'bg-white text-gray-900 border border-gray-300'
                            )}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleSetWipLimit}
                              className={clsx(
                                'flex-1 px-2 py-1 text-xs rounded',
                                darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                              )}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setShowWipInput(false);
                                setWipLimitValue('');
                              }}
                              className={clsx(
                                'flex-1 px-2 py-1 text-xs rounded',
                                darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
                              )}
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {onToggleCollapse && (
                    <button
                      onClick={() => {
                        if (onToggleCollapse) onToggleCollapse(column.id);
                        setIsMenuOpen(false);
                      }}
                      className={clsx(
                        'w-full px-3 py-2 text-left text-sm',
                        darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                      )}
                    >
                      {isCollapsed ? 'Expand column' : 'Collapse column'}
                    </button>
                  )}
                  {onDeleteColumn && (
                    <button
                      onClick={() => {
                        if (onDeleteColumn) onDeleteColumn(column.id);
                        setIsMenuOpen(false);
                      }}
                      className={clsx(
                        'w-full px-3 py-2 text-left text-sm rounded-b-lg text-red-600',
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      )}
                    >
                      Delete column
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Task Count and WIP Limit Indicator */}
        <div className="flex justify-between items-center">
          <span className={clsx(
            'text-xs px-2 py-1 rounded-full font-medium',
            darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
          )}>
            {column.wipLimit ? `${taskCount}/${column.wipLimit}` : taskCount}
          </span>
          
          {/* WIP Limit Warning */}
          {isWipExceeded && (
            <span className={clsx(
              'text-xs flex items-center gap-1',
              darkMode ? 'text-red-400' : 'text-red-600'
            )}>
              WIP limit exceeded !
            </span>
          )}
        </div>
      </div>

      {/* Tasks List - Collapsible */}
      {!isCollapsed && (
        <div 
          className={clsx(
            'flex-1 overflow-y-auto min-h-[200px] max-h-[calc(100vh-280px)]',
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          )} 
          role="list"
          aria-label={`Tasks in ${column.title} column`}
          aria-live="polite"
        >
          <div className="px-2 pt-2 pb-2">
            {column.tasks.length === 0 ? (
              // Empty State
              <div className={clsx(
                'flex flex-col items-center justify-center py-8 px-4 rounded-lg',
                darkMode ? 'text-gray-400' : 'text-gray-500'
              )}>
                <div className="text-3xl mb-2">
                <MdOutlineTaskAlt className='text-gray-400'/> 
                </div>
                <p className="text-sm font-medium">No tasks yet</p>
                <p className="text-xs mt-1">Click "Add Task" to get started</p>
              </div>
            ) : (
              <SortableContext items={column.tasks.map(task => task.id)}>
                {column.tasks.map(task =>
                  renderCard(
                    task, 
                    () => onEditTask(task),
                    darkMode
                  )
                )}
              </SortableContext>
            )}
          </div>
        </div>
      )}

      {/* Add Task Button - Sticky at bottom */}
      {!isCollapsed && (
        <div className={clsx(
          'sticky bottom-0 p-2 border-t z-10',
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        )}>
          <button
            onClick={onAddTask}
            className={clsx(
              'w-full py-2 px-3 rounded-lg flex items-center justify-center text-sm font-medium',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
              'transition-colors',
              darkMode
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
            )}
            aria-label={`Add task to ${column.title} column`}
            tabIndex={0}
          >
            <span className="mr-1" aria-hidden="true">+</span>
            Add Task
          </button>
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;
