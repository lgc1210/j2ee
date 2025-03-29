import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";

const Loading = React.lazy(() => import("../../Components/Loading"));

const Profile = () => {
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
          <div>
            <p className='font-bold mb-8'>My Profile</p>
          </div>

          <div className='flex flex-col gap-4'>
            {/* Personal Information */}
            <div className='p-4 rounded-md border border-black/10'>
              <div className='flex items-center justify-between'>
                <p className='font-semibold'>Personal Information</p>
                <button className='text-black/50 hover:text-black hover:border-black flex items-center gap-2 border border-black/10 rounded-full py-2 px-4'>
                  <p className='text-sm'>Edit</p>
                  <AiOutlineEdit size={16} />
                </button>
              </div>

              <table>
                <tr>
                  <td className='pr-32 pb-6'>
                    <div className='flex flex-col gap-1'>
                      <p className='text-black/60 text-sm font-semibold'>
                        Full Name
                      </p>
                      <p className='font-semibold'>Lê Gia Cường</p>
                    </div>
                  </td>
                  <td className='pr-32 pb-6'>
                    <div className='flex flex-col gap-1'>
                      <p className='text-black/60 text-sm font-semibold'>
                        Phone
                      </p>
                      <p className='font-semibold'>0123456789</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className='pr-32 pb-6'>
                    <div className='flex flex-col gap-1'>
                      <p className='text-black/60 text-sm font-semibold'>
                        Email
                      </p>
                      <p className='font-semibold'>lgc@gmail.com</p>
                    </div>
                  </td>
                  <td className='pr-32 pb-6'>
                    <div className='flex flex-col gap-1'>
                      <p className='text-black/60 text-sm font-semibold'>
                        Created At
                      </p>
                      <p className='font-semibold'>12/10/2003</p>
                    </div>
                  </td>
                </tr>
              </table>
            </div>

            {/* Addresses */}
            <div className='p-4 rounded-md border border-black/10'>
              <div className='flex items-center justify-between pb-4'>
                <p className='font-semibold'>Addresses</p>
                <button className='text-black/50 hover:text-black hover:border-black flex items-center gap-2 border border-black/10 rounded-full py-2 px-4'>
                  <p className='text-sm'>Add</p>
                  <FiPlus size={16} />
                </button>
              </div>

              {/* List of address */}
              <ul className=''>
                <li className='flex items-center justify-between py-4 border-t border-black/10'>
                  <div>
                    <span className='flex items-center justify-start'>
                      <p className='font-semibold'>Cường Lê</p>
                      {/* Divider */}
                      <span className='mx-2 w-[1px] h-6 bg-black/10'></span>
                      <p className='text-black/60 text-sm'>0948800917</p>
                    </span>
                    <div>
                      <p className='text-black/60 text-sm'>247/37 Phú Định</p>
                      <p className='text-black/60 text-sm'>
                        Phường 16, Quận 8, TP.Hồ Chí Minh
                      </p>
                    </div>
                    <span className='text-xs text-[#435d63] border border-[#435d63] px-1'>
                      Mặc định
                    </span>
                  </div>
                  <div className='flex flex-col items-end gap-4'>
                    <span className='flex items-center gap-2'>
                      <p className='text-sm cursor-pointer text-[#435d63]'>
                        Update
                      </p>
                    </span>
                    <p className='text-sm cursor-pointer border border-black/20 py-0.5 px-4 hover:bg-gray-300/15'>
                      Set default
                    </p>
                  </div>
                </li>
                <li className='flex items-center justify-between py-4 border-t border-black/10'>
                  <div>
                    <span className='flex items-center justify-start'>
                      <p className='font-semibold'>Cường Lê</p>
                      {/* Divider */}
                      <span className='mx-2 w-[1px] h-6 bg-black/10'></span>
                      <p className='text-black/60 text-sm'>0948800917</p>
                    </span>
                    <div>
                      <p className='text-black/60 text-sm'>247/37 Phú Định</p>
                      <p className='text-black/60 text-sm'>
                        Phường 16, Quận 8, TP.Hồ Chí Minh
                      </p>
                    </div>
                    {/* <span className='text-xs text-[#435d63] border border-[#435d63] px-1'>
                    Mặc định
                  </span> */}
                  </div>
                  <div className='flex flex-col items-end gap-4'>
                    <span className='flex items-center gap-2'>
                      <p className='text-sm cursor-pointer text-[#435d63]'>
                        Update
                      </p>
                      <p className='text-sm cursor-pointer text-[#435d63]'>
                        Delete
                      </p>
                    </span>
                    <p className='text-sm cursor-pointer border border-black/20 py-0.5 px-4 hover:bg-gray-300/15'>
                      Set default
                    </p>
                  </div>
                </li>
                <li className='flex items-center justify-between py-4 border-t border-black/10'>
                  <div>
                    <span className='flex items-center justify-start'>
                      <p className='font-semibold'>Cường Lê</p>
                      {/* Divider */}
                      <span className='mx-2 w-[1px] h-6 bg-black/10'></span>
                      <p className='text-black/60 text-sm'>0948800917</p>
                    </span>
                    <div>
                      <p className='text-black/60 text-sm'>247/37 Phú Định</p>
                      <p className='text-black/60 text-sm'>
                        Phường 16, Quận 8, TP.Hồ Chí Minh
                      </p>
                    </div>
                    {/* <span className='text-xs text-[#435d63] border border-[#435d63] px-1'>
                    Mặc định
                  </span> */}
                  </div>
                  <div className='flex flex-col items-end gap-4'>
                    <span className='flex items-center gap-2'>
                      <p className='text-sm cursor-pointer text-[#435d63]'>
                        Update
                      </p>
                      <p className='text-sm cursor-pointer text-[#435d63]'>
                        Delete
                      </p>
                    </span>
                    <p className='text-sm cursor-pointer border border-black/20 py-0.5 px-4 hover:bg-gray-300/15'>
                      Set default
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className='w-full mt-4'>
            <p className='text-sm cursor-pointer rounded w-fit ml-auto py-2 px-4 text-white bg-black/80'>
              Log out
            </p>
          </div>
        </div>
      </section>
    </React.Suspense>
  );
};

export default Profile;
