import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import type { Task, Column } from './KanbanBoard.types';

interface TaskModalProps {
  task: Task;
  columns: Column[];
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClose: () => void;
  darkMode?: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  task, 
  columns, 
  onSave, 
  onDelete, 
  onClose, 
  darkMode = false 
}) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap and Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Focus first input
    const firstInput = modalRef.current?.querySelector('input, textarea, select') as HTMLElement;
    if (firstInput) firstInput.focus();

    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask({ 
      ...editedTask, 
      dueDate: e.target.value ? new Date(e.target.value) : undefined 
    });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setEditedTask({
      ...editedTask,
      assignee: name 
        ? { 
            name, 
            avatar: editedTask.assignee?.avatar || `https://i.pravatar.cc/150?u=${name}` 
          } 
        : undefined,
    });
  };

  const handleAddTag = () => {
    const input = document.getElementById('new-tag') as HTMLInputElement;
    if (input && input.value.trim()) {
      const newTag = input.value.trim();
      setEditedTask({
        ...editedTask,
        tags: [...(editedTask.tags || []), newTag]
      });
      input.value = '';
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags?.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTask);
  };

  const handleDelete = () => {
    if (task.id && window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        ref={modalRef}
        className={clsx(
          'w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-xl shadow-lg',
          darkMode ? 'bg-gray-900 text-white border border-gray-800' : 'bg-white text-gray-900'
        )}
      >
        <div className="sticky top-0 p-6 border-b bg-inherit flex justify-between items-center">
          <h2 id="modal-title" className="text-2xl font-semibold">
            {task.id ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            onClick={onClose}
            className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center text-xl',
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            )}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div id="modal-description" className="sr-only">
          {task.id ? 'Edit task details below' : 'Create a new task by filling in the details below'}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Title */}
          <div className="mb-4">
            <label 
              className={clsx(
                "block text-sm font-medium mb-2", 
                darkMode ? "text-gray-200" : "text-gray-700"
              )}
              htmlFor="title"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter a task title"
              required
              className={clsx(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              )}
              value={editedTask.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label 
              className={clsx(
                "block text-sm font-medium mb-2", 
                darkMode ? "text-gray-200" : "text-gray-700"
              )}
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the task..."
              rows={4}
              className={clsx(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none",
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              )}
              value={editedTask.description}
              onChange={handleChange}
            />
          </div>

          {/* Grid Layout for Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Priority */}
            <div>
              <label 
                className={clsx(
                  "block text-sm font-medium mb-2", 
                  darkMode ? "text-gray-200" : "text-gray-700"
                )}
                htmlFor="priority"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className={clsx(
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                )}
                value={editedTask.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Status/Column */}
            <div>
              <label 
                className={clsx(
                  "block text-sm font-medium mb-2", 
                  darkMode ? "text-gray-200" : "text-gray-700"
                )}
                htmlFor="columnId"
              >
                Status / Column
              </label>
              <select
                id="columnId"
                name="columnId"
                className={clsx(
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                )}
                value={editedTask.columnId}
                onChange={handleChange}
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label 
                className={clsx(
                  "block text-sm font-medium mb-2", 
                  darkMode ? "text-gray-200" : "text-gray-700"
                )}
                htmlFor="assignee"
              >
                Assignee
              </label>
              <input
                id="assignee"
                name="assignee"
                type="text"
                placeholder="Name"
                className={clsx(
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                )}
                value={editedTask.assignee?.name ?? ''}
                onChange={handleAssigneeChange}
              />
            </div>

            {/* Due Date */}
            <div>
              <label 
                className={clsx(
                  "block text-sm font-medium mb-2", 
                  darkMode ? "text-gray-200" : "text-gray-700"
                )}
                htmlFor="dueDate"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                className={clsx(
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                )}
                value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                onChange={handleDueDateChange}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label 
              className={clsx(
                "block text-sm font-medium mb-2", 
                darkMode ? "text-gray-200" : "text-gray-700"
              )}
              htmlFor="tags"
            >
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="new-tag"
                type="text"
                placeholder="Add a tag"
                className={clsx(
                  "flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={clsx(
                  'px-4 py-2 rounded-lg font-medium',
                  darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
                  'text-white'
                )}
              >
                Add
              </button>
            </div>
            {/* Display Tags */}
            {editedTask.tags && editedTask.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {editedTask.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={clsx(
                      'px-3 py-1 rounded-full text-sm flex items-center gap-2',
                      darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove ${tag} tag`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {task.id && (
              <button
                type="button"
                onClick={handleDelete}
                className={clsx(
                  "px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500",
                  darkMode 
                    ? "bg-red-600 text-white hover:bg-red-700" 
                    : "bg-red-500 text-white hover:bg-red-600"
                )}
              >
                Delete Task
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className={clsx(
                  "px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-500",
                  darkMode 
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={clsx(
                  "px-6 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600",
                  darkMode 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
