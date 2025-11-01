import { useState } from 'react'
import KanbanBoard from './components/KanbanBoard/KanbanBoard'
import { sampleColumns } from './utils/column.utils'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  return (
    <>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Kanban Board 
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 text-black hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        
        <div className="h-[calc(100vh-120px)] bg-white rounded-xl shadow-lg overflow-hidden">
          <KanbanBoard initialColumns={sampleColumns} darkMode={darkMode} />
        </div>
      </div>
    </div>
    </>
  )
}

export default App
