import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isWaiting, setIsWaiting] = useState(false);

  const handleFormAction = async (data: FormData) => {
    /*
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    if (!email || !password) {
      return;
    }

    setIsWaiting(true);
    try {
      await login(email, password);
      const destination = searchParams.get("returnUrl") ?? "/";
      navigate(destination, { replace: true });
    } catch {
      setIsWaiting(false);
    }
    */
  };

  return (
    <div className="page form-card-container">
      <div className="form-card">
        <form className="vertical-form" action={handleFormAction}>
          <label>
            <span>Email</span>
            <input type="email" name="email" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" name="password" />
          </label>

          <button type="submit" disabled={isWaiting}>
            {isWaiting ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
