import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import api from "../../services/api";
import InputField from "../../components/InputField/InputField";
import Buttons from "../../utils/Buttons";

const AddService = ({
    fetchServices,
    services,
    providers,
    fetchProviders,
}) => {
  const [loading, setLoading] = useState(false);
  const [disabledServices, setDisabledServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [providerLoading, setProviderLoading] = useState(false);

  
  const fetchDisabledServices = async () => {
    const response = await api.get("/admin/disabled-services");
    setDisabledServices(response.data);
  };

useEffect(() => {
    fetchDisabledServices();
}, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      providerId: "",
      title: "",
      description: "",
      price: "",
    },
  });
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
        await fetchDisabledServices();

    } catch {
        toast.error("Unable to restore service.");
    } finally {
        setRestoring(false);
    }
};

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

  } catch (error) {
    if (error.response?.status === 409) {
      toast.error(error.response.data);
    } else {
      toast.error("Failed to add provider.");
    }
  } finally {
    setProviderLoading(false);
  }
};

  const onSubmit = async (data) => {
    try {
        setLoading(true);
        console.log(data.providerId)

        const payload = {
        providerId: data.providerId,  
        title: data.title,
        description: data.description,
        price: Number(data.price),
        enabled: true
    };

    await api.post("/admin/add-service", payload);

    
    reset();
    
    await fetchServices();
    
    toast.success("Service added successfully!");

    } catch (error) {
        const message =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Failed to add service.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
    <form
      className="max-w-xl mx-auto shadow-custom p-6 rounded-lg flex flex-col gap-3"
    >
      <h2 className="text-2xl font-bold text-center text-[#1e5146]">
        Add Service
      </h2>

      <div>
        <label className="block mb-1 font-medium">
            Provider <span className="text-red-500">*</span>
        </label>

        <select
            {...register("providerId", {
            required: "Provider is required",
            })}
            className="w-full border rounded-md p-2"
        >
            <option value="">Select Provider</option>
            {providers.map((provider) => (
                <option
                    key={provider.id}
                    value={provider.id}
                >
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
        placeholder="General Health Checkup"
        message="Title is required"
        register={register}
        errors={errors}
      />

      <div>
        <label className="font-medium">Description</label>

        <textarea
          {...register("description", {
            required: "Description is required",
          })}
          rows={4}
          className="w-full border rounded p-2"
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
        disabled={loading || !isValid}
        onClickhandler={handleSubmit(onSubmit)}
        className="bg-[#1e5146] text-white w-full py-2 rounded-md hover:scale-[1.03] transition"
      >
        {loading ? "Saving..." : "Add Service"}
      </Buttons>
    </form>
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
                <option
                    key={service.id}
                    value={service.id}
                >
                    {service.code} - {service.title}
                </option>
            ))}
        </select>

        <Buttons
            disabled={restoring || !selectedServiceId}
            onClickhandler={handleRestore}
            className="bg-[#1e5146] text-white px-6 py-2 whitespace-nowrap"
        >
            {restoring ? "Restoring..." : "Restore Service"}
        </Buttons>
    </div>
</div>

  </div>
    <form
      className="max-w-xl mx-auto mt-8 shadow-custom p-6 rounded-lg flex flex-col gap-3"
    >
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
            disabled={providerLoading || !isProviderValid}
            onClickhandler={handleProviderSubmit(onProviderSubmit)}
            className="bg-[#1e5146] text-white px-6 py-2 whitespace-nowrap"
        >
            {providerLoading ? "Saving..." : "Add Provider"}
        </Buttons>

    </div>
    </form>
    </>
  );
};

export default AddService;