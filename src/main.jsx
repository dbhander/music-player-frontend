import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import './index.css'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard/Dashboard'
import PrivateRoute from './components/PrivateRoute'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router basename="/music-player-frontend">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  </StrictMode>,
)
