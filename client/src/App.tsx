import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react';
import { Toaster } from "@/components/ui/sonner"
import showToast from './pages/common/Toast';
import RequireAuth from "./routes/RequireAuth";
import RequireRole from "./routes/RequireRole";
import RequireGuest from './routes/RequireGuest';

// Auth
import Login from './pages/common/Login'
import Register from './pages/car_owner/Register'
import ForgotPassword from './pages/common/ForgotPassword'
import ThemeButton from './pages/common/ThemeButton'

// Car Owner
import CarOwnerHome from './pages/car_owner/carOwnerHome'
import ManageCars from './pages/car_owner/ManageCars'

// Admin
import AdminHome from './pages/admin/AdminHome'
import ManageUsers from './pages/admin/ManageUsers'

function App() {
  const location = useLocation();
  const hasShown = useRef(false);

  useEffect(() => {
    const state = location.state as any;

    if (state?.msg && !hasShown.current) {
      hasShown.current = true;

      showToast({
        message: state.msg,
        description: state.description,
      });

      // Clear state so it doesn't repeat
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  return (
    <>
      <Routes>
        <Route element={<RequireGuest />}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<RequireAuth />}>
          {/* Car Owner Routes */}
          <Route element={<RequireRole role="car_owner" />}>
            <Route path="/carownerhome" element={<CarOwnerHome />} />
            <Route path="/managecars" element={<ManageCars />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<RequireRole role="admin" />}>
            <Route path="/adminhome" element={<AdminHome />} />
            <Route path="/manageUsers" element={<ManageUsers />} />
          </Route>
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
      <ThemeButton />
    </>
  )
}

export default App;
