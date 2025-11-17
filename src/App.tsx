import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Book from './pages/Book'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book" element={<Book />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
