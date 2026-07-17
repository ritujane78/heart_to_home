import React, { useState } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../InputField/InputField";
import Buttons from "../../utils/Buttons";
import { Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMyContext } from "../../store/ContextApi";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  // Access the token  using the useMyContext hook from the ContextProvider
  const { token } = useMyContext();

  //react hook form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const onPasswordForgotHandler = async (data) => {
  const { email } = data;

  setLoading(true);
  setMessage("");

  try {
    const formData = new URLSearchParams();
    formData.append("email", email);

    await api.post("/auth/public/forgot-password", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    reset();

    setMessageType("success");
    setMessage(
      "If an account with that email exists, we've sent a password reset link. Please check your inbox and spam folder."
    );
    setEmailSent(true);
  } catch (error) {
    setMessageType("error");
    setEmailSent(false);
    setMessage(
      "We couldn't process your request at the moment. Please try again in a few minutes."
    );
  } finally {
    setLoading(false);
  }
};

  //if there is token  exist navigate  the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-start">
      <form
        onSubmit={handleSubmit(onPasswordForgotHandler)}
        className="sm:w-[450px] w-[360px]  shadow-custom py-8 sm:px-8 px-4"
      >
        <div>
          <h1 className="font-montserrat text-[#1e5146] text-center font-bold text-2xl">
            Forgot Password?
          </h1>
          <p className="text-slate-600 text-center">
            Enter your registered email and a Password Reset email will sent
          </p>
        </div>
        <Divider className="font-semibold pb-4"></Divider>

        <div className="flex flex-col gap-2 mt-4">
          <InputField
            label="Email"
            required
            id="email"
            type="email"
            message="*Email Is Required"
            placeholder="Enter Your Email"
            register={register}
            errors={errors}
            validation={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            }}
          />
          {" "}
        </div>
        <Buttons
          disabled={loading || emailSent || !isValid} // Disable the button if loading or email has been sent
          onClickhandler={() => {}}
          className="bg-[#1e5146] font-semibold text-white w-full py-2 rounded-sm my-3 transform transition-transform duration-200  enabled:hover:scale-105 enabled:active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60"
          type="text"
        >
        {loading ? "Sending..." : emailSent ? "Email Sent" : "Send"}
        </Buttons>
        {message && (
          <div
            className={`rounded-md border px-4 py-3 mb-3 text-sm ${
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

export default ForgotPassword;
