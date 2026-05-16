import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLogin, useRegister, useLogout, useGetMe } from "@workspace/api-client-react";
import type { User, LoginInput, RegisterInput } from "@workspace/api-client-react/api.schemas";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const { data: meData, isLoading: meLoading, isError: meError } = useGetMe({
    query: {
      enabled: !!token,
    }
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("wander_token");
    const storedUser = localStorage.getItem("wander_user");
    
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          // invalid json
        }
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      if (meData) {
        setUser(meData);
        localStorage.setItem("wander_user", JSON.stringify(meData));
        setIsLoading(false);
      } else if (meError) {
        // Token might be invalid
        handleLogout();
      } else if (!meLoading) {
        setIsLoading(false);
      }
    }
  }, [meData, meError, meLoading, token]);

  const handleLogin = async (data: LoginInput) => {
    try {
      const res = await loginMutation.mutateAsync({ data });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("wander_token", res.token);
      localStorage.setItem("wander_user", JSON.stringify(res.user));
      toast({ title: "Welcome back to WanderIndia!" });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
      throw err;
    }
  };

  const handleRegister = async (data: RegisterInput) => {
    try {
      const res = await registerMutation.mutateAsync({ data });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("wander_token", res.token);
      localStorage.setItem("wander_user", JSON.stringify(res.user));
      toast({ title: "Welcome to WanderIndia!" });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutMutation.mutateAsync();
      }
    } catch (err) {
      // ignore
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("wander_token");
      localStorage.removeItem("wander_user");
      setLocation("/");
      toast({ title: "Logged out successfully" });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
