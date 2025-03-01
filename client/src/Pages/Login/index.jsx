import { useState } from "react";
import paths from "../../Constants/paths";
import LogoImage from "../../assets/images/header/lesya-logo.png";
import FormControl from "../../Components/FormControl";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/Auth";
import { isEmail, isEmpty } from "../../Utils/validation";
import Loading from "../../Components/Loading";

export default function Login() {
  const [fields, setFields] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login, isPendingLogin } = useAuth();

  const handleFieldsChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleFieldsType = (key) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handelFieldsBlur = (key, message) => {
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const validateFields = () => {
    const errs = {};

    if (isEmpty(fields.email)) errs.email = "Email is required";
    else if (!isEmail(fields.email)) errs.email = "Email is invalid";
    if (isEmpty(fields.password)) errs.password = "Password is required";

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    console.log("Clicked");
    event.preventDefault();

    if (!validateFields()) return;

    await login(fields);
  };

  return (
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
            Sign in to your account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6' onSubmit={handleSubmit}>
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
                    handelFieldsBlur("email", "Email is required");
                  else if (!isEmail(fields.email))
                    handelFieldsBlur("email", "Email is invalid");
                }}
                hasError={errors?.email}
                errorMessage={errors?.email}
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
                  handelFieldsBlur("password", "Password is required")
                }
                hasError={errors?.password}
                errorMessage={errors?.password}
              />
            </div>

            <button
              type='submit'
              className={`transition-all duration-700 hover:bg-black text-white bg-[#799aa1] w-full py-4 text-lg font-serif font-semibold ${
                isPendingLogin ? "opacity-60 pointer-events-none" : ""
              }`}
              disabled={isPendingLogin}>
              {isPendingLogin ? (
                <Loading customStyle='flex items-center justify-center' />
              ) : (
                <p>Login</p>
              )}
            </button>
          </form>

          <p className='mt-10 text-center text-sm/6 text-gray-500'>
            Don't you have an account?{" "}
            <button
              className='font-semibold text-[#799aa1] hover:text-black'
              onClick={() => navigate(paths.register)}>
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
