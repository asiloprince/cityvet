import { useState, useEffect } from "react";
import axios from "axios";

import TeamCardWidget from "../../../components/card-widgets/TeamCardWidgets";
import AccessLevelButton from "./AccessButton";
import { Lock, ShieldCheck, Unlock } from "lucide-react";

interface Role {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  roles: string;
  ActiveLevel: "Admin" | "ProgramManager" | "Coordinator";
  role?: string;
}
function TeamRole() {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
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

    fetchData();
  }, []);

  const icons = {
    Admin: <ShieldCheck className="text-white" />,
    ProgramManager: <Lock className="text-white" />,
    Coordinator: <Unlock className="text-white" />,
  };

  return (
    <div className="m-5">
      <h1 className="text-4xl font-bold m-4">Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-teal-400 text-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto">
          <TeamCardWidget
            role="Your Role"
            number={123}
            dataKey="Your Data Key"
            percentage={50}
          />
        </div>

        <div className="bg-gray-800 text-white rounded-lg p-4 shadow col-span-3 md:col-span-1 h-auto border-r-4 border-teal-500">
          <TeamCardWidget
            role="Your Role"
            number={123}
            dataKey="Your Data Key"
            percentage={50}
          />
        </div>
        <TeamCardWidget
          role="Your Role"
          number={123}
          dataKey="Your Data Key"
          percentage={50}
        />
      </div>
      <h1 className="text-2xl font-semibold m-4">
        Team members{" "}
        <span className="border-r-cyan-500 text-xs w-full bg-cyan-100 rounded-lg text-cyan-500 p-2">
          users
        </span>
      </h1>
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
                    <AccessLevelButton initialLabel="Admin" icons={icons} />
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
