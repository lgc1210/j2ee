import React from "react";
import { items } from "./items";
import { useLocation, useNavigate } from "react-router-dom";
import paths from "../../Constants/paths";

const ProfileSidebar = () => {
  const [isActive, setIsActive] = React.useState(false);
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  const handleItemClicked = (path) => {
    navigate(path);
  };

  return (
    <aside className='bg-white shadow-md rounded-md w-80 p-4 h-full'>
      <ul className='flex flex-col gap-1'>
        {items.map((item) => {
          return (
            <li
              key={item?.id}
              className='group'
              onClick={() => handleItemClicked(item?.path)}>
              <p
                className={`truncate group-hover:bg-[#274b609f] font-semibold group-hover:text-white rounded p-2 cursor-pointer ${
                  item?.deleteItem ? "text-red-500" : ""
                } ${
                  currentPath === item?.path ? "bg-[#274b609f] text-white" : ""
                }`}>
                {item?.name}
              </p>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ProfileSidebar;
