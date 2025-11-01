import React, { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
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
const SortableKanbanCard: React.FC<{ task: Task; onClick: () => void; darkMode?: boolean }> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.task.id });
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
  
  // Configure sensors via hook
  const { sensors, collisionDetection } = useDragAndDrop();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    
    // Find the task being dragged
    const draggedTask = columns
      .flatMap(column => column.tasks)
      .find(task => task.id === taskId);
      
    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  };

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over || !active) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the active task
    const activeTask = columns
      .flatMap(column => column.tasks)
      .find(task => task.id === activeId);
      
    if (!activeTask) return;
    
    // Check if we're dragging over a column or a task
    const isOverColumn = columns.some(column => column.id === overId);
    const overTask = isOverColumn ? null : columns
      .flatMap(column => column.tasks)
      .find(task => task.id === overId);
    
    // If over a task, get its column
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
        // Replace moved item with updatedTask in destination tail
        destination[destination.length - 1] = updatedTask;
        return prevColumns.map(column => {
          if (column.id === sourceColumn.id) return { ...column, tasks: source };
          if (column.id === targetColumn.id) return { ...column, tasks: destination };
          return column;
        });
      });
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the columns containing the active and over tasks
    const activeColumnId = columns
      .find(column => column.tasks.some(task => task.id === activeId))?.id;
      
    const overColumnId = columns
      .find(column => column.tasks.some(task => task.id === overId))?.id;
      
    if (activeColumnId && overColumnId && activeColumnId === overColumnId) {
      // Reordering within the same column
      setColumns(prevColumns => {
        const column = prevColumns.find(col => col.id === activeColumnId);
        if (!column) return prevColumns;
        const oldIndex = column.tasks.findIndex(task => task.id === activeId);
        const newIndex = column.tasks.findIndex(task => task.id === overId);
        const reordered = reorderTasks(column.tasks, oldIndex, newIndex);
        return prevColumns.map(col => (col.id === activeColumnId ? { ...col, tasks: reordered } : col));
      });
    }
  };

  // Add a new task
  const handleAddTask = (columnId: string) => {
    setEditingTask({
      id: '',
      title: '',
      description: '',
      priority: 'medium',
      columnId,
      dueDate: new Date(Date.now() + 86400000 * 3) // Default due date: 3 days from now
    });
    setIsModalOpen(true);
  };

  // Edit an existing task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Save task (create or update)
  const handleSaveTask = (task: Task) => {
    setColumns(prevColumns => {
      // If it's a new task (no id)
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
      
      // If it's an existing task being updated
      const oldColumnId = prevColumns
        .find(column => column.tasks.some(t => t.id === task.id))?.id;
        
      // If the task moved to a different column
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
      
      // If the task stayed in the same column
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
  };

  // Delete a task
  const handleDeleteTask = (taskId: string) => {
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId)
      }))
    );
    
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold">Kanban Board</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {format(new Date(), 'MMMM d, yyyy')}
        </div>
      </div>
      
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        collisionDetection={(args) => collisionDetection(args)}
      >
        <div className="flex-1 p-4 overflow-x-auto">
          <div className="flex gap-4 h-full">
            {columns.map(column => (
              <KanbanColumn
                key={column.id}
                column={column}
                onAddTask={() => handleAddTask(column.id)}
                onEditTask={handleEditTask}
                darkMode={darkMode}
                renderCard={(task, onClick, darkMode) => (
                  <SortableKanbanCard
                    key={task.id}
                    task={task}
                    onClick={onClick}
                    darkMode={darkMode}
                  />
                )}
              />
            ))}
          </div>
        </div>
        
        <DragOverlay>
          {activeTask ? (
            <div className="opacity-80">
              <KanbanCard
                task={activeTask}
                onClick={() => {}}
                darkMode={darkMode}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
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