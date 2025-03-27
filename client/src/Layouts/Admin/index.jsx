import React, { lazy } from "react";

const AdminSidebar = lazy(() => import("../../Components/AdminSidebar"));

const AdminLayout = ({ children }) => {
  return (
    <div className='grid lg:grid-cols-5 md:grid-cols-4 bg-gray-500/5'>
      <div className=''>
        <AdminSidebar />
      </div>

      <div className='lg:col-span-4 md:col-span-3 p-6'>{children}</div>
    </div>
  );
};

export default AdminLayout;
