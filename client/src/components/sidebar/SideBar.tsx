import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import taskImg from "../../assets/task.png";
import links from "./link";
import { FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";

function SideBar() {
  // for mobile navigation responsiveness
  const [sideBar, setSideBar] = useState(false);

  const navigationHandler = () => {
    setSideBar(!sideBar);
  };

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const getRole = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_PUBLIC_API_URL}/accounts/role`,
          { withCredentials: true }
        );

        const result = res.data;
        setUserRole(result.role);
      } catch (error) {
        console.error(error);
      }
    };

    getRole();
  }, []);

  return (
    <div>
      <div
        //condtion in classes for screen navigation
        className={`fixed lg:static w-[80vw] md:w-[40vw] lg:w-full top-0  z-50 bg-white transition-all ${
          sideBar ? "-left-0" : "-left-full"
        }  h-full col-span-1 p-8 border-r lg:min-h-screen`}
      >
        <div className="text-center pb-4">
          <h1 className="font-poppin font-bold text-2xl uppercase tracking-[4px]">
            Cityvet
          </h1>
        </div>
        <div className="flex flex-col justify-between h-[550px]">
          {/* navigation sidebar */}
          <nav>
            <ul>
              {links.map((link) => {
                if (link.id === 4 && userRole !== "Admin") {
                  return null;
                }
                if (link.id === 3 && userRole === "Admin") {
                  return null;
                }
                if (link.id === 5 && userRole !== "Admin") {
                  return null;
                }

                return (
                  <div key={link.id}>
                    <p className="text-xs text-gray-500 pt-4">{link.title}</p>
                    {link.listLinks.map((listLink) => {
                      if (
                        listLink.title === "Dispersal" &&
                        userRole === "Coordinator"
                      ) {
                        return null;
                      }
                      return (
                        <li key={listLink.id}>
                          <Link
                            to={listLink.url}
                            className="flex items-center gap-4 hover:bg-cyan-600 p-2 hover:text-white text-sm text-gray-700 font-semibold rounded-lg transition-colors ml-1"
                          >
                            {listLink.icon}
                            {listLink.title}
                          </Link>
                        </li>
                      );
                    })}
                  </div>
                );
              })}
            </ul>
          </nav>

          {/* logout */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex flex-col gap-2">
              <img
                src={taskImg}
                alt="Image"
                className="w-32 h-28 mx-auto block"
              />

              <div className="bg-purple-50 p-2 flex flex-col gap-2 rounded-2xl">
                <h3 className="text-base text-center font-poppin ">
                  {" "}
                  Optimize{" "}
                </h3>
                <p className="text-gray-500 text-center"></p>
                <button className="bg-cyan-600 text-white text-sm p-2 rounded-lg">
                  Your Operations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* this is content */}
      {/* <div className="bg-blue-400 col-span-5">Helo</div> */}

      <button
        className="fixed bottom-4 right-4 bg-cyan-600 p-2 text-white rounded lg:hidden text-2xl"
        onClick={navigationHandler}
      >
        {sideBar ? <FaTimes className="text-red-500 " /> : <FaBars />}
      </button>
    </div>
  );
}

export default SideBar;
