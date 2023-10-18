import { useEffect, useState, ReactNode } from "react";
import { FullPageLoader } from "../../components/loaders/Loaders";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ProtectionProps {
  children: ReactNode;
}

export function NonLoggedInPage({ children: Component }: ProtectionProps) {
  // If auth, send to /auth
  // If not auth, render

  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/auth/is-auth`,
          { withCredentials: true }
        );

        const result = res.data;

        if (result.isAuth) {
          navigate("/auth");
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        setIsAuth(false);
      }
    };

    checkAuthState();
  }, [navigate]);

  if (isAuth === null) {
    return <FullPageLoader text={"Authenticating"} />;
  }

  if (isAuth === false) {
    return <>{Component}</>;
  }
}

export function LoggedInPageProtection({
  children: Component,
}: ProtectionProps) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/auth/is-auth`,
          { withCredentials: true }
        );

        const result = res.data;

        if (!result.isAuth) {
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setIsAuth(true);
        }
      } catch (error) {
        navigate("/login");
      }
    };

    checkAuthState();
  }, [navigate]);

  if (isAuth === null) {
    return <FullPageLoader text={"Authenticating"} />;
  }

  if (isAuth === true) {
    return <>{Component}</>;
  }
}

export function RoleBasedRouteProtection({
  children: Component,
}: ProtectionProps) {
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getRole = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/accounts/role`,
          { withCredentials: true }
        );

        const result = res.data;

        if (
          !result.success ||
          !["Admin", "Program Manager", "Coordinator"].includes(result.role)
        ) {
          navigate("/auth");
        } else {
          setRole(result.role);
        }
      } catch (error) {
        navigate("/login");
      }
    };

    getRole();
  }, [navigate]);

  if (role === null) {
    return <FullPageLoader text={"Authenticating..."} />;
  }

  return <>{Component}</>;
}
