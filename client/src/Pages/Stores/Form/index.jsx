import React, { useState, useEffect } from "react";
import { isEmpty } from "../../../Utils/validation";
import { IoClose } from "react-icons/io5";
import { showToast } from "../../../Components/Toast";
import StoreService from "../../../Services/store";
import UserService from "../../../Services/user";

const FormControl = React.lazy(() => import("../../../Components/FormControl"));
const Overlay = React.lazy(() => import("../../../Components/Overlay"));
const Loading = React.lazy(() => import("../../../Components/Loading"));

const Form = ({ toggle, setToggle, initialData, onSubmit, isDisabled = false }) => {
  const [fields, setFields] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    createdAt: "",
    updateAt: "",
    openTime: "",
    closeTime: "",
    ownerId:  "" ,
    status: "",
    image: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFields({
        name: initialData.name || "",
        description: initialData.description || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        createdAt: initialData.createdAt || "",
        updateAt: initialData.updateAt || "",
        openTime: initialData.openTime || "",
        closeTime: initialData.closeTime || "",

        ownerId: initialData.ownerId.id || "",
        status: initialData.status || "",
        image: initialData.image || "",
      });

    } else {
      setFields({
        name: "",
        description: "",
        address: "",
        phone: "",
        createdAt: "",
        updateAt: "",
        openTime: "",

        closeTime: "",
        ownerId: "",
        status: "",
        image: "",
      });
    }
  }, [initialData]);
 console.log("name:" + fields.ownerId.id)
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await UserService.getUsersByRoleId(2);
        const ownersData = response.data;
        setOwners(Array.isArray(ownersData) ? ownersData : []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chủ cửa hàng:", error);
        showToast("Không thể tải danh sách chủ cửa hàng", "error");
        setOwners([]);
      }
    };
    fetchOwners();
  }, []);
  const handleFieldsChange = (key, value) => {
    if (!isDisabled) {
      if (key === "ownerId") {
        console.log("Selected ownerId value:", value);
        setFields((prev) => ({ ...prev, ownerId: value })); 
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
    if (isEmpty(fields.status)) newErrors.status = "Trạng thái là bắt buộc";
    // if (isEmpty(fields.ownerId.id)) newErrors.ownerId = "Chủ cửa hàng là bắt buộc";
    if (isEmpty(fields.openTime)) newErrors.openTime = "Giờ mở cửa là bắt buộc";
    if (isEmpty(fields.closeTime)) newErrors.closeTime = "Giờ đóng cửa là bắt buộc";
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
        description: fields.description,
        address: fields.address,
        phone: fields.phone,
        createdAt: null,
        updateAt: null,
        openTime: fields.openTime,
        closeTime: fields.closeTime,
        ownerId: fields.ownerId ? { id: Number(fields.ownerId) } : null,
        status: fields.status,
        image: fields.image || undefined,
      };
      console.log("data1: "+data );

      let response;
      if (initialData) {
        response = await StoreService.updateStore(initialData.id, data);
      } else {
        response = await StoreService.createStore(data);
      }

      if (response && response.data) {
        onSubmit(response.data);
        showToast(initialData ? "Cập nhật thành công" : "Tạo thành công", "success");
        setToggle(false);
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      showToast(
        "Lỗi khi lưu: " + (error.response?.data?.message || error.message),
        "error"
      );
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
                ? "Thông tin cửa hàng"
                : initialData
                ? "Chỉnh sửa cửa hàng"
                : "Tạo cửa hàng"}
            </p>
            <IoClose size={26} className="cursor-pointer" onClick={setToggle} />
          </div>

          <div className="space-y-4">
            {!isDisabled && (
              <div>
                <label className="block mb-1 font-serif font-medium">Ảnh cửa hàng</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                  disabled={isDisabled}
                />
              </div>
            )}

            {fields.image && (
              <div className="mt-4">
                <label className="block mb-1 font-serif font-medium">Xem trước ảnh</label>
                <img
                  src={file ? URL.createObjectURL(file) : fields.image}
                  alt={fields.name || "Store Image"}
                  className="w-32 h-32 object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = "/src/assets/stores/default.jpg";
              
                  }}
                />
              </div>
            )}

            <FormControl
              type="text"
              placeHolder="Nhập tên cửa hàng"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="name"
              label="Tên cửa hàng"
              labelStyle="mb-1 font-serif"
              value={fields.name}
              onChange={(event) => handleFieldsChange("name", event.target.value)}
              onType={() => handleFieldsType("name")}
              onBlur={() =>
                isEmpty(fields.name) && handleFieldsBlur("name", "Tên cửa hàng là bắt buộc")
              }
              hasError={!!errors?.name}
              errorMessage={errors?.name}
              disabled={isDisabled}
            />

            <FormControl
              type="textarea"
              placeHolder="Nhập mô tả"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="description"
              label="Mô tả"
              labelStyle="mb-1 font-serif"
              value={fields.description}
              onChange={(event) => handleFieldsChange("description", event.target.value)}
              onType={() => handleFieldsType("description")}
              disabled={isDisabled}
            />

            <FormControl
              type="text"
              placeHolder="Nhập địa chỉ"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="address"
              label="Địa chỉ"
              labelStyle="mb-1 font-serif"
              value={fields.address}
              onChange={(event) => handleFieldsChange("address", event.target.value)}
              onType={() => handleFieldsType("address")}
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
              type="time"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="openTime"
              label="Giờ mở cửa"
              labelStyle="mb-1 font-serif"
              value={fields.openTime}
              onChange={(event) => handleFieldsChange("openTime", event.target.value)}
              onType={() => handleFieldsType("openTime")}
              onBlur={() =>
                isEmpty(fields.openTime) &&
                handleFieldsBlur("openTime", "Giờ mở cửa là bắt buộc")
              }
              hasError={!!errors?.openTime}
              errorMessage={errors?.ートopenTime}
              disabled={isDisabled}
            />

            <FormControl
              type="time"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="closeTime"
              label="Giờ đóng cửa"
              labelStyle="mb-1 font-serif"
              value={fields.closeTime}
              onChange={(event) => handleFieldsChange("closeTime", event.target.value)}
              onType={() => handleFieldsType("closeTime")}
              onBlur={() =>
                isEmpty(fields.closeTime) &&
                handleFieldsBlur("closeTime", "Giờ đóng cửa là bắt buộc")
              }
              hasError={!!errors?.closeTime}
              errorMessage={errors?.closeTime}
              disabled={isDisabled}
            />
<FormControl
  type="select"
  wrapInputStyle=""
  inputStyle="placeholder:text-lg text-black placeholder:font-serif"
  hasLabel
  id="ownerId"
  label="Chủ cửa hàng"
  labelStyle="mb-1 font-serif"
  value={fields.ownerId || ""} 
  onChange={(event) => handleFieldsChange("ownerId", event.target.value)}
  onType={() => handleFieldsType("ownerId")}
  onBlur={() =>
    isEmpty(fields.ownerId) &&
    handleFieldsBlur("ownerId", "Chủ cửa hàng là bắt buộc")
  }
  hasError={!!errors?.ownerId}
  errorMessage={errors?.ownerId}
  disabled={isDisabled}
  options={[
    { value: "", label: "Chọn chủ cửa hàng" },
    ...(Array.isArray(owners) ? owners : []).map((owner) => ({
      value: String(owner.id),
      label: owner.name,
    })),
  ]}
/>
            <FormControl
              type="select"
              wrapInputStyle=""
              inputStyle="placeholder:text-lg text-black placeholder:font-serif"
              hasLabel
              id="status"
              label="Trạng thái"
              labelStyle="mb-1 font-serif"
              value={fields.status}
              onChange={(event) => handleFieldsChange("status", event.target.value)}
              onType={() => handleFieldsType("status")}
              onBlur={() =>
                isEmpty(fields.status) &&
                handleFieldsBlur("status", "Trạng thái là bắt buộc")
              }
              hasError={!!errors?.status}
              errorMessage={errors?.status}
              disabled={isDisabled}
              options={[
                { value: "", label: "Chọn trạng thái" },
                { value: "1", label: "Active" },
                { value: "2", label: "Inactive" },
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