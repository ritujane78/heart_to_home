import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import api from "../../services/api";
import InputField from "../../components/InputField/InputField";
import Buttons from "../../utils/Buttons";
import { handleApiError } from "../../utils/errorHandler";

const ServiceModal = ({
  open,
  onClose,
  mode,
  service,
  providers,
  fetchServices,
  currentPage,
  searchQuery,
}) => {
  const isEdit = mode === "edit";
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      providerId: "",
      title: "",
      description: "",
      price: "",
    },
  });
  useEffect(() => {
    if (open && service) {
      reset({
        providerId: service.providerId ?? "",
        title: service.title ?? "",
        description: service.description ?? "",
        price: service.price ?? "",
        code: service.code ?? "",
      });
    } else if (open && mode === "add") {
      reset({
        providerId: "",
        title: "",
        description: "",
        price: "",
        code: "",
      });
    }
  }, [open, service, mode, reset]);
  const validateTitle = async (title) => {
    if (!title.trim()) return "Title is required";

    if (mode === "add") {
      try {
        const response = await api.get("/admin/title-exists", {
          params: { title: title.trim() },
        });

        return response.data
          ? "A service with this title already exists."
          : true;
      } catch (error) {
        return "Unable to validate title.";
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        providerId: data.providerId,
        title: data.title,
        description: data.description,
        price: Number(data.price),
        enabled: true,
      };

      if (isEdit) {
        await api.put(`/services/admin/update-service/${service.id}`, {
          ...payload,
          code: data.code,
        });

        toast.success("Service updated successfully!");
      } else {
        await api.post("/admin/add-service", payload);

        toast.success("Service added successfully!");
      }

      reset();

      await fetchServices(currentPage, searchQuery);

      onClose();
    } catch (error) {
      handleApiError(
        error,
        isEdit ? "Failed to update the service." : "Failed to add the service.",
      );
    } finally {
      setLoading(false);
    }
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-center text-[#1e5146]">
            {mode === "edit" ? "Edit" : "Add"} Service
          </h2>

          {isEdit && (
            <InputField
              label="Code"
              id="code"
              register={register}
              errors={errors}
            />
          )}

          <div>
            <label className="block mb-1 font-medium">Provider</label>

            <select
              {...register("providerId", {
                required: "Provider is required",
              })}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Provider</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>

            {errors.providerId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.providerId.message}
              </p>
            )}
          </div>

          <InputField
            label="Title"
            id="title"
            required
            type="text"
            placeholder="eg. General Health Checkup"
            register={register}
            validation={{
              required: "Title is required",
              validate: validateTitle,
            }}
            errors={errors}
          />

          <div>
            <label className="font-medium">Description</label>

            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows={4}
              className="w-full border rounded p-2 max-h-20 overflow-y-auto resize-none"
              placeholder="Enter description..."
            />

            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <InputField
            label="Price (in NPR)"
            id="price"
            required
            type="number"
            placeholder="8500"
            message="Price in NPR is required"
            register={register}
            errors={errors}
          />
          <Buttons
            type="submit"
            disabled={!isValid || (mode === "add" && loading)}
            className="bg-[#1e5146] text-white w-full py-2 rounded-md hover:scale-[1.03] transition"
          >
            {loading ? "Saving..." : mode === "edit" ? "Update" : "Add Service"}
          </Buttons>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
