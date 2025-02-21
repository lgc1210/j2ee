import { useState } from "react";
import paths from "../../Constants/paths";
import { useNavigate } from "react-router-dom";
import LogoImage from "../../assets/images/header/lesya-logo.png";
import FormControl from "../../Components/FormControl";

export default function Register() {
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
              alt="Company's Logo"
              src={LogoImage}
              className='mx-auto h-auto w-1/2 object-contain object-center'
            />
            <h2 className='mt-10 text-center text-2xl font-bold font-serif tracking-tight text-gray-900'>
              Register your account
            </h2>
          </div>

          <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
            <form className='space-y-6' onSubmit={handleSubmit}>
              <div>
                <FormControl
                  type='text'
                  placeHolder='Enter Full Name'
                  wrapInputStyle=''
                  inputStyle='placeholder:text-lg text-black placeholder:font-serif'
                  hasLabel
                  label='Enter fullname'
                  id='fullname'
                  labelStyle='mb-1 font-serif'
                />
              </div>

              <div>
                <FormControl
                  type='text'
                  placeHolder='Enter Email'
                  wrapInputStyle=''
                  inputStyle='placeholder:text-lg text-black placeholder:font-serif'
                  hasLabel
                  label='Enter email'
                  id='email'
                  labelStyle='mb-1 font-serif'
                />
              </div>

              <div>
                <FormControl
                  type='text'
                  placeHolder='Enter Phone Number'
                  wrapInputStyle=''
                  inputStyle='placeholder:text-lg text-black placeholder:font-serif'
                  hasLabel
                  label='Enter phone'
                  id='phone'
                  labelStyle='mb-1 font-serif'
                />
              </div>

              <div>
                <FormControl
                  type='password'
                  placeHolder='Enter Password'
                  wrapInputStyle=''
                  inputStyle='placeholder:text-lg text-black placeholder:font-serif'
                  hasLabel
                  id='password'
                  label='Enter password'
                  labelStyle='mb-1 font-serif'
                />
              </div>

              <div>
                <FormControl
                  type='password'
                  placeHolder='Enter Confirm Password'
                  wrapInputStyle=''
                  inputStyle='placeholder:text-lg text-black placeholder:font-serif'
                  hasLabel
                  id='confirm-password'
                  label='Enter confirm password'
                  labelStyle='mb-1 font-serif'
                />
              </div>

              <button
                type='submit'
                className='transition-all duration-700 hover:bg-black text-white bg-[#799aa1] w-full py-4 text-lg font-serif font-semibold'>
                Register
              </button>
            </form>

            <p className='mt-10 text-center text-sm/6 text-gray-500'>
              Already have an account?{" "}
              <button
                className='font-semibold text-[#799aa1] hover:text-black'
                onClick={() => navigate(paths.login)}>
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
