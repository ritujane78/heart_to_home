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
}) => {
  const [loading, setLoading] = useState(false);
  const [disabledServices, setDisabledServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [restoring, setRestoring] = useState(false);
  
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
    formState: { errors },
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

  const onSubmit = async (data) => {
    try {
        setLoading(true);

        const payload = {
        providerId: data.providerId,
        code: data.code.trim().toUpperCase(),
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
    <div className="max-w-xl mx-auto mt-10 shadow-custom p-6 rounded-lg flex flex-col gap-4">

      <h2 className="text-2xl font-bold text-center text-[#1e5146]">
          Restore Deleted Service
      </h2>

      <div>
          <label className="block mb-1 font-medium">
              Disabled Services
          </label>

          <select
              className="w-full border rounded-md p-2"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
          >
              <option value="">Select Service</option>

              {disabledServices.map(service => (
                  <option
                      key={service.id}
                      value={service.id}
                  >
                      {service.code} - {service.title}
                  </option>
              ))}
          </select>
      </div>

      <Buttons
          disabled={restoring || !selectedServiceId}
          onClickhandler={handleRestore}
          className="bg-[#1e5146] text-white w-full py-2 rounded-md"
      >
          {restoring ? "Restoring..." : "Restore Service"}
      </Buttons>

  </div>
    <form
      className="max-w-xl mx-auto shadow-custom p-6 rounded-lg flex flex-col gap-3"
    >
      <h2 className="text-2xl font-bold text-center text-[#1e5146]">
        Add Service
      </h2>

      <div>
        <InputField
          label="Service Code"
          id="code"
          required
          type="text"
          placeholder="HSGHC"
          message="Service code is required"
          register={register}
          errors={errors}
      />
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
        disabled={loading}
        onClickhandler={handleSubmit(onSubmit)}
        className="bg-[#1e5146] text-white w-full py-2 rounded-md hover:scale-[1.03] transition"
      >
        {loading ? "Saving..." : "Add Service"}
      </Buttons>
    </form>
    </>
  );
};

export default AddService;