import React from "react";
import { isEmpty } from "../../../Utils/validation";
import { IoClose } from "react-icons/io5";

const FormControl = React.lazy(() => import("../../../Components/FormControl"));
const Overlay = React.lazy(() => import("../../../Components/Overlay"));

const Form = ({ toggle, setToggle }) => {
  const [fields, setFields] = React.useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    password: "",
    created_at: "",
    updated_at: "",
    role: "",
    store: "",
  });
  const [errors, setErrors] = React.useState({});
  const [pending, setPending] = React.useState(false);

  const handleFieldsChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleFieldsType = (key) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handelFieldsBlur = (key, message) => {
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  return (
    <>
      <Overlay toggle={toggle} setToggle={setToggle} />
      <section
        className={`
        ${
          toggle
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } fixed inset-0 z-40 flex items-center justify-center lg:px-0 p-4`}>
        <form className='bg-white max-w-2xl w-full rounded p-6'>
          <div className='flex items-center justify-between w-full mb-4'>
            <p className='font-semibold text-lg'>Users Management</p>
            <IoClose size={26} className='cursor-pointer' onClick={setToggle} />
          </div>
          <div>
            <FormControl
              type='text'
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

          <div className='flex items-center gap-4 mt-6'>
            <button
              type='button'
              className={`transition-all duration-700 text-black w-full py-2 rounded font-serif font-semibold`}
              //   disabled={isPendingLogin}
            >
              {/* {isPendingLogin ? (
                <Loading customStyle='flex items-center justify-center' />
              ) : (
                <p>Login</p>
              )} */}
              Cancel
            </button>
            <button
              type='submit'
              className={`transition-all duration-700 hover:bg-black text-white bg-[#799aa1] w-full py-2 rounded font-serif font-semibold`}
              //   disabled={isPendingLogin}
            >
              {/* {isPendingLogin ? (
                <Loading customStyle='flex items-center justify-center' />
              ) : (
                <p>Login</p>
              )} */}
              Create
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Form;
