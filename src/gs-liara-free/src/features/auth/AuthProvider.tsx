import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface User {
  email: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthContextType {
  user?: User;
  login: (input: LoginInput) => Promise<Response>;
  logout: () => Promise<Response>;
  authFetch: (
    url: string | URL | globalThis.Request,
    init?: RequestInit
  ) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  login: async () => {
    throw "not implemented";
  },
  logout: async () => {
    throw "not implemented";
  },
  authFetch: async () => {
    throw "not implemented";
  },
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    fetch("/api/auth/manage/info")
      .then((resp) => {
        if (resp.ok) {
          return resp.json().then((a) => a as User);
        } else if (resp.status === 401) {
          return undefined;
        } else {
          throw resp;
        }
      })
      .then((user) => setUser(user))
      .catch((err) => console.log(err));
  }, []);

  const [user, setUser] = useState<User>();

  const login = async (input: LoginInput) => {
    const response = await fetch("/api/auth/login?useCookies=true", {
      method: "POST",
      headers: {
        "CONTENT-TYPE": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (response.ok) {
      setUser({ email: input.email });
    }

    return response;
  };

  const logout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });

    if (response.ok) {
      setUser(undefined);
    }

    return response;
  };

  const authFetch = async (
    url: string | URL | globalThis.Request,
    init?: RequestInit
  ) => {
    const response = await fetch(url, init);

    if (response.status === 401) {
      setUser(undefined);
    }

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
