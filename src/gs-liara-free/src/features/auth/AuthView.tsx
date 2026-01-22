import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "./AuthProvider";
import type { ReactNode } from "react";

const FullPageSpinner = () => {
  return <FontAwesomeIcon icon={faSpinner} spin />;
};

interface AuthViewProps {
  authenticated: ReactNode;
  anonymous: ReactNode;
}

const AuthView = (props: AuthViewProps) => {
  const { user, isPending } = useAuth();

  if (isPending) {
    return <FullPageSpinner />;
  }

  return user ? props.authenticated : props.anonymous;
};

export default AuthView;
