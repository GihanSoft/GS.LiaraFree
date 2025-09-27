import { useNavigate, useSearchParams, type To } from "react-router";
import { useActionState, useEffect, useId } from "react";
import { FORM_FIELDS, handleAction, initialState } from "./Register.actions";
import InputPassword from "../../../shared/components/InputPassword";

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
        pathname: "/login",
        search: search.toString(),
      };
      navigate(loginUrl);
    }
  }, [state.succeed, navigate, searchParams]);

  return (
    <div className="page form-card-container">
      <div className="form-card">
        <form className="vertical-form" action={formAction}>
          <h2>Create an Account</h2>

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
              autoComplete="new-password"
              required
              disabled={isPending}
              aria-describedby={formErrorId}
            />
          </label>

          <button type="submit" disabled={isPending}>
            {isPending ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
