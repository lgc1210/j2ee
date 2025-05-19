import React, { useState, useEffect } from "react";
import { isEmpty } from "../../../../Utils/validation";
import { IoClose } from "react-icons/io5";
import { showToast } from "../../../../Components/Toast";
import RoleService from "../../../../Services/role";
import UserService from "../../../../Services/user";
import OrderService from "../../../../Services/order";

const FormControl = React.lazy(() => import("../../../../Components/FormControl"));
const Overlay = React.lazy(() => import("../../../../Components/Overlay"));
const Loading = React.lazy(() => import("../../../../Components/Loading"));

const Form = ({ toggle, setToggle, initialData, onSubmit, isDisabled = false, fetchCurrentStoreOrders}) => {
  const [pending, setPending] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if(initialData) {
      console.log("Initial",initialData);
      setOrder(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled || pending) return;

    setPending(true);
    try {
      let response;

      if (initialData && order) {
        response = await OrderService.updateOrderStatus(initialData?.id, order.status);

        if (response && response.data) {
          console.log(response);
          showToast("Order updated!");
          //onSubmit(response.data);
          setToggle(false);
        }
      } 
      await fetchCurrentStoreOrders();
    } catch (error) {
      console.error("Error when saving:", error);
      showToast(`Error when updating order`, "error");
    } finally {
      setPending(false);
    }
  };

  // Hàm đóng form, reset cả fields và errors
  const handleClose = () => {
    setOrder(null);
    setToggle(false);
  };

  return (
    <>
      <Overlay toggle={toggle} setToggle={handleClose} />
      <section
        className={`
          ${
            toggle ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          } fixed inset-0 z-40 flex justify-center pt-8 pb-4 overflow-y-auto`}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white max-w-md w-full rounded p-6 min-h-fit"
        >
          <div className="flex items-center justify-between w-full mb-4">
            <p className="font-semibold text-lg">
              {isDisabled
                ? "Order Details"
                : "Order Edit"}
            </p>
            <IoClose size={26} className="cursor-pointer" onClick={handleClose} />
          </div>

          <div className="space-y-4">
            <FormControl
              type="text"
              placeHolder="Order Time"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="order_time"
              label="Order Time"
              labelStyle="mb-1 font-serif"
              value={initialData?.created_at}
              disabled={isDisabled}
            />

            <FormControl
              type="text"
              placeHolder="Customer"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="customer_name"
              label="Customer"
              labelStyle="mb-1 font-serif"
              value={initialData?.user.name}
              disabled={isDisabled}
            />

            <FormControl
              type="text"
              placeHolder="Shipping Address"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="customer"
              label="Shipping Address"
              labelStyle="mb-1 font-serif"
              value={initialData?.shipping_address}
              disabled={isDisabled}
            />

            <FormControl
              type="text"
              placeHolder="Total"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="Total"
              label="Total Price"
              labelStyle="mb-1 font-serif"
              value={initialData?.total_amount}
              disabled={isDisabled}
            />

            <FormControl
              type="select"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="status"
              label="Status"
              labelStyle="mb-1 font-serif"
              value={order?.status || ""}
              onChange={(event) => setOrder(prev => ({
                                                  ...prev,
                                                  status: event.target.value
                                                }))}
              disabled={initialData?.status === "Delivered" ||
                        initialData?.status === "Canceled" ||
                        isDisabled}
              options={[
                { value: "", label: "Choose status" },
                ...['Waiting for approval', 'Approved', 'Delivered', 'Canceled'].map(item => ({
                  value: item,
                  label: item 
                }))
              ]}
            />
          </div>

          <div className="flex items-center gap-4 mt-6">
            {!isDisabled && (
              <>
                <button
                  type="button"
                  className="transition-all duration-700 text-black w-full py-2 rounded font-serif font-semibold bg-gray-200 hover:bg-gray-300"
                  onClick={handleClose}
                  disabled={pending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="transition-all duration-700 hover:bg-black text-white bg-[#799aa1] w-full py-2 rounded font-serif font-semibold"
                  disabled={pending}
                >
                  {pending ? (
                    <Loading customStyle="flex items-center justify-center" />
                  ) : (
                    <p>{"Update"}</p>
                  )}
                </button>
              </>
            )}
            {isDisabled && (
              <button
                type="button"
                className="transition-all duration-700 hover:bg-black text-white bg-[#799aa1] w-full py-2 rounded font-serif font-semibold"
                onClick={handleClose}
              >
                Close
              </button>
            )}
          </div>
        </form>
      </section>
    </>
  );
};

export default Form;