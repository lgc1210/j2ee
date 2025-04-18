import React, { useState, useEffect } from "react";
import { isEmpty } from "../../../Utils/validation";
import { IoClose } from "react-icons/io5";
import { showToast } from "../../../Components/Toast";
import RoleService from "../../../Services/role";
import UserService from "../../../Services/user";

const FormControl = React.lazy(() => import("../../../Components/FormControl"));
const Overlay = React.lazy(() => import("../../../Components/Overlay"));
const Loading = React.lazy(() => import("../../../Components/Loading"));

const Form = ({ toggle, setToggle, initialData, onSubmit, isDisabled = false, usersData }) => {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    createdAt: "",
    updateAt: "",
    role: "",
    status: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFields({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        createdAt: initialData.createdAt || "",
        updateAt: initialData.updateAt || "",
        password: initialData.password || "",
        role: initialData.role?.id || "",
        status: initialData.status || "",
      });
      setErrors({}); 
    } else {
      setFields({
        name: "",
        email: "",
        phone: "",
        createdAt: "",
        updateAt: "",
        role: "",
        password: "",
        status: "",
      });
      setErrors({}); 
    }
  }, [initialData]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await RoleService.getAllRoles();
        const rolesData = response.data;
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách roles:", error);
        showToast("Không thể tải danh sách roles", "error");
        setRoles([]);
      }
    };
    fetchOwners();
  }, []);

  const handleFieldsChange = (key, value) => {
    if (!isDisabled) {
      if (key === "role") {
        console.log("Selected role value:", value);
        setFields((prev) => ({ ...prev, role: value }));
      } else {
        setFields((prev) => ({ ...prev, [key]: value }));
      }
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleFileChange = (e) => {
    if (!isDisabled && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFields((prev) => ({ ...prev, image: selectedFile.name }));
      setErrors((prev) => ({ ...prev, image: "" }));
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

    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@gmail\.com$/;

 
    if (isEmpty(fields.name)) newErrors.name = "Name is required";
    if (isEmpty(fields.status)) newErrors.status = "Status is required";

 
    if (isEmpty(fields.email)) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(fields.email)) {
      newErrors.email = "Email must be a valid @gmail.com address";
    } else if (fields.email && usersData) {
      const emailExists = usersData.some(
        (user) =>
          user.email.trim().toLowerCase() === fields.email.trim().toLowerCase() &&
          (!initialData || user.id !== initialData.id)
      );
      if (emailExists) {
        newErrors.email = "Email already exists";
      }
    }

    if (isEmpty(fields.phone)) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(fields.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    } else if (fields.phone && usersData) {
      const phoneExists = usersData.some(
        (user) =>
          user.phone.trim() === fields.phone.trim() &&
          (!initialData || user.id !== initialData.id)
      );
      if (phoneExists) {
        newErrors.phone = "Phone number already exists";
      }
    }

    if (isEmpty(fields.role)) newErrors.role = "Role is required";

  
    if (!initialData && isEmpty(fields.password)) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled || !validateForm() || pending) return;

    setPending(true);
    try {
      const data = {
        name: fields.name.trim(),
        password: fields.password,
        email: fields.email.trim(),
        phone: fields.phone.trim(),
        createdAt: null,
        updateAt: null,
        role: fields.role ? { id: Number(fields.role) } : null,
        status: fields.status,
      };

      let response;
      if (initialData) {
        response = await UserService.updateUser(initialData.id, data);
      } else {
        response = await UserService.createUser(data);
      }

      if (response && response.data) {
        onSubmit(response.data);
        setToggle(false);
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      const errorMessage = typeof error === "string" ? error : error.message || "Lỗi không xác định";
      showToast(`Lỗi khi lưu: ${errorMessage}`, "error");

      if (errorMessage.includes("Email")) {
        setErrors((prev) => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.includes("Phone")) {
        setErrors((prev) => ({ ...prev, phone: errorMessage }));
      }
    } finally {
      setPending(false);
    }
  };

  // Hàm đóng form, reset cả fields và errors
  const handleClose = () => {
    setFields({
      name: "",
      email: "",
      phone: "",
      password: "",
      createdAt: "",
      updateAt: "",
      role: "",
      status: "",
    });
    setFile(null);
    setErrors({});
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
                ? "Thông tin User"
                : initialData
                ? "Chỉnh sửa User"
                : "Tạo User"}
            </p>
            <IoClose size={26} className="cursor-pointer" onClick={handleClose} />
          </div>

          <div className="space-y-4">
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
              onBlur={() => {
                if (isEmpty(fields.name)) {
                  handleFieldsBlur("name", "Name is required");
                }
              }}
              hasError={!!errors?.name}
              errorMessage={errors?.name}
              disabled={isDisabled}
            />

            <FormControl
              type="text"
              placeHolder="Enter phone"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="phone"
              label="Phone"
              labelStyle="mb-1 font-serif"
              value={fields.phone}
              onChange={(event) => handleFieldsChange("phone", event.target.value)}
              onType={() => handleFieldsType("phone")}
              onBlur={() => {
                if (isEmpty(fields.phone)) {
                  handleFieldsBlur("phone", "Phone number is required");
                } else if (!/^\d{10}$/.test(fields.phone)) {
                  handleFieldsBlur("phone", "Phone number must be 10 digits");
                } else if (
                  usersData &&
                  usersData.some(
                    (user) =>
                      user.phone.trim() === fields.phone.trim() &&
                      (!initialData || user.id !== initialData.id)
                  )
                ) {
                  handleFieldsBlur("phone", "Phone number already exists");
                }
              }}
              disabled={isDisabled}
              hasError={!!errors?.phone}
              errorMessage={errors?.phone}
            />

            <FormControl
              type="text"
              placeHolder="Enter email"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="email"
              label="Email"
              labelStyle="mb-1 font-serif"
              value={fields.email}
              onChange={(event) => handleFieldsChange("email", event.target.value)}
              onType={() => handleFieldsType("email")}
              onBlur={() => {
                if (isEmpty(fields.email)) {
                  handleFieldsBlur("email", "Email is required");
                } else if (!/^[^\s@]+@gmail\.com$/.test(fields.email)) {
                  handleFieldsBlur("email", "Email must be a valid @gmail.com address");
                } else if (
                  usersData &&
                  usersData.some(
                    (user) =>
                      user.email.trim().toLowerCase() === fields.email.trim().toLowerCase() &&
                      (!initialData || user.id !== initialData.id)
                  )
                ) {
                  handleFieldsBlur("email", "Email already exists");
                }
              }}
              hasError={!!errors?.email}
              errorMessage={errors?.email}
              disabled={isDisabled}
            />

            { (
              <FormControl
                type="text"
                placeHolder="Enter password"
                wrapInputStyle=""
                inputStyle="placeholder:text-lg text-black placeholder:font-serif"
                hasLabel
                id="password"
                label="Password"
                labelStyle="mb-1 font-serif"
                value={fields.password}
                onChange={(event) => handleFieldsChange("password", event.target.value)}
                onType={() => handleFieldsType("password")}
                onBlur={() => {
                  if (isEmpty(fields.password)) {
                    handleFieldsBlur("password", "Password is required");
                  }
                }}
                hasError={!!errors?.password}
                errorMessage={errors?.password}
                disabled={isDisabled}
              />
            )}

            <FormControl
              type="select"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="role"
              label="Role"
              labelStyle="mb-1 font-serif"
              value={fields.role || ""}
              onChange={(event) => handleFieldsChange("role", event.target.value)}
              onType={() => handleFieldsType("role")}
              onBlur={() => {
                if (isEmpty(fields.role)) {
                  handleFieldsBlur("role", "Role is required");
                }
              }}
              hasError={!!errors?.role}
              errorMessage={errors?.role}
              disabled={isDisabled}
              options={[
                { value: "", label: "Choose role" },
                ...(Array.isArray(roles) ? roles : []).map((role) => ({
                  value: String(role.id),
                  label: role.name,
                })),
              ]}
            />

            {/* <FormControl
              type="select"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="status"
              label="Status"
              labelStyle="mb-1 font-serif"
              value={fields.status}
              onChange={(event) => handleFieldsChange("status", event.target.value)}
              onType={() => handleFieldsType("status")}
              onBlur={() => {
                if (isEmpty(fields.status)) {
                  handleFieldsBlur("status", "Status is required");
                }
              }}
              hasError={!!errors?.status}
              errorMessage={errors?.status}
              disabled={isDisabled}
              options={[
                { value: "", label: "Choose status" },
                { value: "1", label: "Active" },
                { value: "2", label: "Inactive" },
              ]}
            /> */}
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
                    <p>{initialData ? "Cập nhật" : "Tạo"}</p>
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