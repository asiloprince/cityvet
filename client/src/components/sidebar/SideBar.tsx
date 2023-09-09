import { useState } from "react";
import { Link } from "react-router-dom";

import links from "../../utils/link";
import { FaBars, FaCog, FaTimes } from "react-icons/fa";

function SideBar() {
  // for mobile navigation responsiveness
  const [sideBar, setSideBar] = useState(false);

  const navigationHandler = () => {
    setSideBar(!sideBar);
  };
  return (
    <div>
      <div
        //condtion in classes for screen navigation
        className={`fixed lg:static w-[80vw] md:w-[40vw] lg:w-full top-0  z-50 bg-white transition-all ${
          sideBar ? "-left-0" : "-left-full"
        }  h-full col-span-1 p-10 border-r lg:min-h-screen`}
      >
        <div className="text-center pb-4">
          <h1 className="font-poppin font-bold text-2xl uppercase tracking-[4px]">
            Cityvet
          </h1>
        </div>
        <div className="flex flex-col justify-between h-[530px]">
          {/* navigation sidebar */}
          <nav>
            <ul>
              {links.map((link) => (
                <div key={link.id}>
                  <p className="text-xs text-gray-500 pt-4">{link.title}</p>
                  {link.listLinks.map((listLink) => (
                    <li key={listLink.id}>
                      <Link
                        to={listLink.url}
                        className="flex items-center gap-4 hover:bg-cyan-600 p-2 hover:text-white text-sm text-gray-700 font-semibold rounded-lg transition-colors ml-1"
                      >
                        {listLink.icon}
                        {listLink.title}
                      </Link>
                    </li>
                  ))}
                </div>
              ))}
            </ul>
          </nav>

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
        className="fixed bottom-4 right-4 bg-cyan-600 p-2 text-white rounded lg:hidden text-2xl"
        onClick={navigationHandler}
      >
        {sideBar ? <FaTimes className="text-red-500 " /> : <FaBars />}
      </button>
    </div>
  );
}

export default SideBar;
