import { useState } from "react";
import paths from "../../Constants/paths";

export default function Register() {
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleFieldsChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleFieldsType = (key) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFieldsBlur = (key, message) => {
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const validateFields = () => {
    const errs = {};

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateFields()) return;
  };

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
                    value={fields.fullName}
                    onChange={(event) =>
                      handleFieldsChange("fullName", event.target.value)
                    }
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
                    value={fields.email}
                    onChange={(event) =>
                      handleFieldsChange("email", event.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm/6 font-medium text-gray-900'>
                  Phone number
                </label>
                <div className='mt-2'>
                  <input
                    id='phone'
                    name='phone'
                    type='phone'
                    required
                    autoComplete='phone'
                    className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                    value={fields.phone}
                    onChange={(event) =>
                      handleFieldsChange("phone", event.target.value)
                    }
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
                    value={fields.password}
                    onChange={(event) =>
                      handleFieldsChange("password", event.target.value)
                    }
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
                    value={fields.confirmPassword}
                    onChange={(event) =>
                      handleFieldsChange("confirmPassword", event.target.value)
                    }
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
                href={paths.login}
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
