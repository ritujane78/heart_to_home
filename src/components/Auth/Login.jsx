import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import toast from "react-hot-toast";

import api from "../../services/api.jsx";
import InputField from "../InputField/InputField.jsx";
import Buttons from "../../utils/Buttons.jsx";
import { useMyContext } from "../../store/ContextApi.jsx";

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  // Access the token and setToken function using the useMyContext hook from the ContextProvider
  const { token, setToken } = useMyContext();
  const navigate = useNavigate();

  //react hook form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      code: "",
    },
    mode: "onTouched",
  });

  const handleSuccessfulLogin = (token, decodedToken) => {
    const user = {
      username: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };
    localStorage.setItem("JWT_TOKEN", token);
    localStorage.setItem("USER", JSON.stringify(user));

    //store the token on the context state  so that it can be shared any where in our application by context provider
    setToken(token);

    navigate("/");
  };

  //function for handle login with credentials
  const onLoginHandler = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/public/signin", data);

      //showing success message with react hot toast
      toast.success("Login Successful");

      //reset the input field by using reset() function provided by react hook form after submission
      reset();

      if (response.status === 200 && response.data.jwtToken) {
        setJwtToken(response.data.jwtToken);
        const decodedToken = jwtDecode(response.data.jwtToken);
        handleSuccessfulLogin(response.data.jwtToken, decodedToken);
      } else {
        toast.error(
          "Login failed. Please check your credentials and try again."
        );
      }
    } catch (error) {
      if (error) {
        toast.error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  //function for verify 2fa authentication
  const onVerify2FaHandler = async (data) => {
    const code = data.code;
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append("jwtToken", jwtToken);

      await api.post("/auth/public/verify-2fa-login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const decodedToken = jwtDecode(jwtToken);
      handleSuccessfulLogin(jwtToken, decodedToken);
    } catch (error) {
      console.error("2FA verification error", error);
      toast.error("Invalid 2FA code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //if there is token  exist navigate  the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  //step1 will render the login form and step-2 will render the 2fa verification form
  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-start">
          <form
            onSubmit={handleSubmit(onLoginHandler)}
            className="sm:w-[450px] w-[360px]  shadow-custom py-8 sm:px-8 px-4"
          >
            <div>
              <h1 className="font-montserrat text-center text-[#1e5146] font-bold text-2xl">
                Login 
              </h1>
              <p className="text-slate-600 text-center mb-6">
                Please Enter your username and password{" "}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <InputField
                label="UserName"
                required
                id="username"
                type="text"
                message="*UserName is required"
                placeholder="type your username"
                register={register}
                errors={errors}
              />{" "}
              <InputField
                label="Password"
                required
                id="password"
                type="password"
                message="*Password is required"
                placeholder="type your password"
                register={register}
                errors={errors}
              />
            </div>
            <Buttons
              disabled={loading}
              onClickhandler={() => {}}
              className="bg-[#1e5146] text-white font-semibold w-full py-2 rounded-sm my-3 transform transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98]"
              type="text"
            >
              {loading ? <span>Loading...</span> : "LogIn"}
            </Buttons>
            <p className=" text-sm text-slate-700 mb-4 ">
              <Link
                className=" underline hover:text-black"
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
            </p>

            <p className="text-center text-sm text-slate-700 mt-6">
              Don't have an account?{" "}
              <Link
                className="inline-block text-[#584c02] font-extrabold underline transition-transform duration-200 hover:scale-115"
                to="/signup"
              >
                SignUp
              </Link>
            </p>
          </form>
    </div>
  );
};

export default Login;
