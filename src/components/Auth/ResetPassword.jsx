import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { Divider } from "@mui/material";
import InputField from "../InputField/InputField";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Buttons from "../../utils/Buttons";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  
  const handleResetPassword = async (data) => {
    const { password } = data;
    const token = searchParams.get("token");

    setLoading(true);
    setMessage("");

    try {
      const formData = new URLSearchParams();

      formData.append("token", token);
      formData.append("newPassword", password);

      await api.post("/auth/public/reset-password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setMessageType("success");
      setMessage(
        "Your password has been updated successfully! You can now log in with your new password."
      );

      setPasswordUpdated(true);
      reset();
    } catch (error) {
      setMessageType("error");
      setMessage(
        "Unable to update your password. The reset link may have expired or is invalid."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-start">
      <form
        onSubmit={handleSubmit(handleResetPassword)}
        className="sm:w-[450px] w-[360px]  shadow-custom py-8 sm:px-8 px-4"
      >
        <div>
          <h1 className="font-montserrat text-[#1e5146] text-center font-bold text-2xl">
            Update Your Password
          </h1>
          <p className="text-slate-600 text-center">
            Enter your new password to update it
          </p>
        </div>
        <Divider className="font-semibold pb-4"></Divider>

        <div className="flex flex-col gap-4 mt-4">
          {/* Password */}
          <div className="relative">
            <InputField
              label="Password"
              required
              id="password"
              type={showPassword ? "text" : "password"}
              message="Password is required"
              placeholder="Enter Your Password"
              register={register}
              errors={errors}
              min={6}
              disableCopyPaste
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-slate-500 hover:text-slate-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <InputField
              label="Re-enter Password"
              required
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              message="Please confirm your password"
              placeholder="Re-enter Your Password"
              register={register}
              errors={errors}
              disableCopyPaste
              validation={{
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              }}
            />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
      className="absolute right-3 top-[42px] text-slate-500 hover:text-slate-700"
    >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
</div>
        <Buttons
          disabled={
            loading ||
            passwordUpdated ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword
          }
          onClickhandler={() => {}}
          className="bg-[#1e5146] font-semibold text-white w-full py-2 rounded-sm my-3"
          type="text"
        >
          {loading ? "Updating..." : passwordUpdated ? "Password Updated" : "Submit"}
        </Buttons>
        {message && (
          <div
            className={`mb-4 mt-3 rounded-md border px-4 py-3 text-sm ${
              messageType === "success"
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-red-300 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
          )}
        <p className=" text-sm text-slate-700 ">
          <Link className=" underline hover:text-black" to="/login">
            Back To Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
