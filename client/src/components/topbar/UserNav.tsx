import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FaCog } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export function UserNav() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_PUBLIC_API_URL}/auth/logout`,
        { withCredentials: true }
      );
      if (response.data.success) {
        // Handle successful logout here, e.g., redirect to login page
        navigate("/login");
      }
    } catch (error) {
      // Handle error here
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/accounts/user/details`,
          { withCredentials: true }
        );
        const userDetails = response.data.data;
        setEmail(userDetails.email);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          {" "}
          <FaCog />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-xs leading-none text-muted-foreground">
              Signed in as
            </p>
            <p className="text-sm font-medium leading-none">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <Link to={"/"}>
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link to={"/settings"}>
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span onClick={handleLogout}>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
