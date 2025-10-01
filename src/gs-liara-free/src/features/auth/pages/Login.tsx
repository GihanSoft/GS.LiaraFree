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
import { NavLink, useNavigate, useSearchParams } from "react-router";
import PasswordField from "../../../shared/components/PasswordField";
import { useAuth } from "../AuthProvider";
import { FORM_FIELDS, handleAction, initialState } from "./Login.actions";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { revalidate } = useAuth();
  const formErrorId = useId();

  const [state, formAction, isPending] = useActionState(
    handleAction,
    initialState
  );

  useEffect(() => {
    const handleSuccess = async () => {
      if (state.succeed) {
        await revalidate();

        const returnUrl = searchParams.get("returnUrl") ?? "/";
        navigate(returnUrl, { replace: true });
      }
    };

    handleSuccess();
  }, [state.succeed, navigate, searchParams, revalidate]);

  const showRegistrationSuccess =
    searchParams.get("status") === "registration-success";

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
          Login
        </Typography>

        {showRegistrationSuccess && (
          <Typography>Registration successful! Please log in.</Typography>
        )}

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

        <Stack
          component="form"
          action={formAction}
          sx={(theme) => ({
            gap: theme.spacing(2),
          })}
        >
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
            label="password"
            size="small"
            autoComplete="current-password"
            required
            disabled={isPending}
            error={state.errors.formErrors.length > 0}
            aria-describedby={formErrorId}
          />

          <Button
            type="submit"
            variant="contained"
            loading={isPending}
            loadingIndicator="Logging in..."
          >
            Login
          </Button>
        </Stack>
        
        <Divider>or</Divider>

        <Typography sx={{ textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link
            component={NavLink}
            to="/auth/register"
            variant="body2"
            sx={{ alignSelf: "center" }}
          >
            Register
          </Link>
        </Typography>
      </Card>
    </Stack>
  );
};

export default Login;
