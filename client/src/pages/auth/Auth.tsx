import { useEffect } from "react";
import { FullPageLoader } from "../../components/loaders/Loaders";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getRole = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/accounts/role`,
          { withCredentials: true }
        );

        const result = res.data;

        if (!result.success) {
          return navigate("/login");
        }
        if (
          result.role === "Admin" ||
          result.role === "Program Manager" ||
          result.role === "Coordinator"
        ) {
          setTimeout(() => navigate("/"), 1000);
        }
      } catch (error) {
        return navigate("/login");
      }
    };

    getRole();
  }, [navigate]);
  return <FullPageLoader text={"Authenticating"} />;
};

export default Auth;
