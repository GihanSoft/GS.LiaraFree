import Button from "@mui/material/Button";
import PasswordField from "../../../shared/components/PasswordField";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useActionState, useId } from "react";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {
  FORM_FIELDS,
  handleAction,
  initialState,
} from "./PasswordPage.actions";

const PasswordPage = () => {
  const formErrorId = useId();

  const [state, formAction, isPending] = useActionState(
    handleAction,
    initialState
  );

  return (
    <Box flex="auto" display="flex" justifyContent="center" alignItems="center">
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
          component="h2"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Password
        </Typography>

        {state.succeed && (
          <Alert severity="success">Password updated successfully.</Alert>
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

        <Stack component="form" action={formAction} gap={2}>
          <PasswordField
            name={FORM_FIELDS.OLD_PASSWORD}
            label="old password"
            autoComplete="current-password"
            required
            disabled={isPending}
            error={state.errors.formErrors.length > 0}
            aria-describedby={formErrorId}
          />
          <PasswordField
            name={FORM_FIELDS.NEW_PASSWORD}
            label="new password"
            autoComplete="new-password"
            required
            disabled={isPending}
            error={state.errors.formErrors.length > 0}
            aria-describedby={formErrorId}
          />
          <Button
            type="submit"
            variant="contained"
            loading={isPending}
            loadingIndicator="please wait..."
          >
            <span className="text-box-trim">Update Password</span>
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default PasswordPage;
