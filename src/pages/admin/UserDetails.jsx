import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../../components/InputField/InputField";
import { BallTriangle } from "react-loader-spinner";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
// import Errors from "../Errors";

const UserDetails = () => {
  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });
  const {
    handleSubmit: handleRoleSubmit,
  } = useForm({
    mode: "onTouched",
  });

  const [loading, setLoading] = useState(false);
  const [updateRoleLoader, setUpdateRoleLoader] = useState(false);
  const [passwordLoader, setPasswordLoader] = useState(false);

  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/user/${userId}`);
      setUser(response.data);

      setSelectedRole(response.data.role?.roleName || "");
      console.log(response);
      
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error("Error fetching user details", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    //if user exist set the value by using the setValue function provided my react-hook-form
    if (user && Object.keys(user).length > 0) {
      setValue("username", user.userName);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get("/admin/roles");
      setRoles(response.data);
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error("Error fetching roles", err);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchRoles();
  }, [fetchUserDetails, fetchRoles]);

  //set the selected role
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  //handle update role
  const handleUpdateRole = async () => {
    setUpdateRoleLoader(true);

    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("roleName", selectedRole);

      await api.put("/admin/update-role", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      fetchUserDetails();
      toast.success("Role updated successfully");
    } catch (err) {
      toast.error("Failed to update role");
    } finally {
      setUpdateRoleLoader(false);
    }
  };

  //handle update the password
  const handleSavePassword = async (data) => {
    setPasswordLoader(true);
    const newPassword = data.password;

    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("password", newPassword);

      await api.put(`/admin/update-password`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      setIsEditingPassword(false);
      setValue("password", "");
      //fetchUserDetails();
      toast.success("password update success");
    } catch (err) {
      toast.error("Error updating password " + err.response.data);
    } finally {
      setPasswordLoader(false);
      resetField("password");
    }
  };
  const isHthAdmin =
    user?.userName?.toLowerCase() === "hth_admin" &&
    user?.role?.roleName === "ROLE_ADMIN";

  // const handleCheckboxChange = async (e, updateUrl) => {
  //   const { name, checked } = e.target;

  //   let message = null;
  //   if (name === "lock") {
  //     message = "Update Account Lock status Successful";
  //   } else if (name === "expire") {
  //     message = "Update Account Expiry status Successful";
  //   } else if (name === "enabled") {
  //     message = "Update Account Enabled status Successful";
  //   } else if (name === "credentialsExpire") {
  //     message = "Update Account Credentials Expired status Successful";
  //   }

  //   try {
  //     const formData = new URLSearchParams();
  //     formData.append("userId", userId);

  //     formData.append(name, checked);

  //     await api.put(updateUrl, formData, {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     });
  //     fetchUserDetails();
  //     toast.success(message);
  //   } catch (err) {
  //     toast.error(err?.response?.data?.message);
  //     console.log(`Error updating ${name}:`);
  //   } finally {
  //     message = null;
  //   }
  // };

  // if (error) {
  //   return <Errors message={error} />;
  // }

  return (
    <div className="sm:px-12 px-4 py-10   ">
      {loading ? (
        <>
          {" "}
          <div className="flex  flex-col justify-center items-center  h-72">
            <span>
              <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#4fa94d"
                ariaLabel="ball-triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                />
            </span>
            <span>Please wait...</span>
          </div>
        </>
      ) : (
        <>
          <div className="lg:w-[70%] sm:w-[90%] w-full  mx-auto shadow-lg shadow-gray-300 p-8 rounded-md">
            <div>
              <h2 className="text-slate-800 text-2xl font-bold  pb-4">
                Profile Information
                <hr />
              </h2>
              <div className="flex flex-row items-center justify-center sm:justify-start gap-4 text-center">
              <form
                onSubmit={handleRoleSubmit(handleUpdateRole)}
                className="py-4 flex flex-row items-center items-start gap-4"
              >
                <div className="flex items-sart gap-2">
                  <label className="text-slate-600 text-lg font-semibold">
                    Role:
                  </label>

                  <select
                    className="px-8 py-1 rounded-md border-2 uppercase border-slate-600 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                    value={selectedRole}
                    onChange={handleRoleChange}
                    disabled={isHthAdmin}
                  >
                    {roles.map((role) => (
                      <option
                        key={role.roleId}
                        value={role.roleName}
                        className="uppercase"
                      >
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>

                <Buttons
                  type="submit"
                  disabled={updateRoleLoader || isHthAdmin}
                  className="bg-[#1e5146] px-4 py-2 rounded-md text-white transition active:scale-[0.95] disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {updateRoleLoader ? "Loading..." : "Update"}
                </Buttons>
              </form>
              {isHthAdmin && (
                <p className="text-sm text-red-600 mt-2">
                  The role cannot be changed.
                </p>
              )}
              {/* <button
                disabled= {!isValid}
                className="bg-[#1e5146] hover:text-slate-300 px-4 py-2 rounded-md text-white "
                onClick={handleUpdateRole}
              >
                {updateRoleLoader ? "Loading..." : "Update Role"}
              </button> */}
            </div>
              <form
                className="flex  flex-col  gap-2  "
                onSubmit={handleSubmit(handleSavePassword)}
              >
                <InputField
                  label="UserName"
                  required
                  id="username"
                  className="w-full"
                  type="text"
                  message="*UserName is required"
                  placeholder="Enter your UserName"
                  register={register}
                  errors={errors}
                  readOnly
                />
                <InputField
                  label="Email"
                  required
                  id="email"
                  className="flex-1"
                  type="text"
                  message="*Email is required"
                  placeholder="Enter your Email"
                  register={register}
                  errors={errors}
                  readOnly
                />
                <InputField
                  label="Password"
                  required
                  autoFocus={isEditingPassword}
                  id="password"
                  className="w-full"
                  type="password"
                  message="*Password is required"
                  placeholder="Enter your Password"
                  register={register}
                  errors={errors}
                  readOnly={!isEditingPassword}
                  min={6}
                />{" "}
                {!isEditingPassword ? (
                  <Buttons
                    type="button"
                    onClickhandler={() =>
                      setIsEditingPassword(!isEditingPassword)
                    }
                    className="bg-[#1e5146] mb-0 w-fit px-4 py-2 rounded-md text-white transition active:scale-[0.95]"
                  >
                    Click To Edit Password
                  </Buttons>
                ) : (
                  <div className="flex items-center gap-2 ">
                    <Buttons
                      type="submit"
                      disabled={passwordLoader || !isValid}
                      className="bg-[#1e5146] mb-0 w-fit px-4 py-2 rounded-md text-white transition active:scale-[0.95]"
                    >
                      {passwordLoader ? "Loading..." : "Save"}
                    </Buttons>
                    <Buttons
                      type="button"
                      disabled={passwordLoader}
                      onClickhandler={() => {
                        resetField("password");
                        setIsEditingPassword(false);
                      }}
                      className="bg-[#f22809] mb-0 w-fit px-4 py-2 rounded-md text-white transition active:scale-[0.95]"
                    >
                      Cancel
                    </Buttons>
                  </div>
                )}
              </form>
            </div>
          </div>
          {/* <div className="lg:w-[70%] sm:w-[90%] w-full  mx-auto shadow-lg shadow-gray-300 p-8 rounded-md"> */}
            {/* <h2 className="text-slate-800 text-2xl font-bold  pb-4">
              Admin Actions
              <hr />
            </h2> */}

            

            {/* <hr className="py-2" /> */}
            {/* <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-sm font-semibold uppercase">
                  {" "}
                  Lock Account
                </label>
                <input
                  className="text-14 w-5 h-5"
                  type="checkbox"
                  name="lock"
                  checked={!user?.accountNonLocked}
                  onChange={(e) =>
                    handleCheckboxChange(e, "/admin/update-lock-status")
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-sm font-semibold uppercase">
                  {" "}
                  Account Expiry
                </label>
                <input
                  className="text-14 w-5 h-5"
                  type="checkbox"
                  name="expire"
                  checked={!user?.accountNonExpired}
                  onChange={(e) =>
                    handleCheckboxChange(e, "/admin/update-expiry-status")
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-sm font-semibold uppercase">
                  {" "}
                  Account Enabled
                </label>
                <input
                  className="text-14 w-5 h-5"
                  type="checkbox"
                  name="enabled"
                  checked={user?.enabled}
                  onChange={(e) =>
                    handleCheckboxChange(e, "/admin/update-enabled-status")
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-sm font-semibold uppercase">
                  {" "}
                  Credentials Expired
                </label>
                <input
                  className="text-14 w-5 h-5"
                  type="checkbox"
                  name="credentialsExpire"
                  checked={!user?.credentialsNonExpired}
                  onChange={(e) =>
                    handleCheckboxChange(
                      e,
                      `/admin/update-credentials-expiry-status?userId=${userId}&expire=${user?.credentialsNonExpired}`
                    )
                  }
                />
              </div>
            </div> */}
          {/* </div> */}
        </>
      )}
    </div>
  );
};

export default UserDetails;
