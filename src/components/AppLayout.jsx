import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";

function AppLayout() {
  return (
    <div className="relative flex flex-1">
      <Sidebar />
      <div className="w-screen">
        <Header />

        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
