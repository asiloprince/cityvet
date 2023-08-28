import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import {
  FaPeopleArrows,
  FaUserFriends,
  FaPiggyBank,
  FaRegChartBar,
  FaChartLine,
  FaCaretRight,
  FaCaretDown,
  FaCog,
  FaFileAlt,
  FaBars,
  FaTimes,
  FaCalendarCheck,
  FaEdit,
} from "react-icons/fa";

function SideBar() {
  // for mobile navigation
  const [sideBar, setSideBar] = useState(false);
  const [subButton, setSubButton] = useState(false);

  const navigationHandler = () => {
    setSideBar(!sideBar);
  };
  return (
    <div className="min-h-screen grid grid-col-1 lg:grid-cols-6">
      <div
        //condtion in classes for screen navigation
        className={`fixed lg:static w-[80vw] md:w-[40vw] lg:w-full top-0  z-50 bg-white transition-all ${
          sideBar ? "-left-0" : "-left-full"
        }  h-full col-span-1 p-8 border-r`}
      >
        <div className="text-center pb-2">
          <h1 className="font-poppin font-bold text-2xl uppercase tracking-[4px]">
            Cityvet
          </h1>
        </div>
        <div className="flex flex-col justify-between h-[550px]">
          {/* navigation sidebar */}
          <nav>
            <ul>
              <p className="text-xs text-gray-500 pt-4">Main</p>
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-4 hover:bg-cyan-600 p-2 hover:text-white text-sm text-gray-700 font-semibold rounded-lg transition-colors ml-1"
                >
                  <FaRegChartBar /> Dashboard
                </Link>
              </li>
              <div className="h-16 mb-5">
                <li>
                  <button
                    className="flex items-center gap-4 w-40  text-sm text-gray-700 font-semibold transition-all rounded-lg transition-colors "
                    onClick={() => {
                      setSubButton(!subButton);
                    }}
                  >
                    <div className="flex items-center">
                      {subButton ? (
                        <FaCaretDown className="text-xs" />
                      ) : (
                        <FaCaretRight className="text-xs" />
                      )}
                      <FaPeopleArrows />
                    </div>
                    Dispersal Program
                  </button>
                  {/* output subButton if true */}
                  {subButton && (
                    <ul className="absolute py-2 space-y-2 text-xs  overflow-y-auto ">
                      <li className="flex items-center">
                        <Link
                          to="disperse"
                          className="flex items-center justify-center align-middle ml-0.5 p-2 text-gray-700 w-44 font-semibold hover:bg-cyan-600 hover:text-white transition-colors"
                        >
                          Disperse
                        </Link>
                      </li>
                      <li className="flex items-center">
                        <Link
                          to="#"
                          className="flex items-center justify-center align-middle ml-2 p-2 text-gray-700 w-44 font-semibold hover:bg-cyan-600 hover:text-white transition-colors"
                        >
                          Redisperse
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </div>

              <p className="text-xs text-gray-500 pt-4">List</p>

              <li>
                <Link
                  to="/benefeciaries"
                  className="flex items-center gap-4 ml-1 hover:bg-cyan-600 p-2 hover:text-white text-sm text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  <FaUserFriends /> Recipients
                </Link>
              </li>
              <li>
                <Link
                  to="/livestocks"
                  className="flex items-center gap-4 ml-1 hover:bg-cyan-600 p-2 hover:text-white text-sm text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  <FaPiggyBank />
                  Livestock
                </Link>
              </li>
              <p className="text-xs text-gray-500 pt-4">General</p>

              <li>
                <Link
                  to="/benefeciaries"
                  className="flex items-center gap-4 ml-1 hover:bg-cyan-600 p-2 hover:text-white text-sm text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  <FaEdit /> Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/livestocks"
                  className="flex items-center gap-4 ml-1 hover:bg-cyan-600 p-2 hover:text-white text-sm text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  <FaCalendarCheck />
                  Calendar
                </Link>
              </li>
            </ul>
          </nav>
          {/* analytics */}
          <div>
            <p className="text-xs text-gray-500 p-2">Analytics</p>
            <ul>
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-4 ml-1 hover:bg-cyan-600 p-2 hover:text-white text-sm text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  <FaChartLine /> Statistics
                </Link>
              </li>
              <li>
                <Link
                  to="/benefeciaries"
                  className="flex items-center gap-4 ml-1 hover:bg-cyan-600 p-2 hover:text-white text-sm text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  <FaFileAlt /> Logs
                </Link>
              </li>
            </ul>
          </div>
          {/* logout */}
          <div className="flex flex-col gap-4">
            <Link
              to="#"
              className="flex items-center gap-4 ml-1 hover:bg-cyan-600 p-2 hover:text-white text-sm text-gray-700 font-semibold rounded-lg transition-colors"
            >
              <FaCog />
              Settings
            </Link>
          </div>
        </div>
      </div>
      {/* this is content */}
      {/* <div className="bg-blue-400 col-span-5">Helo</div> */}

      <button
        className="block absolute fixed bottom-4 right-4 bg-cyan-600 p-2 text-white rounded lg:hidden text-2xl"
        onClick={navigationHandler}
      >
        {sideBar ? <FaTimes className="text-red-500 " /> : <FaBars />}
      </button>

      <Header />
    </div>
  );
}

export default SideBar;
