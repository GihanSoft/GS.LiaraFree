import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api, { onUnauthorized } from "../../shared/api";

const API_ENDPOINTS = {
  LOGOUT: "/api/auth/logout",
  MANAGE_INFO: "/api/auth/manage/info",
};

interface User {
  email: string;
}

interface AuthContextType {
  user?: User;
  isPending: boolean;
  revalidate: () => Promise<void>;
  logout: () => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [isPending, setIsPending] = useState(true);

  const revalidate = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MANAGE_INFO);
      if (response.status === 401) {
        setUser(undefined);
        return;
      }

      if (!response.ok) {
        console.error("Failed to fetch user info:", response);
        setUser(undefined);
        return;
      }

      const user = (await response.json()) as User;
      setUser(user);
    } catch (error) {
      console.error("Network error fetching user info:", error);
      setUser(undefined);
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    revalidate();
  }, [revalidate]);

  useEffect(() => {
    const handleUnauthorized = () => {
      console.log("Global unauthorized event caught. Revalidating auth state.");
      revalidate();
    };

    const unSubscribe = onUnauthorized(handleUnauthorized);
    return () => {
      unSubscribe();
    };
  }, [revalidate]);

  const logout = async () => {
    const response = await api(API_ENDPOINTS.LOGOUT, { method: "POST" });
    if (response.status !== 401) {
      await revalidate();
    }

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isPending,
        revalidate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
