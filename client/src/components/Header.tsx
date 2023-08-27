import { Link, Outlet } from "react-router-dom";
import { FaRegBell, FaCog, FaSearch, FaCheckCircle } from "react-icons/fa";
function Header() {
  return (
    <div className="col-span-5">
      <header className="flex items-center justify-between p-4 w-full">
        {/* search */}
        <form className="w-[40%]">
          <div className="relative w-full">
            <FaSearch className="absolute left-2 top-3" />
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 p-2 pl-8 pr-4 outline-none rounded-lg w-full"
            />
          </div>
        </form>
        {/* notifiction */}
        <nav className="w-[70%] flex justify-end">
          <ul className="flex items-center gap-4">
            <li>
              <Link to="#" className="relative">
                <FaRegBell />
                <FaCheckCircle className="absolute -right-2 -top-1 text-xs text-green-500" />
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center gap-2">
                Admin
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center gap-2">
                <FaCog />
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div>
        {" "}
        <Outlet />
      </div>
    </div>
  );
}

export default Header;
