import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { isEmpty } from "../../../Utils/validation.js";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import ConfirmPopup from "../../../Components/ConfirmPopup/index.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../../../Components/Toast/index.jsx";
import UserService from "../../../Services/user";
import * as XLSX from "xlsx";
import { usePayment } from "../../../Contexts/Payment/index.jsx";
import PaymentService from "../../../Services/payment/index.jsx";

const FormControl = React.lazy(() =>
  import("../../../Components/FormControl/index.jsx")
);
const Loading = React.lazy(() => import("../../../Components/Loading/index.jsx"));

const PaymentOwner = () => {
  const [searchInput, setSearchInput] = useState("");
  const [errors, setErrors] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const {currentStorePayments, fetchPaymentsByCurrentStore, loading} = usePayment();
  const [editOrder, setEditOrder] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const initData = async()=> {
      console.log("Current store payments:", currentStorePayments);
      await fetchPaymentsByCurrentStore();
    }
    initData();
  }, []);

  const columns = [
    {
      name: "Payment Time",
      sortable: true,
      selector: (row) => row.payment_date,
    },
    {
      name: "Appointment",
      sortable: true,
      selector: (row) => row.appointment.id,
    },
    {
      name: "Total Price",
      sortable: true,
      selector: (row) => row.price,
    },
    {
      name: "Actions",
      center: true,
      cell: (row) => (
        <div className='flex gap-2'>
          <FaRegEdit
            className={`cursor-pointer ${row.status === ("Completed"||"Canceled") ? "text-gray-400 pointer-events-none" : "text-black"}`}
            size={18}
            onClick={() => {}}
          />
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  const handleFieldsChange = (key, value) => {
    setSearchInput(value);
  };

  const handleRowClicked = (row) => {
    setSelectedRow(row);
  };

  const handleActionsClicked = () => {
    setShowActions(!showActions);
  };

  const handleImport = () => {
    alert("Developing.");
  };

  const handleExport = () => {
    alert("Developing.");
  };

  // const filteredData = usersData.filter((user) =>
  //   user.name.toLowerCase().includes(searchInput.toLowerCase())
  // );

  return (
    <>
      <section>
        <div>
          <header className='bg-white rounded-md p-4 flex items-center justify-between shadow-md'>
            <div className='min-w-fit max-w-md'>
              <FormControl
                type='text'
                placeHolder='Search here...'
                wrapInputStyle='!border-black/10 rounded-md focus-within:!border-[#435d63] transition-all'
                inputStyle='font-serif placeholder:text-lg text-black placeholder:font-serif !p-4 !py-2'
                id='search'
                onChange={(event) =>
                  handleFieldsChange("search", event.target.value)
                }
                hasButton
                Icon={CiSearch}
                iconSize={24}
                iconStyle='transition-all text-[#435d63] hover:text-black mx-4'
                hasError={errors?.searchInput}
                errorMessage={errors?.searchInput}
              />
            </div>

            <div className='relative'>
              <button
                type='button'
                className='text-sm rounded-md w-fit transition-all duration-700 hover:bg-black text-white bg-[#435d63] p-2 font-serif font-semibold'
                onClick={handleActionsClicked}>
                <p>Action</p>
              </button>
              {showActions && (
                <div className='overflow-hidden absolute z-10 top-full right-0 rounded-md bg-white w-fit shadow-md'>
                  <button
                    className='p-2 px-4 hover:bg-black/10 w-full'
                    onClick={handleExport}>
                    Export
                  </button>
                  <button
                    className='p-2 px-4 hover:bg-black/10 w-full'
                    onClick={handleImport}>
                    Import
                  </button>
                </div>
              )}
            </div>
          </header>

          <main className='mt-4 rounded-md shadow-md overflow-hidden'>
            {loading ? (
              <Loading />
            ) : (
              <DataTable
                customStyles={{
                  subHeader: {
                    style: { padding: "0", margin: "0", minHeight: "0" },
                  },
                }}
                pointerOnHover
                highlightOnHover
                selectableRows
                striped
                pagination
                subHeader={selectedRows.length > 0}
                columns={columns}
                data={currentStorePayments}
                onRowClicked={handleRowClicked}
              />
            )}
          </main>
        </div>
      </section>

      <ToastContainer />
    </>
  );
};

export default PaymentOwner;
