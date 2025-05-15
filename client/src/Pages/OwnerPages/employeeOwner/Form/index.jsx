import React, { useState, useEffect } from "react";
import { isEmpty } from "../../../../Utils/validation";
import { IoClose } from "react-icons/io5";
import { showToast } from "../../../../Components/Toast";
import StaffService from "../../../../Services/staff";

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
  });
  const [stores, setStores] = useState([]);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  useEffect(() => {
    

    // Nếu có dữ liệu ban đầu (chỉnh sửa staff)
    if (initialData) {
      setFields({
        name: initialData.name || "",
        service: initialData.service?.id || "",
        status: initialData.status || "",
        store: initialData.store?.id || "",
      });
    }
  }, [initialData]);

  const handleFieldsChange = (key, value) => {
    if (!isDisabled) {
      setFields((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (isEmpty(fields.name)) newErrors.name = "Tên nhân viên là bắt buộc";
    if (isEmpty(fields.store)) newErrors.store = "Cửa hàng là bắt buộc";
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
        service: { id: parseInt(fields.service, 10) },
        status: fields.status,
        store: { id: parseInt(fields.store, 10) },
      };

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
      console.error("Lỗi khi lưu:", error);
      showToast("Lỗi khi lưu nhân viên", "error");
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
              options={[
                { value: "1", label: "Dịch vụ 1" },
                { value: "2", label: "Dịch vụ 2" },
                { value: "3", label: "Dịch vụ 3" },
              ]}
            />
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
            <FormControl
              type="select"
              placeHolder="Chọn cửa hàng"
              hasLabel
              id="store"
              label="Cửa hàng"
              value={fields.store || ""}
              onChange={(event) =>
                handleFieldsChange("store", event.target.value)
              }
              hasError={!!errors?.store}
              errorMessage={errors?.store}
              disabled={isDisabled}
              options={[
                ...stores.map((store) => ({
                  value: store.id,
                  label: store.name,
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