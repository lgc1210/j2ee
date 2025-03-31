import React from "react";
import { isEmpty, isConfirmPassword } from "../../Utils/validation.js";
import { useAuth } from "../../Contexts/Auth/index.jsx";
import { useSelector, useDispatch } from "react-redux";
import userService from "../../Services/user";

const FormControl = React.lazy(() => import("../../Components/FormControl"));

const ProfileChangePassword = () => {
  const [fields, setFields] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState({});
  const { user } = useAuth();
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state);

  const validate = () => {
    const errs = {};

    if (isEmpty(fields.currentPassword)) {
      errs.currentPassword = "Current password is required";
    }
    if (isEmpty(fields.newPassword)) {
      errs.newPassword = "New password is required";
    }
    if (!isConfirmPassword(fields.newPassword, fields.confirmPassword)) {
      errs.confirmPassword = "Confirm password does not match";
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleFieldsChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleFieldsType = (key) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFieldsBlur = (key, message) => {
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await userService.changePassword(user?.id, {
        currentPassword: fields.currentPassword,
        newPassword: fields.newPassword,
      });
      console.log("Response: ", response);
    } catch (error) {}
  };

  return (
    <section className='flex-grow bg-white rounded-md shadow-md p-4'>
      <div className=''>
        <div>
          <p className='font-bold mb-8'>Change Password</p>
        </div>

        <div className='flex flex-col gap-4'>
          {/* Personal Information */}
          <div className='p-4 rounded-md border border-black/10'>
            <div className='flex items-center justify-between'>
              <p className='font-semibold'>Change Your Password</p>
            </div>

            <form
              className='mt-4 flex flex-col gap-4 min-w-fit w-1/3'
              onSubmit={handleSubmit}>
              <div>
                <FormControl
                  type='password'
                  placeHolder='Enter your current password'
                  wrapInputStyle={`rounded !border-black/20 focus-within:!border-black/60 transition-all ${
                    errors?.currentPassword
                      ? "!border-red-400 focus-within:!border-red-400"
                      : ""
                  }`}
                  inputStyle='placeholder:text-lg text-black placeholder:font-serif'
                  hasLabel
                  label='Current Password'
                  id='currentPassword'
                  labelStyle='mb-1 font-serif'
                  onChange={(event) =>
                    handleFieldsChange("currentPassword", event.target.value)
                  }
                  onType={() => handleFieldsType("currentPassword")}
                  onBlur={() => {
                    if (isEmpty(fields.currentPassword))
                      handleFieldsBlur(
                        "currentPassword",
                        "Current password is required"
                      );
                  }}
                  hasError={errors?.currentPassword}
                  errorMessage={errors?.currentPassword}
                />
              </div>

              <div>
                <FormControl
                  type='password'
                  placeHolder='Enter new password'
                  wrapInputStyle={`rounded !border-black/20 focus-within:!border-black/60 transition-all ${
                    errors?.newPassword
                      ? "!border-red-400 focus-within:!border-red-400"
                      : ""
                  }`}
                  inputStyle='rounded border-black/60 placeholder:text-lg text-black placeholder:font-serif'
                  hasLabel
                  label='New Password'
                  id='newPassword'
                  labelStyle='mb-1 font-serif'
                  onChange={(event) =>
                    handleFieldsChange("newPassword", event.target.value)
                  }
                  onType={() => handleFieldsType("newPassword")}
                  onBlur={() => {
                    if (isEmpty(fields.newPassword))
                      handleFieldsBlur(
                        "newPassword",
                        "New password is required"
                      );
                  }}
                  hasError={errors?.newPassword}
                  errorMessage={errors?.newPassword}
                />
              </div>

              <div>
                <FormControl
                  type='password'
                  placeHolder='Enter re-type password'
                  wrapInputStyle={`rounded !border-black/20 focus-within:!border-black/60 transition-all ${
                    errors?.confirmPassword
                      ? "!border-red-400 focus-within:!border-red-400"
                      : ""
                  }`}
                  inputStyle='rounded border-black/60 placeholder:text-lg text-black placeholder:font-serif'
                  hasLabel
                  label='Re-type Password'
                  id='confirmPassword'
                  labelStyle='mb-1 font-serif'
                  onChange={(event) =>
                    handleFieldsChange("confirmPassword", event.target.value)
                  }
                  onType={() => handleFieldsType("confirmPassword")}
                  onBlur={() => {
                    if (
                      !isConfirmPassword(
                        fields.newPassword,
                        fields.confirmPassword
                      )
                    )
                      handleFieldsBlur(
                        "confirmPassword",
                        "Confirm password does not match"
                      );
                  }}
                  hasError={errors?.confirmPassword}
                  errorMessage={errors?.confirmPassword}
                />
              </div>
              <button
                type='submit'
                className={`rounded transition-all duration-700 hover:bg-black text-white bg-[#799aa1] w-full py-3 text-lg font-serif font-semibold`}
                // disabled={isPendingLogin}
              >
                {/* {isPendingLogin ? ( */}
                {/* <Loading customStyle='flex items-center justify-center' /> */}
                {/* ) : ( */}
                {/* <p>Login</p> */}
                {/* )} */}
                Change
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileChangePassword;
