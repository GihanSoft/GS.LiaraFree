import { Route, Routes as ReactRoutes } from "react-router";
import Login from "./features/auth/login/Login";
import Register from "./features/auth/register/Register";
import MainLayout from "./shared/layouts/MainLayout";
import Home from "./shared/pages/Home";
import AdminDashboardPage from "./features/admin/dashboard/AdminDashboardPage";
import RequireAuth from "./features/auth/RequireAuth";
import MeLayout from "./features/auth/me/MeLayout";
import MePage from "./features/auth/me/MePage";
import PasswordPage from "./features/auth/me/PasswordPage";
import AdminLayout from "./features/admin/AdminLayout";
import NotFoundPage from "./shared/pages/NotFoundPage";

function Routes() {
  return (
    <ReactRoutes>
      <Route path="auth/login" element={<Login />} />
      <Route path="auth/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="me" element={<MeLayout />}>
          <Route index element={<MePage />} />
          <Route path="security/password" element={<PasswordPage />} />
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </ReactRoutes>
  );
}

export default Routes;
