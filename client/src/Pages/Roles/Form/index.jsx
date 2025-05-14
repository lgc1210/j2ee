import React, { useState, useEffect } from "react";
import { isEmpty } from "../../../Utils/validation";
import { IoClose } from "react-icons/io5";
import RoleService from "../../../Services/role";
import { showToast } from "../../../Components/Toast";

const FormControl = React.lazy(() => import("../../../Components/FormControl"));
const Overlay = React.lazy(() => import("../../../Components/Overlay"));
const Loading = React.lazy(() => import("../../../Components/Loading"));

const Form = ({ toggle, setToggle, initialData, onSubmit, isDisabled = false, rolesData }) => {
  const [fields, setFields] = useState({ name: "" });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (initialData && initialData.name) {
      setFields({ name: initialData.name });
      setErrors({});
    } else {
      setFields({ name: "" });
      setErrors({});
    }
  }, [initialData]);

  const handleFieldsChange = (key, value) => {
    if (!isDisabled) {
      setFields((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleFieldsType = (key) => {
    if (!isDisabled) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleFieldsBlur = (key, message) => {
    if (!isDisabled) {
      setErrors((prev) => ({ ...prev, [key]: message }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (isEmpty(fields.name)) {
      newErrors.name = "Name is required";
    }

    if (fields.name && rolesData) {
      const nameExists = rolesData.some(
        (role) =>
          role.name.trim().toLowerCase() === fields.name.trim().toLowerCase() &&
          (!initialData || role.id !== initialData.id)
      );
      if (nameExists) {
        newErrors.name = "Name already exists";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setFields({ name: "" });
    setErrors({});
    setToggle(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled || !validateForm() || pending) return;

    setPending(true);
    try {
      if (initialData) {
        const response = await RoleService.updateRole(initialData.id, fields);
        if (response && response.data) {
          onSubmit(response.data);
        }
      } else {
        const response = await RoleService.createRole(fields);
        if (response && response.data) {
          onSubmit(response.data);
        }
      }
      setToggle(false);
    } catch (error) {
      console.error("Lỗi khi lưu vai trò:", error);
      showToast("Lỗi khi lưu vai trò", "error");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Overlay toggle={toggle} setToggle={setToggle} />
      <section
        className={`
          ${
            toggle
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } fixed inset-0 z-40 flex items-center justify-center lg:px-0 p-4`}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white max-w-md w-full rounded p-6"
        >
          <div className="flex items-center justify-between w-full mb-4">
            <p className="font-semibold text-lg">
              {isDisabled
                ? "Thông tin vai trò"
                : initialData
                ? "Chỉnh sửa vai trò"
                : "Tạo vai trò"}
            </p>
            <IoClose size={26} className="cursor-pointer" onClick={setToggle} />
          </div>

          <div>
            <FormControl
              type="text"
              placeHolder="Enter Name"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="name"
              label="Name"
              labelStyle="mb-1 font-serif"
              value={fields.name}
              onChange={(event) => handleFieldsChange("name", event.target.value)}
              onType={() => handleFieldsType("name")}
              onBlur={() =>
                isEmpty(fields.name) &&
                handleFieldsBlur("name", "Name is required")
              }
              hasError={errors?.name}
              errorMessage={errors?.name}
              disabled={isDisabled}
            />
          </div>

          <div className="flex items-center gap-4 mt-6">
            {!isDisabled && (
              <>
                <button
                  type="button"
                  className="transition-all duration-700 text-black w-full py-2 rounded font-serif font-semibold bg-gray-200 hover:bg-gray-300"
                  onClick={setToggle}
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
                    <p>{initialData ? "Cập nhật" : "Tạo"}</p>
                  )}
                </button>
              </>
            )}
            {isDisabled && (
              <button
                type="button"
                className="transition-all duration-700 hover:bg-black text-white bg-[#799aa1] w-full py-2 rounded font-serif font-semibold"
                onClick={() => setToggle(false)}
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