import { useState } from 'react';

export function useKanbanBoard() {
  const [columns, setColumns] = useState([]);
  return { columns, setColumns };
}
