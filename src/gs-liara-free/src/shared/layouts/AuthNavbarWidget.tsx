import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu, { type MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { useState, type MouseEvent } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../../features/auth/AuthProvider";
import AuthView from "../../features/auth/AuthView";
import TrimmedTextBox from "../components/TrimmedTextBox";
import type { SxProps, Theme } from "@mui/material/styles";

const MENU_PAPER_STYLES: SxProps<Theme> = (theme) => ({
  minWidth: 200,
  overflow: "visible",
  filter:
    theme.palette.mode == "light"
      ? "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))"
      : "drop-shadow(0px 2px 8px rgba(255,255,255,0.32))",
  mt: 1.5,
  "& .MuiAvatar-root": {
    width: 32,
    height: 32,
    ml: -0.5,
    mr: 1,
  },
  // CSS trick for the "speech bubble" arrow
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    top: 0,
    right: 14,
    width: 10,
    height: 10,
    bgcolor: "background.paper",
    transform: "translateY(-50%) rotate(45deg)",
    zIndex: 0,
  },
});

interface MenuProp {
  open: MenuProps["open"];
  onClose?: MenuProps["onClose"];
  onClick?: MenuProps["onClick"];
  anchorEl?: MenuProps["anchorEl"];
}

function ComponentMenu(props: MenuProp) {
  const { logout } = useAuth();

  return (
    <Menu
      id="account-menu"
      {...props}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(3px)",
          },
        },
        paper: {
          elevation: 0,
          sx: MENU_PAPER_STYLES,
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {/* <MenuItem component={NavLink} to="/me">
              <Avatar>
                <TrimmedTextBox>
                  {user?.email.at(0)?.toUpperCase()}
                </TrimmedTextBox>
              </Avatar>
              <span>Profile</span>
            </MenuItem> */}
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <FontAwesomeIcon icon={faSignOut} size="sm" />
        </ListItemIcon>
        <span>Logout</span>
      </MenuItem>
    </Menu>
  );
}

export default function AuthNavbarWidget() {
  const { user } = useAuth();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const handleClick = (ev: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(ev.currentTarget);
  const handleClose = () => setAnchorEl(undefined);
  const isOpen = Boolean(anchorEl);

  return (
    <AuthView
      authenticated={
        <>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={isOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isOpen ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <TrimmedTextBox>
                  {user?.email.at(0)?.toUpperCase() || "?"}
                </TrimmedTextBox>
              </Avatar>
            </IconButton>
          </Tooltip>

          <ComponentMenu
            open={isOpen}
            anchorEl={anchorEl}
            onClick={handleClose}
            onClose={handleClose}
          />
        </>
      }
      anonymous={
        <Button component={NavLink} to="/auth/login">
          <TrimmedTextBox>login</TrimmedTextBox>
        </Button>
      }
    />
  );
}
