import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <p>Admin Sidebar Here</p>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
