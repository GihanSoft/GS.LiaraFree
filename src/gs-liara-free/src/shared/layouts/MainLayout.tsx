import Container from "@mui/material/Container";
import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./Header";

const MainLayout = () => {
  return (
    <>
      <Header />
      {/* <Sidebar /> */}

      <Container sx={{ display: "flex", flexDirection: "column", flex: "auto" }}>
        <Outlet />
      </Container>

      <Footer />
    </>
  );
};

export default MainLayout;
