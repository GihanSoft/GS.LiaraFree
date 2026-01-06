import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink, Outlet } from "react-router";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import { useState, type MouseEventHandler } from "react";
import { useAuth } from "../auth/AuthProvider";
import TrimmedTextBox from "../../shared/components/TrimmedTextBox";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import AuthView from "../auth/AuthView";

const drawerWidth = 240;

const DrawerContent = () => {
  return (
    <List sx={{ width: drawerWidth }}>
      <Toolbar />
      <ListItem disablePadding>
        <ListItemButton component={NavLink} to="/admin">
          <TrimmedTextBox>Dashboard</TrimmedTextBox>
        </ListItemButton>
      </ListItem>
    </List>
  );
};

interface HeaderProps {
  onBarsMenuClick?: MouseEventHandler<HTMLButtonElement>;
}

const Header = (props: HeaderProps) => {
  const { logout } = useAuth();
  return (
    <Toolbar>
      <IconButton
        onClick={props.onBarsMenuClick}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        <FontAwesomeIcon icon={faBars} />
      </IconButton>

      <Box sx={{ flex: "auto", display: "flex", justifyContent: "center" }}>
        <Button component={NavLink} to="/" color="inherit">
          <Typography component="h1">GS Liara</Typography>
        </Button>
      </Box>

      <AuthView
        authenticated={
          <Button onClick={() => logout()}>
            <TrimmedTextBox>Logout</TrimmedTextBox>
          </Button>
        }
        anonymous={
          <Button component={NavLink} to="/auth/login">
            Login
          </Button>
        }
      />
    </Toolbar>
  );
};

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar
        position="static"
        sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
      >
        <Header onBarsMenuClick={() => setOpen((pre) => !pre)} />
      </AppBar>

      <Stack flex="auto" direction="row">
        <Drawer
          variant="permanent"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            display: { xs: "none", md: "block", width: drawerWidth },
          }}
        >
          <DrawerContent />
        </Drawer>
        <Container
          sx={{ display: "flex", flexDirection: "column", flex: "auto" }}
        >
          <Outlet />
        </Container>
      </Stack>

      <Drawer
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
        }}
        slotProps={{
          root: {
            keepMounted: true,
          },
        }}
      >
        <DrawerContent />
      </Drawer>

      <footer></footer>
    </>
  );
};

export default AdminLayout;
