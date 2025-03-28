import React from "react";
import DataTable from "react-data-table-component";
import { isEmpty } from "../../Utils/validation.js";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";

const FormControl = React.lazy(() => import("../../Components/FormControl"));
const Loading = React.lazy(() => import("../../Components/Loading"));

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
  {
    name: "Actions",
    center: true,
    selector: (row) => <FaRegEdit className='cursor-pointer' size={18} />,
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

const SelectBox = React.forwardRef(({ ...props }) => {
  return (
    <input
      type='checkbox'
      {...props}
      className='w-4 h-4 text-[#435d63] bg-[#435d63] border-gray-200 rounded focus:ring-[#435d63]'
    />
  );
});

const Users = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const [errors, setErrors] = React.useState("");
  const [showActions, setShowActions] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);

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

  return (
    <section>
      <div>
        {/* Header */}
        <header className='bg-white rounded-md p-4 flex items-center justify-between shadow-md'>
          {/* Search */}
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
              onType={() => handleFieldsType("search")}
              onBlur={() => {}}
              hasError={errors?.searchInput}
              errorMessage={errors?.searchInput}
            />
          </div>

          {/* Actions */}
          <div className='relative'>
            <button
              type='submit'
              className='text-sm rounded-md w-fit transition-all duration-700 hover:bg-black text-white bg-[#435d63] p-2 font-serif font-semibold'
              onClick={handleActionsClicked}>
              <p>Actions</p>
            </button>
            {/* Action list will be shown here */}
            {showActions && (
              <div className='overflow-hidden absolute z-10 top-full right-0 rounded-md bg-white w-fit shadow-md'>
                <button
                  className='p-2 px-4 hover:bg-black/10 w-full'
                  onClick={handleImport}>
                  Import
                </button>
                <button
                  className='p-2 px-4 hover:bg-black/10 w-full'
                  onClick={handleExport}>
                  Export
                </button>
              </div>
            )}
          </div>
        </header>

        <main className='mt-4 rounded-md shadow-md overflow-hidden'>
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
            onSelectedRowsChange={handleRowsSelected}
            subHeader={selectedRows.length ? true : false}
            subHeaderComponent={<SubHeader selectedRows={selectedRows} />}
            columns={columns}
            data={data}
            selectableRowsComponent={SelectBox}
            selectableRowsComponentProps={{
              style: {
                backgroundColor: "white",
                borderColor: "#435d63",
                accentColor: "#435d63",
              },
            }}
          />
        </main>
      </div>
    </section>
  );
};

export default Users;
