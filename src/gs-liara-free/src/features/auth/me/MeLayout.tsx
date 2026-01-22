import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink, Outlet } from "react-router";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faBars } from "@fortawesome/free-solid-svg-icons";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import { useState, type MouseEventHandler } from "react";
import AuthNavbarWidget from "../../../shared/layouts/AuthNavbarWidget";
import Stack from "@mui/material/Stack";

const drawerWidth = 240;

const DrawerContent = () => {
  return (
    <List sx={{ width: drawerWidth }}>
      <Toolbar />
      <ListItem disablePadding>
        <ListItemButton component={NavLink} to="/me">
          Profile
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemText>Security</ListItemText>
        <FontAwesomeIcon icon={faAngleDown} />
      </ListItem>
      <List disablePadding sx={{ "& > li > *": { pl: 4 } }}>
        <ListItem disablePadding>
          <ListItemButton component={NavLink} to="/me/security/password">
            Password
          </ListItemButton>
        </ListItem>
      </List>
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

      <AuthNavbarWidget />
    </Toolbar>
  );
};

const MeLayout = () => {
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
        onClick={() => setOpen(false)}
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

export default MeLayout;
