import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Divider from "@mui/material/Divider";
import Buttons from "../../utils/Buttons";
import InputField from "../InputField/InputField";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import { useEffect } from "react";
import { handleApiError } from "../../utils/errorHandler";

const Signup = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(false);
  // Access the token and setToken function using the useMyContext hook from the ContextProvider
  const { token } = useMyContext();
  const navigate = useNavigate();

  //react hook form initialization
  const {
    register,
    handleSubmit,
    reset,
    setError,
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
    setRole("ROLE_USER");
  }, []);

  const onSubmitHandler = async (data) => {
    const { firstName, lastName, username, email, password } = data;
    const sendData = {
      firstName,
      lastName,
      username,
      email,
      password,
      role: [role],
    };

    try {
      setLoading(true);
      const response = await api.post("/auth/public/signup", sendData);

      const message = response.data?.message || "Registration successful.";

      if (message.toLowerCase().includes("couldn't send")) {
        toast(message, {
          icon: "⚠️",
        });
      } else {
        toast.success(message);
      }

      reset();
      navigate("/login");
    } catch (error) {
      handleApiError(
        error,
        "Unable to create your account. Please try again.",
        setError,
      );
    } finally {
      setLoading(false);
    }
  };

  //if there is token  exist navigate to the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-start">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="sm:w-[450px] w-[360px]  shadow-custom py-6 sm:px-8 px-4"
      >
        <div>
          <h1 className="font-montserrat text-center text-[#1e5146] font-bold text-2xl">
            Sign Up
          </h1>
          <p className="text-slate-600 text-center mb-6">
            Enter your credentials to create new account
          </p>

          {/* <Divider className="font-semibold">OR</Divider> */}
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="First Name"
              required
              id="firstName"
              type="text"
              message="*First Name is required"
              placeholder="First Name"
              register={register}
              errors={errors}
            />

            <InputField
              label="Last Name"
              required
              id="lastName"
              type="text"
              message="*Last Name is required"
              placeholder="Last Name"
              register={register}
              errors={errors}
            />
          </div>

          <InputField
            label="Username"
            required
            id="username"
            type="text"
            message="*UserName Is Required"
            placeholder="Username"
            register={register}
            errors={errors}
          />

          <InputField
            label="Email"
            required
            id="email"
            type="email"
            message="*Email Is Required"
            placeholder="Email"
            register={register}
            errors={errors}
          />

          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="*Password is required"
            placeholder="Password"
            register={register}
            errors={errors}
            min={6}
          />
        </div>
        <Buttons
          disabled={loading || !isValid}
          type="submit"
          className="bg-[#1e5146] text-white font-semibold flex justify-center w-full py-2 rounded-sm my-3 transition active:scale-[0.95]"
        >
          {loading ? "Loading..." : "Sign Up"}
        </Buttons>

        <p className="text-center text-sm text-slate-700 mt-2 ">
          Already have an account?{" "}
          <Link
            className="inline-block text-[#584c02] font-extrabold underline transition-transform duration-200 hover:scale-115"
            to="/login"
          >
            LogIn
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
