import React, { useState } from "react";
import items from "./items";
import { useLocation, useNavigate } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { PiSignOut } from "react-icons/pi";
// import { useAuth } from "../../contexts/Auth";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [showItems, setShowItems] = useState(true);
  const location = useLocation();
  // const { logout } = useAuth();

  const logout = () => {};

  return (
    <section
      className={`bg-[#274b60] flex flex-col transition-all duration-500 h-screen ${
        showItems ? "max-h-full" : "max-h-fit"
      }`}>
      <div className='p-8 flex-grow'>
        <div className='text-3xl font-semibold mb-4 text-white flex items-center justify-between'>
          <div>
            <p>Fashion</p>
          </div>
          <div
            className='md:hidden block cursor-pointer p-2 rounded-xl hover:bg-slate-500'
            onClick={() => setShowItems(!showItems)}>
            {showItems ? <IoClose /> : <LuMenu />}
          </div>
        </div>

        {showItems && (
          <ul>
            {items?.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`cursor-pointer hover:bg-slate-500 rounded-xl p-4 ${
                    location.pathname === item.path
                      ? "bg-slate-300 text-[#274b60]"
                      : "text-white"
                  }`}
                  onClick={() => navigate(item?.path)}>
                  {item?.name}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className='bg-slate-500 p-2 cursor-pointer mb-10 flex items-center justify-center gap-4'>
        <PiSignOut size={20} className='text-white' />
        <p className='text-center text-white' onClick={logout}>
          Sign out
        </p>
      </div>
    </section>
  );
};

export default AdminSidebar;
