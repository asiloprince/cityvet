// import { Outlet } from "react-router-dom";
import SideBar from "../../components/SideBar";

function Layout() {
  return (
    <div>
      <main>
        <SideBar />
        <div></div>
      </main>
      {/* <Outlet /> */}
    </div>
  );
}

export default Layout;
