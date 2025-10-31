import React, { useState } from 'react'
import type { Column } from './KanbanBoard.types';
import { format } from 'date-fns';


interface KanbanBoardProps {
  initialColumns: Column[];
  darkMode?: boolean;
}

const KanbanBoard : React.FC<KanbanBoardProps> = ({initialColumns,darkMode=false}) => {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold">Kanban Board</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {format(new Date(), 'MMMM d, yyyy')}
        </div>
      </div>
      </div>  
      )
}

export default KanbanBoard