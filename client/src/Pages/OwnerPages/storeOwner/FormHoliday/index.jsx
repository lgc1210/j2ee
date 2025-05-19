import React, { useEffect, useState } from "react";
import { Calendar, ConfigProvider, Tooltip } from "antd";
import "antd/dist/reset.css";
import StoreService from "../../../../Services/store";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { showToast } from "../../../../Components/Toast";
dayjs.extend(isSameOrAfter);
const FormHoliday = ({ open, onClose, store, onSubmit }) => {
  const [holidays, setHolidays] = useState([]); 
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (store) {
      StoreService.getHolidaybyStore().then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setHolidays(
          data.filter((h) => h.store && String(h.store.id) === String(store.id))
        );
      });
    }
  }, [store, open]);

  const handleAddHoliday = async () => {
    const dateStr = selectedDate.format("YYYY-MM-DD");
    if (!dateStr || holidays.some((h) => h.date === dateStr)) return;
    const payload = {
      date: dateStr,
      description,
      store: { id: store.id },
    };
    try {
      const res = await StoreService.createHoliday(payload);
      setHolidays([...holidays, res.data]);
      setDescription("");
      if (onSubmit) onSubmit(store, dateStr);
    } catch (e) {
      console.error("Lỗi khi thêm ngày nghỉ:", e?.response?.data || e);
    }
  };

  const today = dayjs().startOf("day");
  const filteredHolidays = holidays.filter((h) =>
    dayjs(h.date).isSameOrAfter(today)
  );

  const handleDeleteHoliday = async (holidayId) => {
    try {
      await StoreService.deleteHoliday(holidayId);
      setHolidays((prev) => prev.filter((h) => h.id !== holidayId));
      showToast("Xóa ngày nghỉ thành công", "success");
    } catch (e) {
      console.error("Lỗi khi xóa ngày nghỉ:", e?.response?.data || e);
    }
  };

 
  const dateFullCellRender = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    const holiday = filteredHolidays.find((h) => h.date === dateStr);
    const isHoliday = !!holiday;
    const isSelected =
      selectedDate && dateStr === selectedDate.format("YYYY-MM-DD");

    const cell = (
      <div
        style={{
          textAlign: "center",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          border: "1px solid rgb(250, 250, 250)",
          background: "rgb(245, 245, 245)",
          ...(isHoliday && {
            background: "#ffcccc",
            border: "1px solid #ff0000",
            margin: "auto",
            position: "relative",
          }),
          ...(isSelected && {
            background: "#fff",
            border: "1px solid #ccc",
            margin: "auto",
            position: "relative",
          }),
        }}
      >
        {date.date()}
      </div>
    );

    
    return isHoliday ? (
      <Tooltip
        title={
          <div>
            <b>{holiday.description || "Không có mô tả"}</b>
            <br />
            {holiday.date}
            <br />
            <button
              style={{
                marginTop: 8,
                color: "white",
                background: "#e53e3e",
                border: "none",
                borderRadius: 4,
                padding: "2px 8px",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteHoliday(holiday.id);
              }}
            >
              Xóa
            </button>
          </div>
        }
      >
        {cell}
      </Tooltip>
    ) : (
      cell
    );
  };

  if (!open || !store) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded"
        style={{
          width: 1020,
          height: 570,
          margin: "0 auto",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <h2 className="font-bold mb-4 text-xl text-center w-full">
          Lịch nghỉ của {store.name}
        </h2>
        <ConfigProvider
          theme={{
            components: {
              Calendar: {
                colorBgContainer: "#f5f5f5",
                colorBgHeader: "#333",
                colorTextHeading: "#fff",
                fullPanelHeaderTextAlign: "center",
                fullPanelHeaderPadding: "8px 0",
              },
            },
          }}
        >
          <div style={{ width: "100%", maxWidth: 950 }}>
            <Calendar
              value={selectedDate}
              onSelect={setSelectedDate}
              fullCellRender={dateFullCellRender}
              className="custom-calendar"
            />
          </div>
        </ConfigProvider>
        <div className="mt-4 flex gap-2 w-full">
          <input
            type="text"
            placeholder="Mô tả ngày nghỉ"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddHoliday}
          >
            Thêm ngày nghỉ
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormHoliday;
