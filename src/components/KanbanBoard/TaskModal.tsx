import React, { useState } from 'react'
import type { Column, Task } from './KanbanBoard.types'
import clsx from 'clsx';

interface TaskModalProps {
    task: Task;
    columns: Column[];
    onSave: (task:Task)=>void;
    onDelete: (taskId:string)=>void;
    onClose: ()=>void;
    darkMode?: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({task,columns,onSave,onClose,darkMode=false,onDelete}) => {
    const [editedTask, setEditedTask] = useState<Task>(task);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
        const { name, value } = e.target;
        setEditedTask({ ...editedTask, [name]: value });
    }
    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTask({ ...editedTask, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) });
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedTask);
    };


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
      <div className={clsx(
        'w-full max-w-md mx-auto p-5 rounded-lg shadow-lg',
        darkMode ? 'bg-gray-900 text-white border border-gray-800' : 'bg-white text-gray-900'
      )}>
        <h2 id="modal-title" className="text-xl font-semibold mb-2">{task.id ? 'Edit Task' : 'Create Task'}</h2>
        <div id="modal-description" className="sr-only">Update task details below</div>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <label className={clsx("block text-sm font-medium mb-1", darkMode ? "text-gray-200" : "text-gray-700")}
            htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter a task title"
            autoFocus
            required
            className={clsx(
              "w-full mb-2 px-2 py-1.5 border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-blue-400"
            )}
            value={editedTask.title}
            onChange={handleChange}
          />

          {/* Description */}
          <label className={clsx("block text-sm font-medium mb-1", darkMode ? "text-gray-200" : "text-gray-700")}
            htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder=""
            rows={2}
            className={clsx(
              "w-full mb-4 px-2 py-1.5 border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-blue-400"
            )}
            value={editedTask.description}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {/* Priority */}
            <div>
              <label htmlFor="priority" className={clsx("block text-sm font-medium mb-1", darkMode ? "text-gray-200" : "text-gray-700")}>Priority</label>
              <select
                id="priority"
                name="priority"
                className={clsx(
                  "w-full px-2 py-1.5 border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-400"
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
            {/* Assignee */}
            <div>
              <label htmlFor="assignee" className={clsx("block text-sm font-medium mb-1", darkMode ? "text-gray-200" : "text-gray-700")}>Assignee</label>
              <input
                id="assignee"
                name="assignee"
                type="text"
                placeholder="Name"
                className={clsx(
                  "w-full px-2 py-1.5 border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-400"
                )}
                value={editedTask.assignee?.name ?? ''}
              />
            </div>
            {/* Tags */}
            <div>
              <label htmlFor="tags" className={clsx("block text-sm font-medium mb-1", darkMode ? "text-gray-200" : "text-gray-700")}>Tags</label>
              <input
                id="tags"
                name="tags"
                type="text"
                placeholder="comma,separated"
                className={clsx(
                  "w-full px-2 py-1.5 border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-400"
                )}
                value={editedTask.tags ? editedTask.tags.join(',') : ''}
                onChange={handleTagsChange}
              />
            </div>
            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className={clsx("block text-sm font-medium mb-1", darkMode ? "text-gray-200" : "text-gray-700")}>Due Date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                className={clsx(
                  "w-full px-2 py-1.5 border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-400"
                )}
                value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
              />
            </div>
            {/* Column */}
            <div>
              <label htmlFor="columnId" className={clsx("block text-sm font-medium mb-1", darkMode ? "text-gray-200" : "text-gray-700")}>Column</label>
              <select
                id="columnId"
                name="columnId"
                className={clsx(
                  "w-full px-2 py-1.5 border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-400"
                )}
                value={editedTask.columnId}
                onChange={handleChange}
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-row justify-end mt-5 gap-2">
            <button
              type="button"
              onClick={onClose}
              className={clsx(
                "px-4 py-2 rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={clsx(
                "px-6 py-2 rounded-md font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal