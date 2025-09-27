import { useNavigate, useSearchParams } from "react-router";
import { useActionState, useEffect, useId } from "react";
import { FORM_FIELDS, handleAction, initialState } from "./Login.actions";
import { useAuth } from "../AuthProvider";
import InputPassword from "../../../shared/components/InputPassword";

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
    <div className="page form-card-container">
      <div className="form-card">
        <form className="vertical-form" action={formAction}>
          <h2>Log In</h2>

          {/* --- Success message from registration --- */}
          {showRegistrationSuccess && (
            <div className="form-success">
              Registration successful! Please log in.
            </div>
          )}

          {/* --- Consistent and Accessible Error Display --- */}
          {state.errors.formErrors.length > 0 && (
            <div id={formErrorId} role="alert" className="form-error">
              <ul>
                {state.errors.formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <label>
            <span>Email</span>
            <input
              type="email"
              name={FORM_FIELDS.EMAIL}
              autoComplete="email"
              required
              defaultValue={state.email}
              disabled={isPending}
              aria-describedby={formErrorId}
            />
          </label>
          <label>
            <span>Password</span>
            <InputPassword
              name={FORM_FIELDS.PASSWORD}
              autoComplete="current-password"
              required
              disabled={isPending}
              aria-describedby={formErrorId}
            />
          </label>

          <button type="submit" disabled={isPending}>
            {isPending ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
