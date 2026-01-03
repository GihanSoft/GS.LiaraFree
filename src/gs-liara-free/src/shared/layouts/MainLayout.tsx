import Container from "@mui/material/Container";
import { Outlet } from "react-router";
import Header from "./Header";

const MainLayout = () => {
  return (
    // parent is a 100dvh flex with columns direction
    <>
      <Header position="static" />

      <Container sx={{ display: "flex", flexDirection: "column", flex: "auto" }}>
        <Outlet />
      </Container>

      <footer></footer>
    </>
  );
};

export default MainLayout;
