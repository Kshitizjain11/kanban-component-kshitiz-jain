import React, { useState } from 'react'
import type { Column, Task } from './KanbanBoard.types';
import { format } from 'date-fns';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import TaskModal from './TaskModal';


interface KanbanBoardProps {
  initialColumns: Column[];
  darkMode?: boolean;
}

const KanbanBoard : React.FC<KanbanBoardProps> = ({initialColumns,darkMode=false}) => {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const handleAddTask = (columnId: string) => {
    setEditingTask({
      id: '',
      title: '',
      description: '',
      priority: 'medium',
      columnId,
      dueDate: new Date(Date.now() + 86400000 * 3), // Default due date: 3 days from now
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
    setColumns((prevColumns) => {
      if (!task.id) {
        const newTask = {
          ...task,
          id: `task-${Date.now()}`,
        };
        return prevColumns.map((column) =>
          column.id === task.columnId
            ? { ...column, tasks: [...column.tasks, newTask] }
            : column
        );
      }

      const oldColumnId = prevColumns.find((column) =>
        column.tasks.some((t) => t.id === task.id)
      )?.id;

      if (oldColumnId && oldColumnId !== task.columnId) {
        return prevColumns.map((column) => {
          if (column.id === oldColumnId) {
            return {
              ...column,
              tasks: column.tasks.filter((t) => t.id !== task.id),
            };
          }
          if (column.id === task.columnId) {
            return {
              ...column,
              tasks: [...column.tasks, task],
            };
          }
          return column;
        });
      }

      return prevColumns.map((column) =>
        column.id === task.columnId
          ? {
              ...column,
              tasks: column.tasks.map((t) => (t.id === task.id ? task : t)),
            }
          : column
      );
    });

    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Delete a task
  const handleDeleteTask = (taskId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
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
     <div
    className={`h-full flex flex-col ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}
  >
    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold">Kanban Board</h2>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {format(new Date(), 'MMMM d, yyyy')}
      </div>
    </div>

    <div className="flex-1 p-4 overflow-x-auto">
      <div className="flex gap-4 h-full">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onAddTask={() => handleAddTask(column.id)}
            onEditTask={handleEditTask}
            darkMode={darkMode}
            renderCard={(task, onClick, darkMode) => (
              <KanbanCard
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
      )
}

export default KanbanBoard