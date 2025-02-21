import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../Components/AdminSidebar";
const AdminLayout = () => {
  return (
    <div className='grid lg:grid-cols-5 md:grid-cols-4'>
      <div className=''>
        <AdminSidebar />
      </div>

      <div className='lg:col-span-4 md:col-span-3'>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
