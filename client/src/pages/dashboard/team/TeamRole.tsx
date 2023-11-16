import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import TeamCardWidget from "../../../components/card-widgets/TeamCardWidgets";
import { UserPlus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { toast } from "react-toastify";

interface Role {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  roles: string;
  role_id: string;
  role_name: string;
  ActiveLevel: "Admin" | "ProgramManager" | "Coordinator";
  role?: string;
}

function TeamRole() {
  const [roles, setRoles] = useState<Role[]>([]);

  const roleNames: { [key: string]: string } = {
    "1": "Admin",
    "2": "Program Manager",
    "3": "Coordinator",
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PUBLIC_API_URL}/accounts`,
        { withCredentials: true }
      );
      setRoles(response.data.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleRoleChange = async (user_id: string, newRoleId: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_PUBLIC_API_URL}/accounts/assign-role/${user_id}`,
        { role_id: newRoleId },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Role update error:", error);
      toast.error("An error occurred while updating the role.");
    }
  };


  return (
    <div className="m-5">
      <h1 className="text-2xl font-bold mb-4">Team Management</h1>

      <div className="flex justify-between mt-4">
        <h1 className="text-2xl font-semibold m-4">
          Team members{" "}
          <span className="border-r-cyan-500 text-xs w-full bg-cyan-100 rounded-lg text-cyan-500 p-2">
            {roles.length} users
          </span>
        </h1>
        <div>
          <Link to={"/register"}>
            <Button className="font-poppin text-white text-base ml-2 bg-cyan-600 rounded hover:bg-cyan-700 ">
              <span>
                <UserPlus className="m-2 p-0" />
              </span>
              Add
            </Button>
          </Link>
        </div>
      </div>

      <div className="shadow-md rounded-lg border-y-4 border-y-cyan-500 ">
        <table className="table-auto w-full ">
          <thead className="h-10 border-b text-gray-500">
            <tr>
              <th className="text-start p-4">ID</th>
              <th className="text-start p-4">First Name</th>
              <th className="text-start p-4">Last Name</th>
              <th className="text-start p-4">Email</th>
              <th className="text-start p-4">Roles</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, i) => (
              <tr
                key={i}
                className="hover:bg-gray-100 border-b font-semibold text-xs text-gray-500"
              >
                <td className="p-3 text-left">
                  <p className="bg-cyan-100 text-cyan-500 text-center rounded-md font-bold">
                    {role.user_id}
                  </p>
                </td>
                <td className="p-3 text-left border-l">{role.first_name}</td>
                <td className="p-3 text-left">{role.last_name}</td>
                <td className="p-3 text-left">{role.email}</td>
                <td className="p-3 text-left">
                  <div>
                    <select
                      value={Object.keys(roleNames).find(
                        (key) => roleNames[key] === role.role_name
                      )}
                      onChange={(e) =>
                        handleRoleChange(role.user_id, e.target.value)
                      }
                    >
                      {Object.entries(roleNames).map(([id, name]) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeamRole;
