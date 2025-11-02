import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import clsx from 'clsx';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
const TaskModal = React.lazy(() => import('./TaskModal'));
import { moveTaskBetweenColumns, reorderTasks } from '../../utils/task.utils';
import type { Task, Column } from './KanbanBoard.types';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

interface KanbanBoardProps {
  initialColumns: Column[];
  darkMode?: boolean;
}

// Sortable KanbanCard Component
const SortableKanbanCard: React.FC<{ 
  task: Task; 
  onClick: () => void; 
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  darkMode?: boolean;
}> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: props.task.id 
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard {...props} />
    </div>
  );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialColumns, darkMode = false }) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssignee, setFilterAssignee] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');

  // Configure sensors via hook
  const { sensors, collisionDetection } = useDragAndDrop();

  // Get all unique assignees, priorities, and tags for filters
  const allAssignees = useMemo(() => {
    const assignees = new Set<string>();
    columns.forEach(col => {
      col.tasks.forEach(task => {
        if (task.assignee?.name) assignees.add(task.assignee.name);
      });
    });
    return Array.from(assignees);
  }, [columns]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    columns.forEach(col => {
      col.tasks.forEach(task => {
        task.tags?.forEach(tag => tags.add(tag));
      });
    });
    return Array.from(tags);
  }, [columns]);

  // Debounced search handler
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter tasks based on search and filters
  const filteredColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => {
        // Search query filter
        if (debouncedSearch) {
          const query = debouncedSearch.toLowerCase();
          const matchesSearch = 
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query) ||
            task.assignee?.name.toLowerCase().includes(query) ||
            task.tags?.some(tag => tag.toLowerCase().includes(query));
          if (!matchesSearch) return false;
        }

        // Assignee filter
        if (filterAssignee && task.assignee?.name !== filterAssignee) {
          return false;
        }

        // Priority filter
        if (filterPriority && task.priority !== filterPriority) {
          return false;
        }

        // Tag filter
        if (filterTag && !task.tags?.includes(filterTag)) {
          return false;
        }

        return true;
      })
    }));
  }, [columns, debouncedSearch, filterAssignee, filterPriority, filterTag]);

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    
    const draggedTask = columns
      .flatMap(column => column.tasks)
      .find(task => task.id === taskId);
      
    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  }, [columns]);

  // Handle drag over
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over || !active) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeTask = columns
      .flatMap(column => column.tasks)
      .find(task => task.id === activeId);
      
    if (!activeTask) return;
    
    const isOverColumn = columns.some(column => column.id === overId);
    const overTask = isOverColumn ? null : columns
      .flatMap(column => column.tasks)
      .find(task => task.id === overId);
    
    const overColumnId = isOverColumn ? overId : overTask?.columnId;
    
    if (overColumnId && activeTask.columnId !== overColumnId) {
      setColumns(prevColumns => {
        const sourceColumn = prevColumns.find(col => col.id === activeTask.columnId);
        const targetColumn = prevColumns.find(col => col.id === overColumnId);
        if (!sourceColumn || !targetColumn) return prevColumns;
        const sourceTasks = sourceColumn.tasks;
        const targetTasks = targetColumn.tasks;
        const sourceIndex = sourceTasks.findIndex(t => t.id === activeId);
        const { source, destination } = moveTaskBetweenColumns(sourceTasks, targetTasks, sourceIndex, targetTasks.length);
        const updatedTask = { ...activeTask, columnId: overColumnId };
        destination[destination.length - 1] = updatedTask;
        return prevColumns.map(column => {
          if (column.id === sourceColumn.id) return { ...column, tasks: source };
          if (column.id === targetColumn.id) return { ...column, tasks: destination };
          return column;
        });
      });
    }
  }, [columns]);

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTask(null);
    
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeColumnId = columns
      .find(column => column.tasks.some(task => task.id === activeId))?.id;
      
    const overColumnId = columns
      .find(column => column.tasks.some(task => task.id === overId))?.id;
      
    if (activeColumnId && overColumnId && activeColumnId === overColumnId) {
      setColumns(prevColumns => {
        const column = prevColumns.find(col => col.id === activeColumnId);
        if (!column) return prevColumns;
        const oldIndex = column.tasks.findIndex(task => task.id === activeId);
        const newIndex = column.tasks.findIndex(task => task.id === overId);
        const reordered = reorderTasks(column.tasks, oldIndex, newIndex);
        return prevColumns.map(col => (col.id === activeColumnId ? { ...col, tasks: reordered } : col));
      });
    }
  }, [columns]);

  // Task CRUD operations
  const handleAddTask = useCallback((columnId: string) => {
    setEditingTask({
      id: '',
      title: '',
      description: '',
      priority: 'medium',
      columnId,
      dueDate: new Date(Date.now() + 86400000 * 3)
    });
    setIsModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const handleDuplicateTask = useCallback((task: Task) => {
    const duplicatedTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      title: `${task.title} (Copy)`,
    };
    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === task.columnId 
          ? { ...column, tasks: [...column.tasks, duplicatedTask] }
          : column
      )
    );
  }, []);

  const handleSaveTask = useCallback((task: Task) => {
    setColumns(prevColumns => {
      if (!task.id) {
        const newTask = {
          ...task,
          id: `task-${Date.now()}`
        };
        return prevColumns.map(column => {
          if (column.id === task.columnId) {
            return {
              ...column,
              tasks: [...column.tasks, newTask]
            };
          }
          return column;
        });
      }
      
      const oldColumnId = prevColumns
        .find(column => column.tasks.some(t => t.id === task.id))?.id;
        
      if (oldColumnId && oldColumnId !== task.columnId) {
        return prevColumns.map(column => {
          if (column.id === oldColumnId) {
            return {
              ...column,
              tasks: column.tasks.filter(t => t.id !== task.id)
            };
          }
          if (column.id === task.columnId) {
            return {
              ...column,
              tasks: [...column.tasks, task]
            };
          }
          return column;
        });
      }
      
      return prevColumns.map(column => {
        if (column.id === task.columnId) {
          return {
            ...column,
            tasks: column.tasks.map(t => t.id === task.id ? task : t)
          };
        }
        return column;
      });
    });
    
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId)
      }))
    );
    
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  // Column operations
  const handleRenameColumn = useCallback((columnId: string, newTitle: string) => {
    setColumns(prevColumns =>
      prevColumns.map(col => col.id === columnId ? { ...col, title: newTitle } : col)
    );
  }, []);

  const handleSetWipLimit = useCallback((columnId: string, limit: number | undefined) => {
    setColumns(prevColumns =>
      prevColumns.map(col => col.id === columnId ? { ...col, wipLimit: limit } : col)
    );
  }, []);

  const handleToggleCollapse = useCallback((columnId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(col => 
        col.id === columnId ? { ...col, collapsed: !col.collapsed } : col
      )
    );
  }, []);

  const handleAddColumn = useCallback(() => {
    if (columns.length >= 6) {
      window.alert('Maximum limit of 6 columns reached!');
      return;
    }
    
    const newColumnId = `column-${Date.now()}`;
    const newColumnTitle = `New Column ${columns.length + 1}`;
    
    setColumns(prevColumns => [
      ...prevColumns,
      {
        id: newColumnId,
        title: newColumnTitle,
        tasks: []
      }
    ]);
  }, [columns.length]);

  const handleDeleteColumn = useCallback((columnId: string) => {
    if (window.confirm('Are you sure you want to delete this column? All tasks will be moved to the first column.')) {
      setColumns(prevColumns => {
        const columnToDelete = prevColumns.find(col => col.id === columnId);
        const firstColumn = prevColumns[0];
        if (!columnToDelete || !firstColumn || columnToDelete.id === firstColumn.id) {
          return prevColumns.filter(col => col.id !== columnId);
        }
        return prevColumns
          .filter(col => col.id !== columnId)
          .map(col => 
            col.id === firstColumn.id 
              ? { ...col, tasks: [...col.tasks, ...columnToDelete.tasks] }
              : col
          );
      });
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  // Escape key handler for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isModalOpen, handleCloseModal]);

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={clsx(
        'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b',
        darkMode ? 'border-gray-700' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Kanban Board</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(), 'MMMM d, yyyy')}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={clsx(
              'px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500',
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900'
            )}
          />
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className={clsx(
              'px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500',
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            )}
          >
            <option value="">All Assignees</option>
            {allAssignees.map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className={clsx(
              'px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500',
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            )}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          {allTags.length > 0 && (
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500',
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              )}
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          )}
          {(searchQuery || filterAssignee || filterPriority || filterTag) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterAssignee('');
                setFilterPriority('');
                setFilterTag('');
              }}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-lg',
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              )}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Board Container with Responsive Scroll */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        collisionDetection={collisionDetection}
      >
        <div className={clsx(
          'flex-1 overflow-y-auto sm:overflow-x-auto sm:overflow-y-hidden',
          'sm:scroll-smooth sm:snap-x sm:snap-mandatory',
          'px-4 py-2'
        )}>
          <div className={clsx(
            'flex gap-4 h-full',
            // Mobile: stack vertically, Tablet+: horizontal scroll
            'flex-col sm:flex-row',
            'sm:min-w-max'
          )}>
            {filteredColumns.map(column => (
              <div
                key={column.id}
                className={clsx(
                  'sm:snap-start',
                  // Responsive widths
                  'w-full sm:w-[280px] md:w-[300px] lg:w-[320px]',
                  'shrink-0'
                )}
              >
                <KanbanColumn
                  column={column}
                  onAddTask={() => handleAddTask(column.id)}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onDuplicateTask={handleDuplicateTask}
                  onRenameColumn={handleRenameColumn}
                  onSetWipLimit={handleSetWipLimit}
                  onDeleteColumn={handleDeleteColumn}
                  onToggleCollapse={handleToggleCollapse}
                  darkMode={darkMode}
                  renderCard={(task, onClick, darkMode) => (
                    <SortableKanbanCard
                      key={task.id}
                      task={task}
                      onClick={onClick}
                      onEdit={() => handleEditTask(task)}
                      onDelete={() => handleDeleteTask(task.id)}
                      onDuplicate={() => handleDuplicateTask(task)}
                      darkMode={darkMode}
                    />
                  )}
                />
              </div>
            ))}
            
            {/* Add Column Button */}
            {columns.length < 6 && (
              <div className={clsx(
                'sm:snap-start shrink-0',
                'w-full sm:w-[280px] md:w-[300px] lg:w-[320px]'
              )}>
                <button
                  onClick={handleAddColumn}
                  className={clsx(
                    'w-full h-[200px] rounded-xl border-2 border-dashed',
                    'flex items-center justify-center gap-2',
                    'transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                    darkMode
                      ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700 hover:border-gray-500 text-gray-300'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 text-gray-600'
                  )}
                  aria-label="Add another list"
                >
                  <span className="text-2xl">+</span>
                  <span className="font-medium">Add another list</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <DragOverlay>
          {activeTask ? (
            <div className="opacity-80 rotate-2">
              <KanbanCard
                task={activeTask}
                onClick={() => {}}
                darkMode={darkMode}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      {isModalOpen && editingTask && (
        <React.Suspense fallback={null}>
          <TaskModal
            task={editingTask}
            columns={columns}
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
            onClose={handleCloseModal}
            darkMode={darkMode}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default KanbanBoard;
