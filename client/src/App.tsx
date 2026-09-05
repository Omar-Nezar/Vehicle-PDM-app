import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/sonner"
import showToast from './pages/common/Toast';
import RequireAuth from "./routes/RequireAuth";
import RequireRole from "./routes/RequireRole";
import RequireGuest from './routes/RequireGuest';

// Auth
import Login from './pages/common/Login'
import Register from './pages/car_owner/Register'
import ForgotPassword from './pages/common/ForgotPassword'
import ResetPassword from './pages/common/ResetPassword'
import VerifyRegistration from './pages/car_owner/VerifyRegistration';

// Car Owner
import CarOwnerHome from './pages/car_owner/carOwnerHome'
import ManageCars from './pages/car_owner/ManageCars'

// Admin
import AdminHome from './pages/admin/AdminHome'
import ManageUsers from './pages/admin/ManageUsers'
import AuditLogs from './pages/admin/AuditLogs'
import AdminMisc from './pages/admin/AdminMisc'
import ViewCars from './pages/admin/ViewCars'
import InventoryHome from './pages/inventory_manager/inventoryHome'

// Aux
import Layout from './pages/common/Layout';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const state = location.state as any;

    if (state?.msg) {
      showToast({
        message: state.msg,
        description: state.description,
      });

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);
  return (
    <>
      <Routes>
        <Route element={<RequireGuest />}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verifyregistration/:token" element={<VerifyRegistration />} />
        </Route>

        <Route element={<RequireAuth />}>

          {/* Car Owner Routes */}
          <Route element={<RequireRole role="car_owner" />}>
            <Route element={<Layout dark={dark} setDark={setDark} />}>
              <Route path="/carownerhome" element={<CarOwnerHome />} />
              <Route path="/managecars" element={<ManageCars />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<RequireRole role="admin" />}>
            <Route element={<Layout dark={dark} setDark={setDark} />}>
              <Route path="/adminhome" element={<AdminHome />} />
              <Route path="/manageUsers" element={<ManageUsers />} />
              <Route path="/auditlogs" element={<AuditLogs />} />
              <Route path="/history" element={<AdminMisc />} />
              <Route path="/viewcars" element={<ViewCars />} />
            </Route>
          </Route>

          {/* Inventory Manager Routes */}
          <Route element={<RequireRole role="inventory_manager" />}>
            <Route element={<Layout dark={dark} setDark={setDark} />}>
              <Route path="/inventorymanagerhome" element={<InventoryHome />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App;
