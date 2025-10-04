import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useActionState, useEffect, useId } from "react";
import { NavLink, useNavigate, useSearchParams, type To } from "react-router";
import PasswordField from "../../../shared/components/PasswordField";
import { FORM_FIELDS, handleAction, initialState } from "./Register.actions";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formErrorId = useId();

  const [state, formAction, isPending] = useActionState(
    handleAction,
    initialState
  );

  useEffect(() => {
    if (state.succeed) {
      const returnUrl = searchParams.get("returnUrl");
      const search = new URLSearchParams(
        returnUrl
          ? { status: "registration-success", returnUrl: returnUrl }
          : { status: "registration-success" }
      );

      const loginUrl: To = {
        pathname: "/auth/login",
        search: search.toString(),
      };
      navigate(loginUrl);
    }
  }, [state.succeed, navigate, searchParams]);

  return (
    <Stack
      sx={(theme) => ({
        flex: "auto",
        padding: theme.spacing(2),
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <Card
        variant="outlined"
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(3),
          padding: theme.spacing(4),
          width: "100%",
          [theme.breakpoints.up("sm")]: {
            maxWidth: "450px",
          },
          boxShadow:
            "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
        })}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Register
        </Typography>
        
        {state.errors.formErrors.length > 0 && (
          <List id={formErrorId} role="alert" dense>
            {state.errors.formErrors.map((error, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={error}
                  sx={(theme) => ({ color: theme.palette.error.main })}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Stack component="form" gap={2} action={formAction}>
          <TextField
            type="email"
            name={FORM_FIELDS.EMAIL}
            autoComplete="email"
            required
            defaultValue={state.email}
            label="email"
            size="small"
            disabled={isPending}
            error={state.errors.formErrors.length > 0}
            aria-describedby={formErrorId}
          />
          <PasswordField
            name={FORM_FIELDS.PASSWORD}
            autoComplete="new-password"
            required
            label="password"
            size="small"
            disabled={isPending}
            error={state.errors.formErrors.length > 0}
            aria-describedby={formErrorId}
          />

          <Button
            type="submit"
            variant="contained"
            loading={isPending}
            loadingIndicator="Registering..."
          >
            Register
          </Button>
        </Stack>

        <Divider>or</Divider>

        <Typography sx={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            component={NavLink}
            to="/auth/register"
            variant="body2"
            sx={{ alignSelf: "center" }}
          >
            Login
          </Link>
        </Typography>
      </Card>
    </Stack>
  );
};

export default Register;
