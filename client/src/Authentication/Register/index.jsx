import { useState } from "react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8'>
        <div className='bg-slate-50 border rounded-md shadow-md w-1/3 p-10'>
          <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            <img
              alt='Your Company'
              src='https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600'
              className='mx-auto h-10 w-auto'
            />
            <h2 className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>
              Register your account
            </h2>
          </div>

          <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
            <form action='#' method='POST' className='space-y-6'>
              <div>
                <label
                  htmlFor='fullName'
                  className='block text-sm/6 font-medium text-gray-900'>
                  Full Name
                </label>
                <div className='mt-2'>
                  <input
                    id='fullName'
                    name='fullName'
                    type='text'
                    required
                    autoComplete='fullName'
                    className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm/6 font-medium text-gray-900'>
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    required
                    autoComplete='email'
                    className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className='block text-sm/6 font-medium text-gray-900'>
                    Password
                  </label>
                </div>
                <div className='mt-2'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    required
                    autoComplete='current-password'
                    className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm/6 font-medium text-gray-900'>
                    Confirm Password
                  </label>
                </div>
                <div className='mt-2'>
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    required
                    autoComplete='current-password'
                    className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  />
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                  Register
                </button>
              </div>
            </form>

            <p className='mt-10 text-center text-sm/6 text-gray-500'>
              Already have an account?{" "}
              <a
                href='#'
                className='font-semibold text-indigo-600 hover:text-indigo-500'>
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
