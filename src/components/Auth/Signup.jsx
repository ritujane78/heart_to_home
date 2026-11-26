
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import api from "../../services/api";
import Buttons from "../../utils/Buttons";
import InputField from "../../utils/InputField/InputField";
import { useMyContext } from "../../store/ContextApi";
import { handleApiError } from "../../utils/errorHandler";
import SignupEmailInfo from "../SignupInfoEmail";
import { nameRegex } from "../../utils/nameValidation.js";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [showEmailInfo, setShowEmailInfo] = useState(false);

  const { token } = useMyContext();
  const navigate = useNavigate();
  const firstNameValidation = {
    pattern: {
      value: nameRegex,
      message: "Invalid first name.",
    },
    maxLength: {
      value: 20,
      message: "First name cannot exceed 20 characters.",
    },
  };

  const lastNameValidation = {
    pattern: {
      value: nameRegex,
      message: "Invalid last name.",
    },
    maxLength: {
      value: 20,
      message: "Last name cannot exceed 20 characters.",
    },
  };

  const usernameValidation = {
    minLength: {
      value: 3,
      message: "Username must be at least 3 characters",
    },
    maxLength: {
      value: 20,
      message: "Username cannot exceed 20 characters",
    },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: "Only letters, numbers and underscores are allowed",
    },
  };

  const passwordValidation = {
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
    maxLength: {
      value: 40,
      message: "Password cannot exceed 40 characters",
    },
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  const onSubmitHandler = async (data) => {
    try {
      setLoading(true);
      clearErrors();

      // Clear previous server-side errors before resubmission
      Object.keys(errors).forEach((field) => {
        if (errors[field]?.type === "server") {
          setError(field, {
            type: "manual",
            message: "",
          });
        }
      });

      const response = await api.post("/auth/public/signup", data);

      const message =
        response.data?.message || "Registration successful!";

      if (message.toLowerCase().includes("couldn't send")) {
        toast(message, { icon: "⚠️" });
      } else {
        toast.success(
          <span>  
            Account created successfully! A welcome email has been sent to your registered email address. Please check your{" "}
            <strong>
              <em>Inbox</em>
            </strong>{" "}
            and{" "}
            <strong>
              <em>spam</em>
            </strong>{" "}
            folder.
          </span>
        );
      }

      reset();
      navigate("/login");

    } catch (error) {
      handleApiError(
        error,
        "Unable to create your account. Please try again.",
        setError
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-start">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="sm:w-[450px] w-[360px] shadow-custom py-6 sm:px-8 px-4"
      >
        <div>
          <h1 className="font-montserrat text-center text-[#1e5146] font-bold text-2xl">
            Sign Up
          </h1>

          <p className="text-slate-600 text-center mb-6">
            Enter your credentials to create new account
          </p>
        </div>

        <div className="flex flex-col gap-2">

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="First Name"
              required
              id="firstName"
              type="text"
              message="First name is required"
              placeholder="First Name"
              register={register}
              errors={errors}
              validation={firstNameValidation}
            />

            <InputField
              label="Last Name"
              required
              id="lastName"
              type="text"
              message="Last name is required"
              placeholder="Last Name"
              register={register}
              errors={errors}
              validation={lastNameValidation}
            />
          </div>

          <InputField
            label="Username"
            required
            id="username"
            type="text"
            message="Username is required"
            placeholder="Username"
            register={register}
            errors={errors}
            validation={usernameValidation}
          />

          <InputField
            label="Email"
            required
            id="email"
            type="email"
            message="Email is required"
            placeholder="Email"
            register={register}
            errors={errors}
            onInfoClick={() => setShowEmailInfo(true)}
            infoTitle="Why do we need your email address?"
          />

          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="Password is required"
            placeholder="Password"
            register={register}
            errors={errors}
            validation={passwordValidation}
          />

        </div>

        <Buttons
          disabled={loading || !isValid}
          type="submit"
          className="bg-[#1e5146] text-white font-semibold flex justify-center w-full py-2 rounded-sm my-3 transition active:scale-[0.95]"
        >
          {loading ? "Loading..." : "Sign Up"}
        </Buttons>

        <p className="text-center text-sm text-slate-700 mt-2">
          Already have an account?{" "}
          <Link
            className="inline-block text-[#584c02] font-extrabold underline transition-transform duration-200 hover:scale-115"
            to="/login"
          >
            LogIn
          </Link>
        </p>

        {showEmailInfo && (
          <SignupEmailInfo setShowEmailInfo={setShowEmailInfo} />
        )}
      </form>
    </div>
  );
};

export default Signup;
