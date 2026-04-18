import { useState } from 'react'
import Home from './Home'
import History from './History'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'history'>('home')

  return currentPage === 'home' ? (
    <Home onOpenHistory={() => setCurrentPage('history')} />
  ) : (
    <History onBack={() => setCurrentPage('home')} />
  )
}

export default App
