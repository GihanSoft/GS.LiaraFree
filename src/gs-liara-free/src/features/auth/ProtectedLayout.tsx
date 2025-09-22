import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthProvider";

const AuthRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate
        to={{
          pathname: "/auth/login",
          search: "returnUrl=" + document.location.href,
        }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default AuthRoute;
