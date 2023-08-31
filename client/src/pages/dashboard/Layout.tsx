import SideBar from "../../components/sidebar/SideBar";
import Header from "../../components/header/Header";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="lg:min-h-screen grid lg:grid-cols-6 ">
      {/* Sidebar */}
      <SideBar />

      <div className="col-span-5">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
