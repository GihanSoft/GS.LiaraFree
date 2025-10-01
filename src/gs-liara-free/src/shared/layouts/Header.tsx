import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router";

export default function Header() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Button component={NavLink} to="/" color="inherit">
          <Typography component="h1">GS Liara</Typography>
        </Button>
        <Box sx={{ flex: "auto" }} />
        <Button component={NavLink} to="/auth/login">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}
