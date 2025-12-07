import { Route, Routes as ReactRoutes } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import MainLayout from "./shared/layouts/MainLayout";
import Home from "./shared/pages/Home";
import AdminDashboardPage from "./features/admin/dashboard/AdminDashboardPage";
import ProtectedLayout from "./features/auth/ProtectedLayout";

function Routes() {
  return (
    <ReactRoutes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/register" element={<Register />} />

        <Route path="admin" element={<ProtectedLayout />}>
          <Route index element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </ReactRoutes>
  );
}

export default Routes;
