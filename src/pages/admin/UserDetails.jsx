import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField/InputField";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { handleApiError } from "../../utils/errorHandler";
import Loading from "../../components/Loading";
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
  const { handleSubmit: handleRoleSubmit } = useForm({
    mode: "onTouched",
  });
  const navigate = useNavigate();

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
      setError("");
    } catch (error) {
      handleApiError(error, "Unable to load user details.");

      setError(error.response?.data?.message || "Unable to load user details.");

      console.error("Error fetching user details", error);
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
    } catch (error) {
      handleApiError(error, "Unable to load roles.");

      setError(error.response?.data?.message || "Unable to load roles.");

      console.error("Error fetching roles", error);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchRoles();
  }, [fetchUserDetails, fetchRoles]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };
  //set the selected role
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

      await fetchUserDetails();

      toast.success("Role updated successfully");
    } catch (error) {
      handleApiError(error, "Failed to update user role.");
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
      toast.success("Password update success");
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

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <Loading />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="overflow-hidden rounded-2xl">
          <div className="flex justify-between bg-none px-6 py-5 ">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 rounded-md px-4 py-2 transition hover:bg-white/30 active:scale-95"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <h2 className="flex-1 text-center text-xs sm:text-2xl font-bold">
              User Details
            </h2>

            <div className="w-24" />
          </div>
          <div className="p-8 bg-white">
            {isHthAdmin && (
              <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                The role and password of this admin cannot be changed.
              </p>
            )}
            <div className="mb-8 rounded-xl border bg-gray-50 p-6">
              <h3 className="mb-5 text-lg font-semibold text-gray-700">
                Role Management
              </h3>
              <form
                onSubmit={handleRoleSubmit(handleUpdateRole)}
                className="flex flex-col gap-4 md:flex-row md:items-center"
              >
                <div className="flex items-center gap-2">
                  <label className="font-medium text-gray-700">Role</label>

                  <select
                    className="
                      rounded-lg
                      border
                      border-gray-300
                      px-4
                      py-2
                      uppercase
                      focus:border-[#1e5146]
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#1e5146]/20
                      disabled:bg-gray-100
                      "
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
                  className="
                    rounded-lg
                    bg-[#1e5146]
                    px-6
                    py-2
                    text-white
                    transition
                    hover:bg-[#18453c]
                    active:scale-95
                    disabled:bg-gray-400
                    "
                >
                  {updateRoleLoader ? "Loading..." : "Update"}
                </Buttons>
              </form>
            </div>
            <h3 className="mb-6 text-lg font-semibold text-gray-700">
              Account Information
            </h3>
            <form
              className="space-y-5"
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
                  className="
                      rounded-lg
                      bg-[#1e5146]
                      px-5
                      py-2
                      text-white
                      transition
                      hover:bg-[#18453c]
                      active:scale-95"
                  disabled={isHthAdmin}
                >
                  Click To Edit Password
                </Buttons>
              ) : (
                <div className="flex items-center gap-2 ">
                  <Buttons
                    type="submit"
                    disabled={passwordLoader || !isValid}
                    className="
                        rounded-lg
                        bg-[#1e5146]
                        px-6
                        py-2
                        text-white
                        transition
                        hover:bg-[#18453c]
                        active:scale-95
                        "
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
                    className="
                        rounded-lg
                        bg-red-500
                        px-6
                        py-2
                        text-white
                        transition
                        hover:bg-red-600
                        active:scale-95
                        "
                  >
                    Cancel
                  </Buttons>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
