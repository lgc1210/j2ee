import React, { useState, useEffect } from "react";
import { isEmpty } from "../../../../Utils/validation";
import { IoClose } from "react-icons/io5";
import { showToast } from "../../../../Components/Toast";
import RoleService from "../../../../Services/role";
import UserService from "../../../../Services/user";
import AppointmentService from "../../../../Services/appointment";

const FormControl = React.lazy(() => import("../../../../Components/FormControl"));
const Overlay = React.lazy(() => import("../../../../Components/Overlay"));
const Loading = React.lazy(() => import("../../../../Components/Loading"));

const Form = ({ toggle, setToggle, initialData, onSubmit, isDisabled = false, fetchCurrentStoreAppointments}) => {
  const [pending, setPending] = useState(false);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    if(initialData) {
      console.log("Initial",initialData);
      setAppointment(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled || pending) return;

    setPending(true);
    try {
      let response;
      let payment;

      if (initialData && appointment) {
        if (appointment?.status === "Completed") {
          payment = {
            payment_date: new Date(),
            payment_method: "On-site payment",
            price: appointment?.service.price,
            appointment: appointment,
            staff: appointment?.staff
          };
        }

        console.log("Payment", payment);

        response = await AppointmentService.updateAppointment(initialData?.id, appointment.status, payment);

        if (response && response.data) {
          console.log(response);
          showToast("Appointment updated!");
          //onSubmit(response.data);
          setToggle(false);
        }
      } 
      await fetchCurrentStoreAppointments();
    } catch (error) {
      console.error("Error when saving:", error);
      showToast(`Error when updating appointment`, "error");
    } finally {
      setPending(false);
    }
  };

  // Hàm đóng form, reset cả fields và errors
  const handleClose = () => {
    setAppointment(null);
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
                ? "Appointment Details"
                : "Appointment Edit"}
            </p>
            <IoClose size={26} className="cursor-pointer" onClick={handleClose} />
          </div>

          <div className="space-y-4">
            <FormControl
              type="text"
              placeHolder="Appointment Date"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="appointment_date"
              label="Appointment Date"
              labelStyle="mb-1 font-serif"
              value={initialData?.appointment_date}
              disabled={isDisabled}
            />

            <FormControl
              type="text"
              placeHolder="Appointment Time"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="appointment_time"
              label="Appointment Time"
              labelStyle="mb-1 font-serif"
              value={initialData?.appointment_time}
              disabled={isDisabled}
            />

            <FormControl
              type="text"
              placeHolder="CustomerCustomer"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="customer"
              label="Customer"
              labelStyle="mb-1 font-serif"
              value={initialData?.customer.name}
              disabled={isDisabled}
            />

            <FormControl
              type="text"
              placeHolder="Service"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="service"
              label="Service"
              labelStyle="mb-1 font-serif"
              value={initialData?.service.name}
              disabled={isDisabled}
            />

            <FormControl
              type="text"
              placeHolder="Staff"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="staff"
              label="Staff"
              labelStyle="mb-1 font-serif"
              value={initialData?.staff.name}
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
              value={appointment?.status || ""}
              onChange={(event) => setAppointment(prev => ({
                                                  ...prev,
                                                  status: event.target.value
                                                }))}
              disabled={(initialData?.status === "Completed" || initialData?.status === "Canceled") ? true : false || isDisabled}
              options={[
                { value: "", label: "Choose status" },
                ...['Pending', 'Completed', 'Canceled'].map(item => ({
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