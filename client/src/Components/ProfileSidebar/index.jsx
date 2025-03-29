import React from "react";
import { items } from "./items";
import { useLocation, useNavigate } from "react-router-dom";
import paths from "../../Constants/paths";

const ConfirmPopup = React.lazy(() => import("../../Components/ConfirmPopup"));

const ProfileSidebar = () => {
  const [showPopup, setShowPopup] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  const handleItemClicked = (path) => {
    navigate(path);
  };

  return (
    <>
      <aside className='bg-white shadow-md rounded-md w-80 p-4 h-full'>
        <ul className='flex flex-col gap-1'>
          {items.map((item) => {
            return (
              <li
                key={item?.id}
                className='group'
                onClick={() =>
                  item?.deleteItem
                    ? setShowPopup(true)
                    : handleItemClicked(item?.path)
                }>
                <p
                  className={`truncate group-hover:bg-[#274b609f] font-semibold group-hover:text-white rounded p-2 cursor-pointer ${
                    item?.deleteItem ? "text-red-500" : ""
                  } ${
                    currentPath === item?.path
                      ? "bg-[#274b609f] text-white"
                      : ""
                  }`}>
                  {item?.name}
                </p>
              </li>
            );
          })}
        </ul>
      </aside>

      <ConfirmPopup
        toggle={showPopup}
        setToggle={() => setShowPopup(false)}
        title='Are you sure you want to delete your account?'
        message='This action can be undone.'
        okButtonText='Accept'
        cancelButtonText='Cancel'
        onOk={() => {
          setShowPopup(false);
          // console.log("Account deleted");
        }}
        onCancel={() => setShowPopup(false)}
      />
    </>
  );
};

export default ProfileSidebar;
