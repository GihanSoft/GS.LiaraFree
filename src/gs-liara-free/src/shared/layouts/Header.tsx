import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router";
import AuthAction from "./AuthNavbarWidget";

interface HeaderProps {
  /**
   * The positioning type. The behavior of the different options is described
   * [in the MDN web docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position).
   * Note: `sticky` is not universally supported and will fall back to `static` when unavailable.
   * @default 'fixed'
   */
  position?: "fixed" | "absolute" | "sticky" | "static" | "relative";
}

export default function Header(props: HeaderProps) {
  return (
    <AppBar {...props}>
      <Toolbar>
        <Button component={NavLink} to="/" color="inherit">
          <Typography component="h1">GS Liara</Typography>
        </Button>
        <Box sx={{ flex: "auto" }} />
        <AuthAction />
      </Toolbar>
    </AppBar>
  );
}
