import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { LiaEdit } from "react-icons/lia";

const Dashboard = () => {
  const [searchInput, setSearchInput] = useState("");
  // const dispatch = useDispatch();
  // const { data: users, loading, error } = useSelector((state) => state.users);

  // useEffect(() => {
  //   dispatch(fetchUsers());
  // }, [dispatch]);

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
    },
    {
      name: "Year",
      selector: (row) => row.year,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className='flex items-center justify-center gap-2'>
          <LiaEdit size={24} className='cursor-pointer' onClick={handleEdit} />
        </div>
      ),
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

  const handleEdit = async () => {};

  return (
    <section>
      <div className='p-8'>
        {/* Search */}
        {/* <AdminSearchInput
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        /> */}

        {/* Data table */}
        <DataTable
          columns={columns}
          data={data}
          selectableRows
          selectableRowsHighlight
          pagination
          highlightOnHover
        />

        {/* Actions
        <div className='flex items-center justify-end gap-2 mt-6'>
          <Button
            text='export'
            customStyle='px-3 py-2 text-white bg-[#274b60] hover:text-[#274b60] hover:bg-slate-300 text-sm'
          />
          <Button
            text='import'
            customStyle='px-3 py-2 text-white bg-[#274b60] hover:text-[#274b60] hover:bg-slate-300 text-sm'
          />
          <Button
            text='create'
            customStyle='px-3 py-2 text-white bg-[#274b60] hover:text-[#274b60] hover:bg-slate-300 text-sm'
          />
        </div> */}
      </div>
    </section>
  );
};

export default Dashboard;
