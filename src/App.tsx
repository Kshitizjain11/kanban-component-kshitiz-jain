import { useState } from 'react'
import '../src/styles/globals.css'
import KanbanBoard from './components/KanbanBoard/KanbanBoard'
import { sampleColumns } from './utils/column.utils'

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-end items-center mb-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-white hover:bg-gray-50 border border-gray-300'
            }`}
          >
            {darkMode ? ' Light Mode' : ' Dark Mode'}
          </button>
        </div>
        
        <div className="h-[calc(100vh-60px)] bg-white rounded-xl shadow-lg overflow-hidden">
          <KanbanBoard initialColumns={sampleColumns} darkMode={darkMode} />
        </div>
      </div>
    </div>
  )
}

export default App
