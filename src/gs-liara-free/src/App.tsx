import { Route, Routes } from "react-router";
import Login from "./features/security/pages/Login";
import Register from "./features/security/pages/Register";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="security/login" element={<Login />} />
        <Route path="security/register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
