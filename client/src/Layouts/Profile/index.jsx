import React from "react";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <div>
      <p>Profile Sidebar here</p>
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
