import SideBar from "../../components/sidebar/SideBar";
import Header from "../../components/header/Header";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="lg:min-h-screen grid lg:grid-cols-6">
      {/* Fixed Sidebar */}
      <div className="lg:col-span-1 lg:fixed lg:h-full ">
        <SideBar />
      </div>

      {/* Scrollable Content */}
      <div className="col-span-2 mb-2 lg:col-span-6 lg:ml-52">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
