import React, { lazy } from "react";

const OwnerSidebar = lazy(() => import("../../Components/OwnerSidebar"));

const OwnerLayout = ({ children }) => {
  return (
    <div className='grid lg:grid-cols-5 md:grid-cols-4 bg-gray-500/5'>
      <div>
        <OwnerSidebar />
      </div>

      <div className='lg:col-span-4 md:col-span-3 p-6'>{children}</div>
    </div>
  );
};

export default OwnerLayout;
