import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import {
  startTransition,
  useActionState,
  type ReactNode,
} from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useNavigate } from "react-router";
import { claimAdminRole } from "./AdminSetupPage.actions";
import { isFailure } from "../../../shared/result";

const Decorator = (children: ReactNode) => {
  return (
    <Stack flex="auto" alignItems="center" justifyContent="center">
      {children}
    </Stack>
  );
};

const AdminSetupPage = () => {
  const nav = useNavigate();

  const [claimAdminRoleResult, claimAdminRoleAction, claimAdminRolePending] =
    useActionState(claimAdminRole, undefined);


  const error = claimAdminRoleResult && isFailure(claimAdminRoleResult)
    ? claimAdminRoleResult.error.title
    : undefined;

  if (error) {
    return Decorator(
      <Alert severity="error" variant="outlined">
        {error}
      </Alert>
    );
  }

  if (claimAdminRoleResult) {
    return (
      <Dialog open>
        <DialogTitle color="success">Succeed</DialogTitle>
        <DialogContent>You are admin now</DialogContent>
        <DialogActions>
          <Stack>
            <Button
              variant="contained"
              color="primary"
              onClick={() => nav("/admin")}
            >
              OK
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    );
  }

  return Decorator(
    <Button
      variant="contained"
      color="warning"
      size="large"
      onClick={() => startTransition(() => claimAdminRoleAction())}
      disabled={claimAdminRolePending}
    >
      {claimAdminRolePending ? "Processing..." : "Claim Ownership"}
    </Button>
  );
};

export default AdminSetupPage;
