import React, { useState } from "react";
import items from "./items";
import { useLocation, useNavigate } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { PiSignOut } from "react-icons/pi";
import { useAuth } from "../../Contexts/Auth";

const SidebarHeader = ({ toggleSidebar, isOpen }) => (
  <div className='flex items-center justify-between p-8 text-white'>
    <h1 className='text-5xl font-serif tracking-widest'>Booking</h1>
    <button
      className='md:hidden p-2 rounded-xl hover:bg-slate-500'
      onClick={toggleSidebar}>
      {isOpen ? <IoClose size={24} /> : <LuMenu size={22} />}
    </button>
  </div>
);

const SidebarItem = ({ item, isActive, onClick }) => (
  <li
    className={`cursor-pointer hover:bg-slate-500 rounded-xl p-4 ${
      isActive ? "bg-slate-300 text-[#274b60]" : "text-white"
    }`}
    onClick={onClick}>
    {item.name}
  </li>
);

const SidebarFooter = ({ onLogout }) => (
  <div
    className='bg-slate-300 p-2 cursor-pointer mb-10 flex items-center justify-center gap-4 text-[#14373f]'
    onClick={onLogout}>
    <PiSignOut size={20} />
    <span>Sign out</span>
  </div>
);

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { logout, isAuthenticated, user } = useAuth();

  const filterSidebarItems = (items) => {
    return items?.filter((item) => {
      if (!isAuthenticated && item?.requiredAuth) {
        return false;
      }
      if (
        isAuthenticated &&
        item?.requiredRole &&
        !item?.requiredRole.includes(user?.role)
      ) {
        return false;
      }
      return true;
    });
  };

  return (
    <aside
      className={`bg-[#435d63] flex flex-col transition-all duration-500 h-screen ${
        isOpen ? "max-h-full" : "max-h-fit"
      }`}>
      <SidebarHeader toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />

      {isOpen && (
        <ul className='flex-grow p-8 pt-0'>
          {filterSidebarItems(items).map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </ul>
      )}

      <SidebarFooter onLogout={logout} />
    </aside>
  );
};

export default AdminSidebar;
