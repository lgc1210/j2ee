import React, { useState, useEffect } from "react";
import { isEmpty } from "../../../Utils/validation";
import { IoClose } from "react-icons/io5";
import { showToast } from "../../../Components/Toast";
import RoleService from "../../../Services/role";
import UserService from "../../../Services/user";

const FormControl = React.lazy(() => import("../../../Components/FormControl"));
const Overlay = React.lazy(() => import("../../../Components/Overlay"));
const Loading = React.lazy(() => import("../../../Components/Loading"));

const Form = ({ toggle, setToggle, initialData, onSubmit, isDisabled = false }) => {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    createdAt: "",
    updateAt: "", 
    role:  "" ,

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
        role: initialData.role.id || "",
      });

    } else {
      setFields({
        name: "",
        email: "",
        phone: "",
        createdAt: "",
        updateAt: "",
        role: "",
        password:""

      });
    }
  }, [initialData]);
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await RoleService.getAllRoles();
        const rolesData = response.data;
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách  :", error);
        showToast("Không thể tải danh sách", "error");
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
    if (isEmpty(fields.name)) newErrors.name = "Tên là bắt buộc";
    if (isEmpty(fields.email)) newErrors.email = "Email là bắt buộc"; 
    if (isEmpty(fields.role)) newErrors.role = "Vai trò là bắt buộc"; 
    if (!initialData && isEmpty(fields.password)) newErrors.password = "Mật khẩu là bắt buộc"; 
    if (isEmpty(fields.phone)) newErrors.phone = "Số điện thoại là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled || !validateForm() || pending) return;
  
    setPending(true);
    try {
      const data = {
        name: fields.name,
        password: fields.password,
        email: fields.email,
        phone: fields.phone,
        createdAt: null,
        updateAt: null,
        role: fields.role ? { id: Number(fields.role) } : null,
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

  return (
    <>
      <Overlay toggle={toggle} setToggle={setToggle} />
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
            <IoClose size={26} className="cursor-pointer" onClick={setToggle} />
          </div>

          <div className="space-y-4">
            

           

            <FormControl
              type="text"
              placeHolder="Nhập tên"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="name"
              label="Tên User"
              labelStyle="mb-1 font-serif"
              value={fields.name}
              onChange={(event) => handleFieldsChange("name", event.target.value)}
              onType={() => handleFieldsType("name")}
              onBlur={() =>
                isEmpty(fields.name) && handleFieldsBlur("name", "Tên User là bắt buộc")
              }
              hasError={!!errors?.name}
              errorMessage={errors?.name}
              disabled={isDisabled}
            />

        
         
            <FormControl
              type="text"
              placeHolder="Nhập số điện thoại"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="phone"
              label="Số điện thoại"
              labelStyle="mb-1 font-serif"
              value={fields.phone}
              onChange={(event) => handleFieldsChange("phone", event.target.value)}
              onType={() => handleFieldsType("phone")}
              disabled={isDisabled}
            />
            
            <FormControl
              type="text"
              placeHolder="Nhập email"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="email"
              label="Tên Email"
              labelStyle="mb-1 font-serif"
              value={fields.email}
              onChange={(event) => handleFieldsChange("email", event.target.value)}
              onType={() => handleFieldsType("email")}
              onBlur={() =>
                isEmpty(fields.email) && handleFieldsBlur("email", "Email là bắt buộc")
              }
              hasError={!!errors?.email}
              errorMessage={errors?.email}
              disabled={isDisabled}
            />
             <FormControl
              type="text"
              placeHolder="Nhập password"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="password"
              label="Password"
              labelStyle="mb-1 font-serif"
              value={fields.password}
              onChange={(event) => handleFieldsChange("password", event.target.value)}
              onType={() => handleFieldsType("password")}
              onBlur={() =>
                isEmpty(fields.password) && handleFieldsBlur("password", "Password là bắt buộc")
              }
              hasError={!!errors?.password}
              errorMessage={errors?.password}
              disabled={isDisabled}
            />
            

            
            <FormControl
  type="select"
  wrapInputStyle=""
  inputStyle="placeholder:text-lg text-black placeholder:font-serif"
  hasLabel
  id="role"
  label="Vai trò"
  labelStyle="mb-1 font-serif"
  value={fields.role || ""}
  onChange={(event) => handleFieldsChange("role", event.target.value)}
  onType={() => handleFieldsType("role")}
  onBlur={() =>
    isEmpty(fields.role) && handleFieldsBlur("role", "Vai trò là bắt buộc")
  }
  hasError={!!errors?.role}
  errorMessage={errors?.role}
  disabled={isDisabled}
  options={[
    { value: "", label: "Chọn vai trò" },
    ...(Array.isArray(roles) ? roles : []).map((role) => ({
      value: String(role.id),
      label: role.name,
    })),
  ]}
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
                  Hủy
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
                Đóng
              </button>
            )}
          </div>
        </form>
      </section>
    </>
  );
};

export default Form;