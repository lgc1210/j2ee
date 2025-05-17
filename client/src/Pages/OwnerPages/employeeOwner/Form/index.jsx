import React, { useState, useEffect } from "react";
import { isEmpty } from "../../../../Utils/validation";
import { IoClose } from "react-icons/io5";
import { showToast } from "../../../../Components/Toast";
import StaffService from "../../../../Services/staff";
import ServiceService from "../../../../Services/service";
import StoreService from "../../../../Services/store";
const FormControl = React.lazy(() =>
  import("../../../../Components/FormControl")
);
const Overlay = React.lazy(() => import("../../../../Components/Overlay"));
const Loading = React.lazy(() => import("../../../../Components/Loading"));

const Form = ({
  toggle,
  setToggle,
  initialData,
  onSubmit,
  isDisabled = false,
}) => {
  const [fields, setFields] = useState({
    name: "",
    service: "",
    status: "",
    store: "",
    email: "",
    phone: "",
    password: "",
    role: "0",
  });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [currentStoreId, setCurrentStoreId] = useState("");
  const [currentStoreName, setCurrentStoreName] = useState("");
  const [servicesOfStore, setServicesOfStore] = useState([]);

  useEffect(() => {
    const fetchStoreAndServices = async () => {
      try {
        const storeRes = await StoreService.getStoreBylogin();
        const store = storeRes.data;
        setCurrentStoreId(store.id?.toString() || "");
        setCurrentStoreName(store.name || "");

        const servicesRes = await ServiceService.getAllServices();
        const allServices = servicesRes.data || [];
        const filteredServices = allServices.filter(
          (sv) => sv.store?.id?.toString() === store.id?.toString()
        );
        setServicesOfStore(filteredServices);

        if (!initialData) {
          setFields((prev) => ({
            ...prev,
            store: store.id?.toString() || "",
          }));
        }
      } catch (error) {
        setCurrentStoreId("");
        setCurrentStoreName("");
        setServicesOfStore([]);
      }
    };

    fetchStoreAndServices();
  }, [initialData]);
  useEffect(() => {
    if (!toggle) {
      setFields({
        name: "",
        service: "",
        status: "",
        email: "",
        phone: "",
        password: "",
        role: "0",
      });
      setErrors({});
      setPending(false);
      setShowPassword(false);
    }
  }, [toggle]);
  useEffect(() => {
    if (initialData && currentStoreId) {
      setFields({
        name: initialData.staff?.name || initialData.name || "",
        service: initialData.service?.id?.toString() || "",
        status: initialData.status || "",
        store: initialData.store?.id?.toString() || currentStoreId,
        email: initialData.staff?.email || "",
        phone: initialData.staff?.phone || "",
        password: "",
        role: "0",
      });
    }
  }, [initialData, currentStoreId]);

  const handleFieldsChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (isEmpty(fields.name)) newErrors.name = "Tên nhân viên là bắt buộc";
    if (isEmpty(fields.store)) newErrors.store = "Cửa hàng là bắt buộc";
    if (isEmpty(fields.service)) newErrors.service = "Dịch vụ là bắt buộc";
    if (!initialData) {
      if (isEmpty(fields.email)) newErrors.email = "Email là bắt buộc";
      if (isEmpty(fields.phone)) newErrors.phone = "Số điện thoại là bắt buộc";
      if (isEmpty(fields.password)) newErrors.password = "Mật khẩu là bắt buộc";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled || !validateForm() || pending) return;

    setPending(true);
    try {
      let data;
      if (initialData) {
        data = {
          service: { id: parseInt(fields.service, 10) },
          status: fields.status,
          store: { id: parseInt(fields.store, 10) },
          staff: {
            name: fields.name,
            phone: fields.phone,
          },
        };
      } else {
        data = {
          status: fields.status,
          store: { id: parseInt(fields.store, 10) },
          service: { id: parseInt(fields.service, 10) },
          staff: {
            name: fields.name,
            email: fields.email,
            phone: fields.phone,
            password: fields.password,
            role: { id: 0 },
          },
        };
      }

      let response;
      if (initialData) {
        response = await StaffService.updateStaff(initialData.id, data);
      } else {
        response = await StaffService.createStaff(data);
      }

      if (response && response.data) {
        onSubmit(response.data);
        setToggle(false);
      }
    } catch (error) {
      showToast("Lỗi khi lưu nhân viên", "error");
      console.error("Lỗi khi lưu:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Overlay toggle={toggle} setToggle={setToggle} />
      <section
        className={`${
          toggle
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } fixed inset-0 z-40 flex justify-center pt-8 pb-4 overflow-y-auto`}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white max-w-md w-full rounded p-6 min-h-fit"
        >
          <div className="flex items-center justify-between w-full mb-4">
            <p className="font-semibold text-lg">
              {isDisabled
                ? "Thông tin nhân viên"
                : initialData
                ? "Chỉnh sửa nhân viên"
                : "Tạo nhân viên"}
            </p>
            <IoClose size={26} className="cursor-pointer" onClick={setToggle} />
          </div>

          <div className="space-y-4">
            {/* Tên nhân viên: luôn cho sửa */}
            <FormControl
              type="text"
              placeHolder="Nhập tên nhân viên"
              hasLabel
              id="name"
              label="Tên nhân viên"
              value={fields.name}
              onChange={(event) =>
                handleFieldsChange("name", event.target.value)
              }
              hasError={!!errors?.name}
              errorMessage={errors?.name}
              disabled={isDisabled}
            />

            {/* Số điện thoại: chỉ cho sửa khi edit, thêm mới thì nằm trong block dưới */}
            {initialData && (
              <FormControl
                type="text"
                placeHolder="Nhập số điện thoại"
                hasLabel
                id="phone"
                label="Số điện thoại"
                value={fields.phone}
                onChange={(event) =>
                  handleFieldsChange("phone", event.target.value)
                }
                hasError={!!errors?.phone}
                errorMessage={errors?.phone}
                disabled={isDisabled}
              />
            )}

            {/* Các trường tài khoản chỉ hiện khi thêm mới */}
            {!initialData && (
              <>
                <FormControl
                  type="email"
                  placeHolder="Nhập email"
                  hasLabel
                  id="email"
                  label="Email"
                  value={fields.email}
                  onChange={(event) =>
                    handleFieldsChange("email", event.target.value)
                  }
                  hasError={!!errors?.email}
                  errorMessage={errors?.email}
                  disabled={isDisabled}
                />
                <FormControl
                  type="text"
                  placeHolder="Nhập số điện thoại"
                  hasLabel
                  id="phone"
                  label="Số điện thoại"
                  value={fields.phone}
                  onChange={(event) =>
                    handleFieldsChange("phone", event.target.value)
                  }
                  hasError={!!errors?.phone}
                  errorMessage={errors?.phone}
                  disabled={isDisabled}
                />
                <div className="relative">
                  <FormControl
                    type={showPassword ? "text" : "password"}
                    placeHolder="Nhập mật khẩu"
                    hasLabel
                    id="password"
                    label="Mật khẩu"
                    value={fields.password}
                    onChange={(event) =>
                      handleFieldsChange("password", event.target.value)
                    }
                    hasError={!!errors?.password}
                    errorMessage={errors?.password}
                    disabled={isDisabled}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-sm text-blue-600"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
                <FormControl
                  type="select"
                  placeHolder="Chọn vai trò"
                  hasLabel
                  id="role"
                  label="Vai trò"
                  value="0"
                  disabled={true}
                  options={[{ value: "0", label: "Nhân viên" }]}
                />
                <FormControl
                  type="select"
                  placeHolder="Chọn cửa hàng"
                  hasLabel
                  id="store"
                  label="Cửa hàng"
                  value={currentStoreId ? currentStoreId.toString() : ""}
                  onChange={() => {}}
                  hasError={!!errors?.store}
                  errorMessage={errors?.store}
                  disabled={true}
                  options={[
                    {
                      value: currentStoreId,
                      label: currentStoreName || `Cửa hàng ${currentStoreId}`,
                    },
                  ]}
                />
              </>
            )}

            {/* Dịch vụ: luôn cho sửa */}
            <FormControl
              type="select"
              placeHolder="Chọn dịch vụ"
              hasLabel
              id="service"
              label="Dịch vụ"
              value={fields.service || ""}
              onChange={(event) =>
                handleFieldsChange("service", event.target.value)
              }
              hasError={!!errors?.service}
              errorMessage={errors?.service}
              disabled={isDisabled}
              options={servicesOfStore.map((service) => ({
                value: service.id,
                label: service.name,
              }))}
            />

            {/* Trạng thái: luôn cho sửa */}
            <FormControl
              type="select"
              placeHolder="Chọn trạng thái"
              hasLabel
              id="status"
              label="Trạng thái"
              value={fields.status || ""}
              onChange={(event) =>
                handleFieldsChange("status", event.target.value)
              }
              disabled={isDisabled}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
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
