import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Admin } from './components/Admin'
import { User } from './components/user'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<User />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user" element={<User/>} /> 
        </Routes>
      </BrowserRouter>
    </>
  )
} 

export default App
