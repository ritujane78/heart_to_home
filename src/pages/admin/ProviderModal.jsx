import { useState, useEffect } from "react";
import InputField from "../../components/InputField/InputField";
import { useForm } from "react-hook-form";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import api from "../../services/api";
import { X } from "lucide-react";
import { handleApiError } from "../../utils/errorHandler";

const ProviderModal = ({ open, onClose, providers, fetchProviders }) => {
  const [providerLoading, setProviderLoading] = useState(false);
  const {
    register: registerProvider,
    handleSubmit: handleProviderSubmit,
    reset: resetProvider,
    formState: { errors: providerErrors, isValid: isProviderValid },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const onProviderSubmit = async (data) => {
    try {
      setProviderLoading(true);

      await api.post("/providers", {
        name: data.name.trim(),
      });

      toast.success("Provider added successfully!");

      resetProvider();

      await fetchProviders();
      onClose();
    } catch (error) {
      handleApiError(
        error,
        "Failed to add provider."
      );
    } finally {
      setProviderLoading(false);
    }
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <form className="max-w-xl mx-auto mt-8 shadow-custom p-6 rounded-lg flex flex-col gap-3" onSubmit={handleProviderSubmit(onProviderSubmit)}>
          <h2 className="text-2xl font-bold text-center text-[#1e5146]">
            Add Provider
          </h2>

          <div className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <InputField
                label="Provider Name"
                id="name"
                required
                type="text"
                placeholder="e.g. Clinic Center D"
                message="Provider name is required"
                register={registerProvider}
                errors={providerErrors}
              />
            </div>

            <Buttons
            type="submit"
              disabled={providerLoading || !isProviderValid}
              className="bg-[#1e5146] text-white px-6 py-2 whitespace-nowrap"
            >
              {providerLoading ? "Saving..." : "Add Provider"}
            </Buttons>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderModal;
