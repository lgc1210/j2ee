import { useState } from "react";
import paths from "../../Constants/paths";
import { Navigate, useNavigate } from "react-router-dom";
import LogoImage from "../../assets/images/header/lesya-logo.png";
import FormControl from "../../Components/FormControl";
import {
  isConfirmPassword,
  isEmail,
  isEmpty,
  isPhone,
} from "../../Utils/validation";
import { useAuth } from "../../Contexts/Auth";
import Loading from "../../Components/Loading";

export default function Register() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { register, isPendingRegister, isAuthenticated, user } = useAuth();

  if (isAuthenticated)
    return (
      <Navigate
        to={user?.role === "customer" ? paths.home : paths.dashboard}
        replace
      />
    );

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

    if (isEmpty(fields.name)) errs.name = "Full name is required";
    if (isEmpty(fields.email)) errs.email = "Email is required";
    else if (!isEmail(fields.email)) errs.email = "Email is invalid";
    if (isEmpty(fields.phone)) errs.phone = "Phone is required";
    else if (!isPhone(fields.phone)) errs.phone = "Phone is invalid";
    if (isEmpty(fields.password)) errs.password = "Password is required";
    if (
      !isEmpty(fields.password) &&
      !isConfirmPassword(fields.password, fields.confirmPassword)
    )
      errs.confirmPassword = "Confirm password does not match.";

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateFields()) return;

    await register(fields);
  };

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8'>
        <div className='bg-slate-50 border rounded-md shadow-md w-1/3 p-10'>
          <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            <img
              alt="Company's Logo"
              src={LogoImage}
              className='mx-auto h-auto w-1/2 object-contain object-center cursor-pointer'
              onClick={() => navigate(paths.home)}
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
                  label='Enter full name'
                  id='name'
                  labelStyle='mb-1 font-serif'
                  onChange={(event) =>
                    handleFieldsChange("name", event.target.value)
                  }
                  onType={() => handleFieldsType("name")}
                  onBlur={() =>
                    isEmpty(fields.name) &&
                    handleFieldsBlur("name", "Full name is required")
                  }
                  hasError={errors?.name}
                  errorMessage={errors?.name}
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
                  onChange={(event) =>
                    handleFieldsChange("email", event.target.value)
                  }
                  onType={() => handleFieldsType("email")}
                  onBlur={() => {
                    if (isEmpty(fields.email))
                      handleFieldsBlur("email", "Email is required");
                    else if (!isEmail(fields.email))
                      handleFieldsBlur("email", "Email is invalid");
                  }}
                  hasError={errors?.email}
                  errorMessage={errors?.email}
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
                  onChange={(event) =>
                    handleFieldsChange("phone", event.target.value)
                  }
                  onType={() => handleFieldsType("phone")}
                  onBlur={() => {
                    if (isEmpty(fields.phone))
                      handleFieldsBlur("phone", "Phone is required");
                    else if (!isPhone(fields.phone))
                      handleFieldsBlur("phone", "Phone is invalid");
                  }}
                  hasError={errors?.phone}
                  errorMessage={errors?.phone}
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
                  onChange={(event) =>
                    handleFieldsChange("password", event.target.value)
                  }
                  onType={() => handleFieldsType("password")}
                  onBlur={() =>
                    isEmpty(fields.password) &&
                    handleFieldsBlur("password", "Password is required")
                  }
                  hasError={errors?.password}
                  errorMessage={errors?.password}
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
                  onChange={(event) =>
                    handleFieldsChange("confirmPassword", event.target.value)
                  }
                  onType={() => handleFieldsType("confirmPassword")}
                  onBlur={() =>
                    !isEmpty(fields.password) &&
                    !isConfirmPassword(
                      fields.password,
                      fields.confirmPassword
                    ) &&
                    handleFieldsBlur(
                      "confirmPassword",
                      "Confirm password does not match"
                    )
                  }
                  hasError={errors?.confirmPassword}
                  errorMessage={errors?.confirmPassword}
                />
              </div>

              <button
                type='submit'
                className={`transition-all duration-700 hover:bg-black text-white bg-[#799aa1] w-full py-4 text-lg font-serif font-semibold ${
                  isPendingRegister ? "opacity-60 pointer-events-none" : ""
                }`}
                disabled={isPendingRegister}>
                {isPendingRegister ? (
                  <Loading customStyle='flex items-center justify-center' />
                ) : (
                  <p>Register</p>
                )}
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
