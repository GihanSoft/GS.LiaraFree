import { useNavigate, useSearchParams } from "react-router";
import { useFormStatus } from "react-dom";
import { useState } from "react";

const FormChild = () => {
  const { pending } = useFormStatus();
  return (
    <>
      <label>
        <span>Email</span>
        <input type="email" name="email" disabled={pending} />
      </label>
      <label>
        <span>Password</span>
        <input type="password" name="password" disabled={pending} />
      </label>

      <button type="submit" disabled={pending}>
        {pending ? "Registering..." : "Register"}
      </button>
    </>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [errors, setErrors] = useState<string[]>([]);

  const handleFormAction = async (data: FormData) => {
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    if (!email || !password) {
      return;
    }

    const response = await fetch("/api/security/register", {
      method: "POST",
      headers: {
        "CONTENT-TYPE": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const returnUrl = searchParams.get("returnUrl") ?? "/";
      navigate(
        { pathname: "./login", search: "returnUrl=" + returnUrl },
        { relative: "path" }
      );
      return;
    }

    if (response.headers.get("CONTENT-TYPE") === "application/problem+json") {
      const body = await response.json();
      if (body.errors) {
        setErrors(Object.values(body.errors).flatMap((a) => a as string));
        return;
      }

      setErrors([body.detail ?? body.title]);
    }

    setErrors(["something went wrong..."]);
  };

  return (
    <div className="page form-card-container">
      <div className="form-card">
        <form className="vertical-form" action={handleFormAction}>
          {errors.length > 0 && (
            <ul className="form-error">
              {errors.map((a) => (
                <li>{a}</li>
              ))}
            </ul>
          )}
          <FormChild />
        </form>
      </div>
    </div>
  );
};

export default Login;
