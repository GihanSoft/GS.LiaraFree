import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router";
import { useAuth } from "../../features/auth/AuthProvider";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Button component={NavLink} to="/" color="inherit">
          <Typography component="h1">GS Liara</Typography>
        </Button>
        <Box sx={{ flex: "auto" }} />
        {user ? (
          <Button onClick={() => logout()}>Logout</Button>
        ) : (
          <Button component={NavLink} to="/auth/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
