import React, { useState, useEffect, lazy } from "react";
import { IoClose } from "react-icons/io5";
import { isEmpty } from "../../../../Utils/validation";
import { showToast } from "../../../../Components/Toast";
import DiscountService from "../../../../Services/discount";
import StoreService from "../../../../Services/store";
const FormControl = lazy(() => import("../../../../Components/FormControl"));
const Overlay = lazy(() => import("../../../../Components/Overlay"));
const Loading = lazy(() => import("../../../../Components/Loading"));

const Form = ({
  toggle,
  setToggle,
  initialData,
  onSubmit,
  isDisabled = false,
}) => {
  const [fields, setFields] = useState({
    code: "",
    description: "",
    value: "",
    store_id: "",
  });
  const [stores, setStores] = useState([]);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  useEffect(() => {
    // Fetch danh sách store
    const fetchStores = async () => {
      try {
        const response = await StoreService.getStoreBylogin();
        const storesData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setStores(storesData);
      } catch (error) {
        setStores([]); // Đảm bảo luôn là mảng khi lỗi
        showToast("Không thể tải danh sách cửa hàng", "error");
      }
    };
    fetchStores();

    if (initialData) {
  setFields({
    code: initialData.code || "",
    description: initialData.description || "",
    value: initialData.value || "",
    store_id: String(initialData.store_id || initialData.store?.id || ""),
  });
} else {
  setFields({
    code: "",
    description: "",
    value: "",
    store_id: "",
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
    if (isEmpty(fields.code)) newErrors.code = "Mã giảm giá là bắt buộc";
    if (isEmpty(fields.value)) newErrors.value = "Giá trị là bắt buộc";
    if (isEmpty(fields.store_id)) newErrors.store_id = "Cửa hàng là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled || !validateForm() || pending) return;

    setPending(true);
    try {
      const data = {
        code: fields.code,
        description: fields.description,
        value: parseFloat(fields.value),
        store: { id: parseInt(fields.store_id, 10) },
      };

      let response;
      if (initialData) {
        response = await DiscountService.updateDiscount(initialData.id, data);
      } else {
        response = await DiscountService.createDiscount(data);
      }

      if (response && response.data) {
        onSubmit(response.data);
        setToggle(false);
      }
    } catch (error) {
      showToast("Lỗi khi lưu mã giảm giá", "error");
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
                ? "Thông tin mã giảm giá"
                : initialData
                ? "Chỉnh sửa mã giảm giá"
                : "Tạo mã giảm giá"}
            </p>
            <IoClose size={26} className="cursor-pointer" onClick={setToggle} />
          </div>

          <div className="space-y-4">
            <FormControl
              type="text"
              placeHolder="Nhập mã giảm giá"
              hasLabel
              id="code"
              label="Mã giảm giá"
              value={fields.code}
              onChange={(event) =>
                handleFieldsChange("code", event.target.value)
              }
              hasError={!!errors?.code}
              errorMessage={errors?.code}
              disabled={isDisabled}
            />

            <FormControl
              type="textarea"
              placeHolder="Nhập mô tả"
              hasLabel
              id="description"
              label="Mô tả"
              value={fields.description}
              onChange={(event) =>
                handleFieldsChange("description", event.target.value)
              }
              disabled={isDisabled}
            />

            <FormControl
              type="number"
              placeHolder="Nhập giá trị (%)"
              hasLabel
              id="value"
              label="Giá trị (%)"
              value={fields.value}
              onChange={(event) =>
                handleFieldsChange("value", event.target.value)
              }
              hasError={!!errors?.value}
              errorMessage={errors?.value}
              disabled={isDisabled}
            />

                        <FormControl
              type={isDisabled ? "text" : "select"}
              placeHolder={isDisabled ? "" : "Chọn cửa hàng"}
              hasLabel
              id="store_id"
              label="Cửa hàng"
              value={
                isDisabled && stores.length > 0
                  ? stores.find((s) => String(s.id) === String(fields.store_id))?.name || ""
                  : fields.store_id
              }
              onChange={(event) =>
                handleFieldsChange("store_id", event.target.value)
              }
              hasError={!!errors?.store_id}
              errorMessage={errors?.store_id}
              disabled={isDisabled}
              options={
                isDisabled
                  ? undefined
                  : [
                      { value: "", label: "Chọn cửa hàng" },
                      ...stores.map((store) => ({
                        value: store.id,
                        label: store.name,
                      })),
                    ]
              }
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
