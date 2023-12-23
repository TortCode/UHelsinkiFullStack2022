import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { Link, Routes, Route, Navigate } from 'react-router-dom'

const App = () => {

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem'}}>
        <Link to="/authors">authors</Link>
        <Link to="/books">books</Link>
        <Link to="/books/add">add book</Link>
      </div>

      <Routes>
        <Route path="/" element={<Navigate replace to="/authors" />}/>
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/add" element={<NewBook />} />
      </Routes>
    </div>
  )
}

export default App
