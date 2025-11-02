import { useState } from 'react'
import '../src/styles/globals.css'
import KanbanBoard from './components/KanbanBoard/KanbanBoard'
import { sampleColumns } from './utils/column.utils'

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto p-4">
        <div className="h-[calc(100vh-40px)] bg-white rounded-xl shadow-lg overflow-hidden">
          <KanbanBoard 
            initialColumns={sampleColumns} 
            darkMode={darkMode} 
            onToggleDarkMode={() => setDarkMode(!darkMode)}
          />
        </div>
      </div>
    </div>
  )
}

export default App
