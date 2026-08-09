import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import api from "../../services/api";
import InputField from "../../components/InputField/InputField";
import Buttons from "../../utils/Buttons";
import { handleApiError } from "../../utils/errorHandler";

const RestoreServiceModal = ({
  open,
  onClose,
  disabledServices,
  fetchServices,
  fetchDisabledServices,
  setShowRestoreServicesModal,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [restoring, setRestoring] = useState(false);
  useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key !== "Escape") return;
        setShowRestoreServicesModal(false);
      };
  
      window.addEventListener("keydown", handleKeyDown);
  
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

  const handleRestore = async () => {
    if (!selectedServiceId) {
      toast.error("Please select a service.");
      return;
    }

    try {
      setRestoring(true);

      await api.put(`/admin/enable-service/${selectedServiceId}`);

      toast.success("Service restored successfully!");

      setSelectedServiceId("");

      await fetchServices();
      fetchDisabledServices();
      onClose();
    } catch {
      toast.error("Unable to restore service.");
      handleApiError("error", "Unable to restore the service.");
    } finally {
      setRestoring(false);
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
          onSubmit={(e) => {
            e.preventDefault();
            handleRestore();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleRestore();
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
          <div className="max-w-xl mx-auto mt-10 shadow-custom p-6 rounded-lg flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center text-[#1e5146]">
              Restore Deleted Service
            </h2>

            <div>
              <label className="block mb-1 font-medium">
                Disabled Services
              </label>

              <div className="flex flex-col md:flex-row gap-3">
                <select
                  className="flex-1 border rounded-md p-2"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                >
                  <option value="">Select Service</option>

                  {disabledServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.code} - {service.title}
                    </option>
                  ))}
                </select>

                <Buttons
                  type="submit"
                  disabled={restoring || !selectedServiceId}
                  className="bg-[#1e5146] text-white px-6 py-2 whitespace-nowrap"
                >
                  {restoring ? "Restoring..." : "Restore Service"}
                </Buttons>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestoreServiceModal;
