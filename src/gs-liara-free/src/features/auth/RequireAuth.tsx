import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navigate, Outlet, useLocation, type To } from "react-router";
import { useAuth } from "./AuthProvider";

const FullPageSpinner = () => {
  return (
    <div
      className="full-page-spinner-overlay"
      role="status"
      aria-live="assertive"
    >
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const RequireAuth = () => {
  const { user, isPending } = useAuth();
  const location = useLocation();

  if (isPending) {
    return <FullPageSpinner />;
  }

  if (!user) {
    const returnUrl = location.pathname + location.search + location.hash;

    const searchParams = new URLSearchParams({ returnUrl });
    const loginPath: To = {
      pathname: "/auth/login",
      search: searchParams.toString(),
    };

    return <Navigate to={loginPath} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
