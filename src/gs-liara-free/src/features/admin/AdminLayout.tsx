import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState, type MouseEventHandler } from "react";
import { NavLink, Outlet } from "react-router";
import TrimmedTextBox from "../../shared/components/TrimmedTextBox";
import AuthAction from "../../shared/layouts/AuthNavbarWidget";

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

      <AuthAction />
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
