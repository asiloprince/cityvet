import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaPeopleArrows,
  FaUserFriends,
  FaPiggyBank,
  FaRegChartBar,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function SideBar() {
  // for mobile navigation
  const [sideBar, setSideBar] = useState(false);

  const navigationHandler = () => {
    setSideBar(!sideBar);
  };
  return (
    <div className="min-h-screen grid grid-col-1 lg:grid-cols-6">
      <div
        //condtion in classes for screen navigation
        className={`fixed lg:static w-[80%] lg:w-full top-0 z-50 bg-white ${
          sideBar ? "-left-0" : " -left-full"
        }  w-full h-full col-span-1 p-8 border-r`}
      >
        <div className="text-center p-8">
          <h1 className="font-poppin font-bold text-2xl uppercase tracking-[4px]">
            Cityvet
          </h1>
        </div>
        <div className="flex flex-col justify-between h-[500px]">
          {/* navigation sidebar */}
          <nav>
            <ul>
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-4 hover:bg-cyan-600 p-4 hover:text-white text-gray-600 font-semibold rounded-lg transition-colors"
                >
                  <FaRegChartBar /> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/benefeciaries"
                  className="flex items-center gap-4 hover:bg-cyan-600 p-4 hover:text-white text-gray-600 font-semibold rounded-lg transition-colors"
                >
                  <FaUserFriends /> Recipients
                </Link>
              </li>
              <li>
                <Link
                  to="/disperse"
                  className="flex items-center gap-4 hover:bg-cyan-600 p-4 hover:text-white text-gray-600 font-semibold rounded-lg transition-colors"
                >
                  <FaPeopleArrows />
                  Disperse
                </Link>
              </li>
              <li>
                <Link
                  to="/livestocks"
                  className="flex items-center gap-4 hover:bg-cyan-600 p-4 hover:text-white text-gray-600 font-semibold rounded-lg transition-colors"
                >
                  <FaPiggyBank />
                  Livestock
                </Link>
              </li>
            </ul>
          </nav>
          {/* logout */}
          <div className="flex flex-col gap-4">
            <Link
              to="login"
              className="flex items-center gap-4 hover:bg-cyan-600 p-4 hover:text-white text-gray-600 font-semibold rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              Logout
            </Link>
          </div>
        </div>
      </div>
      {/* this is content */}
      {/* <div className="bg-blue-400 col-span-5">Helo</div> */}
      <div>
        <button
          className="absolute bottom-4 right-4 bg-cyan-600 p-2 text-white rounded lg:hidden"
          onClick={navigationHandler}
        >
          {sideBar ? <FaTimes className="text-red-500 " /> : <FaBars />}
        </button>
        <Outlet />
      </div>
    </div>
  );
}

export default SideBar;
