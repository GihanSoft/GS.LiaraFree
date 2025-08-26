import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  return (
    <>
      <Header />
      <Sidebar />

      <div id="page-container">
        <Outlet />
      </div>

      <Footer />
    </>
  );
};

export default MainLayout;
