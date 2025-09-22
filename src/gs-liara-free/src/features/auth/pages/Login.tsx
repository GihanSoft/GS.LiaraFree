import { useNavigate, useSearchParams } from "react-router";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { useAuth } from "../AuthProvider";

const FormChild = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const { pending } = useFormStatus();
  return (
    <>
      <label>
        <span>Email</span>
        <input
          type="email"
          name="email"
          disabled={pending}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        <span>Password</span>
        <input
          type="password"
          name="password"
          disabled={pending}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button type="submit" disabled={pending}>
        {pending ? "Logging in..." : "Log In"}
      </button>
    </>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { login } = useAuth();

  const [error, setError] = useState<string>();

  const handleFormAction = async (data: FormData) => {
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    if (!email || !password) {
      return;
    }

    const response = await login({ email, password });
    if (response.ok) {
      const returnUrl = searchParams.get("returnUrl") ?? "/";
      navigate(returnUrl, { replace: true });
      return;
    }

    if (response.status === 401) {
      if (response.headers.get("CONTENT-TYPE") === "application/problem+json") {
        const body = await response.json();
        if (body.detail != "Failed") {
          setError(body.detail as string);
          return;
        }
      }

      setError("username or password mismatch");
    }
  };

  return (
    <div className="page form-card-container">
      <div className="form-card">
        <form className="vertical-form" action={handleFormAction}>
          {error && <div className="form-error">{error}</div>}
          <FormChild />
        </form>
      </div>
    </div>
  );
};

export default Login;
