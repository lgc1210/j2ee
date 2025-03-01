import React from "react";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToast = (message, type = "success") => {
  toast[type](message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Zoom,
  });
};

const Toast = () => {
  return <ToastContainer />;
};

export { showToast };
export default Toast;
