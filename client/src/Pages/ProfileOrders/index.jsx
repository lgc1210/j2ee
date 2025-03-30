import React from "react";
import DataTable from "react-data-table-component";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";

const Loading = React.lazy(() => import("../../Components/Loading"));

const TABS = {
  ALL: "ALL",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

const columns = [
  {
    name: "Title",
    sortable: true,
    selector: (row) => row.title,
  },
  {
    name: "Year",
    sortable: true,
    selector: (row) => row.year,
  },
];

const data = [
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
];

const SubHeader = ({ selectedRows }) => {
  if (selectedRows.length === 0) {
    return null;
  }

  return (
    <div className='w-full p-5 bg-gray-100 flex items-center justify-between'>
      <span>{selectedRows.length} items selected</span>
      <button>
        <IoTrashOutline
          size={36}
          className='cursor-pointer rounded-full bg-red-100 hover:bg-red-200 text-red-500 p-2'
        />
      </button>
    </div>
  );
};

const ProfileOrders = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const [errors, setErrors] = React.useState("");
  const [showActions, setShowActions] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [tab, setTab] = React.useState(TABS["ALL"]);

  const handleFieldsChange = (key, value) => {};

  const handleFieldsType = (key) => {};

  const handelFieldsBlur = (key, message) => {};

  const handleActionsClicked = () => {
    setShowActions(!showActions);
  };

  const handleRowsSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const handleImport = () => {};

  const handleExport = () => {};

  const handleCreate = () => {};

  const handleTabSelected = (tab) => {
    setTab(tab);
  };

  return (
    <React.Suspense
      fallback={
        <Loading
          size='h-16 w-16'
          customStyle='w-full h-screen flex flex-col items-center justify-center'
          hasLoadingText
        />
      }>
      <section className='flex-grow bg-white rounded-md shadow-md p-4'>
        <div className=''>
          <div className='mb-6'>
            <p className='font-bold'>Order History</p>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <span className='flex items-center justify-start gap-10'>
                <p
                  className={`cursor-pointer text-black/60 hover:text-[#274b609f] ${
                    TABS["ALL"] === tab ? "!text-[#274b609f] font-semibold" : ""
                  }`}
                  onClick={() => handleTabSelected(TABS["ALL"])}>
                  All Order(50)
                </p>
                <p
                  className={`cursor-pointer text-black/60 hover:text-[#274b609f] ${
                    TABS["PENDING"] === tab
                      ? "!text-[#274b609f] font-semibold"
                      : ""
                  }`}
                  onClick={() => handleTabSelected(TABS["PENDING"])}>
                  Pending(10)
                </p>
                <p
                  className={`cursor-pointer text-black/60 hover:text-[#274b609f] ${
                    TABS["COMPLETED"] === tab
                      ? "!text-[#274b609f] font-semibold"
                      : ""
                  }`}
                  onClick={() => handleTabSelected(TABS["COMPLETED"])}>
                  Completed(8)
                </p>
                <p
                  className={`cursor-pointer text-black/60 hover:text-[#274b609f] ${
                    TABS["CANCELLED"] === tab
                      ? "!text-[#274b609f] font-semibold"
                      : ""
                  }`}
                  onClick={() => handleTabSelected(TABS["CANCELLED"])}>
                  Cancelled(22)
                </p>
              </span>
              <span></span>
            </div>
            {/* Personal Information */}
            <div className='p-4 rounded-md border border-black/10'>
              <DataTable
                customStyles={{
                  subHeader: {
                    style: { padding: "0", margin: "0", minHeight: "0" },
                  },
                }}
                pointerOnHover
                highlightOnHover
                striped
                pagination
                onSelectedRowsChange={handleRowsSelected}
                subHeader={selectedRows.length ? true : false}
                subHeaderComponent={<SubHeader selectedRows={selectedRows} />}
                columns={columns}
                data={data}
              />
            </div>
          </div>
        </div>
      </section>
    </React.Suspense>
  );
};

export default ProfileOrders;
