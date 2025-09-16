import { useState } from "react";
import { useNavigate } from "react-router";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [isWaiting, setIsWaiting] = useState(false);

  const handleFormAction = async (data: FormData) => {
    /*
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    if (!email || !password) {
      return;
    }

    try {
      await register(email, password);
      navigate("./login", { relative: "path" });
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
            <input type="email" name="email" required />
          </label>
          <label>
            <span>Password</span>
            <input type="password" name="password" required />
          </label>

          <button type="submit" disabled={isWaiting}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
