import React from "react";
import items from "./items";
import { useLocation, useNavigate } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { PiSignOut } from "react-icons/pi";
import { useAuth } from "../../Contexts/Auth";
import { IoIosArrowDown } from "react-icons/io";

const filterSidebarItems = (items, isAuthenticated, user) => {
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

const SidebarHeader = React.memo(({ toggleSidebar, isOpen }) => (
  <div className='flex items-center justify-between p-8 text-white'>
    <h1 className='text-5xl font-serif tracking-widest'>Booking</h1>
    <button
      className='md:hidden p-2 rounded-xl hover:bg-slate-500'
      onClick={toggleSidebar}>
      {isOpen ? <IoClose size={24} /> : <LuMenu size={22} />}
    </button>
  </div>
));

const SidebarItem = ({ item, isActive, onClick, children }) => {
  const [openChildren, setOpenChildren] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const handleItemClick = () => {
    setOpenChildren(children ? !openChildren : false);
    onClick();
  };

  return (
    <li
      className={`group cursor-pointer rounded-md p-4 ${
        isActive && children ? "" : "hover:bg-slate-500"
      } ${isActive ? "bg-slate-300 text-[#274b60]" : "text-white"}`}
      onClick={handleItemClick}>
      <div
        className={`flex items-center justify-between ${
          isActive && openChildren ? "mb-2" : ""
        }`}>
        <p className='truncate'>{item?.name}</p>
        {children && (
          <IoIosArrowDown
            size={22}
            className={`transition-all duration-500 ${
              openChildren ? "rotate-0" : "rotate-180"
            }`}
          />
        )}
      </div>
      {isActive && children && openChildren && (
        <ul className='flex-grow pt-0'>
          {filterSidebarItems(children, isAuthenticated, user).map((item) => (
            <SidebarItemChild
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              children={item?.children}
              onClick={() => navigate(item.path)}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const SidebarItemChild = ({ item, isActive, onClick }) => {
  const handleItemClick = (event) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <li
      className={`cursor-pointer hover:bg-black/30 hover:text-white rounded-md p-4 ${
        isActive ? "bg-slate-300 text-[#274b60]" : "text-[#274b60]"
      }`}
      onClick={handleItemClick}>
      <p className='truncate'>{item?.name}</p>
    </li>
  );
};

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
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(true);
  const { logout, isAuthenticated, user } = useAuth();

  return (
    <aside
      className={`bg-[#435d63] shadow-md rounded-md m-4 xl:mr-0 flex flex-col transition-all duration-500 min-h-screen max-h-full ${
        isOpen ? "max-h-full" : "max-h-fit"
      }`}>
      <SidebarHeader toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />

      {isOpen && (
        <ul className='flex-grow p-8 pt-0'>
          {filterSidebarItems(items, isAuthenticated, user).map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              children={item?.children}
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
