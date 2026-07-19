import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"

// Auth
import Login from './pages/common/Login'
import Register from './pages/car_owner/Register'
import ForgotPassword from './pages/common/ForgotPassword'
import ThemeButton from './theme'

// Car Owner
import CarOwnerHome from './pages/car_owner/carOwnerHome'

// Admin
import AdminHome from './pages/admin/AdminHome'
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Car Owner Routes */}
        <Route path="/carownerhome" element={<CarOwnerHome />} />

        {/* Admin Routes */}
        <Route path="/adminhome" element={<AdminHome />} />
      </Routes>
      <Toaster richColors position="top-right" />
      <ThemeButton />
    </>
  )
}

export default App;
