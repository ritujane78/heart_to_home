import { useEffect, useMemo, useState } from 'react';
import { Gift, MapPin, Trash2, SearchX, Inbox, CircleOff , BriefcaseMedical, Info, X, Pencil } from 'lucide-react';
// import { services } from '../data/services.js';
import GiftForm from './GiftForm.jsx';
import { useMyContext } from "../store/ContextApi";
import toast from "react-hot-toast";
import api from "../services/api";
import Pagination from "@mui/material/Pagination";

function ServicesPage({
  selectedIds,
  selectedServices,
  serviceProviderNames,
  total,
  selectedCurrency,
  currencies,
  exchangeRateStatus,
  formatMoney,
  giftDetails,
  giftStarted,
  paymentReady,
  paymentMethod,
  giftFormRef,
  onToggle,
  onCurrencyChange,
  onGiftNow,
  onGiftDetailsChange,
  onSubmitGift,
  onPaymentMethodChange,
  onReset,
  services,
  fetchServices,
  totalPages,
  onServiceDeleted,
  onSaveOrder
}) {
  const { token, isAdmin } = useMyContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showGiftInfo, setShowGiftInfo] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [providers, setProviders] = useState([]);

  const [editingService, setEditingService] = useState({
    id: null,
    code: "",
    title: "",
    description: "",
    price: "",
    providerId:""
  });
  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await api.get("/providers");
      setProviders(response.data);
    } catch (err) {
      toast.error("Failed to load providers");
    }
  };

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowGiftInfo(false);
      setShowEditModal(false);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchServices(page, searchQuery);
  }, [page, searchQuery]);

  const filteredServices = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    
    if (!normalizedQuery) {
      return services;
    }
    
    return services.filter((service) => service.title.toLowerCase().includes(normalizedQuery));
  }, [services, searchQuery]);
  

    const handlePageChange = (event, value) => {
      setPage(value);
    };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/delete-service/${id}`);

      // Remove deleted service from selectedIds
      onServiceDeleted(id);

      toast.success("Service deleted successfully");

      await fetchServices();
      setPage(1);
    } catch (err) {
      toast.error("Failed to delete service");
    }
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingService((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleEditClick = (service) => {
    setEditingService({
      id: service.id,
      code: service.code,
      title: service.title,
      description: service.description,
      price: service.price,
      providerId: service.provider?.id ?? ""

    });

    setShowEditModal(true);
  };
  const handleUpdateService = async (e) => {
    e.preventDefault();

    try {
        await api.put(
            `/services/admin/update-service/${editingService.id}`,
            {
                ...editingService,
                providerId: Number(editingService.providerId),
                price: Number(editingService.price)
            }
        );

        toast.success("Service updated successfully");

        setShowEditModal(false);

        await fetchServices(page, searchQuery);

    } catch (err) {
        toast.error("Failed to update service");
    }
};

  return (
    <section className="services-layout">
      <div className="currency-toolbar">
        <label className="service-search" htmlFor="service-search">
          <input
            id="service-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by service title"
          />
        </label>

        <label htmlFor="currency-select">
          <select
            className="currency-select"
            id="currency-select"
            value={selectedCurrency}
            onChange={(event) => onCurrencyChange(event.target.value)}
          >
            {currencies.map((currency) => (
              <option value={currency.code} key={currency.code}>
                {currency.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="section-heading">
        <div className="heading-content">
          <p className="eyebrow">Browse Services</p>
          <h2>Select health services to gift</h2>
        </div>

        <div className="button-wrapper">
          <div className="flex items-center justify-end gap-2 whitespace-nowrap">
          <button
            className="primary-action compact transition active:scale-[0.95]"
            type="button"
            onClick={onGiftNow}
            disabled={!token || selectedIds.length === 0}
          >
            <Gift aria-hidden="true" />
            Gift Now
          </button>
          <button
            type="button"
            onClick={() => setShowGiftInfo(true)}
            className="
              text-[#1F6F5C]
              hover:text-[#174d40]
              transition
              focus:outline-none
              focus:ring-0
              outline-none
            "
            aria-label="Gift information"
          >
            <Info size={18} />
          </button>
          </div>
        </div>
      </div>

        {selectedServices.length > 0 && (
        <aside className="selection-summary">
          <div>
            <strong>{selectedServices.length} selected</strong>
            <span>Total { total}</span>
          </div>
          <p>{selectedServices.map((service) => service.code).join(', ')}</p>
        </aside>
      )}
      <div className="service-grid">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`service-card ${
              selectedIds.includes(service.id) ? "selected" : ""
            }`}
            onClick={() => onToggle(service)}
          >
            {isAdmin && (
              <div
                className="absolute bottom-3 left-3 flex gap-2 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="text-green-600 hover:text-green-800"
                  onClick={() => handleEditClick(service)}
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  className="text-red-600 hover:text-red-800"
                  onClick={async () => {
                    if (!window.confirm(`Delete "${service.title}"?`))
                      return;

                    await handleDelete(service.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            <input
              type="checkbox"
              checked={selectedIds.includes(service.id)}
              onChange={() => onToggle(service)}
              onClick={(e) => e.stopPropagation()}
            />

            <div className="service-card-top">
              <span>{service.code}</span>
              <strong>{formatMoney(service.price)}</strong>
            </div>

            <h2>{service.title}</h2>

            <p>{service.description}</p>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
      <div className="mt-18 px-24 flex flex-col items-center justify-center py-8 text-gray-500">
          <SearchX className="w-12 h-12 mb-3 text-gray-400" />
          <strong>No services found</strong>
        </div>
      )}
      <div className="flex justify-end mt-8">
        <Pagination
          page={page}
          count={totalPages}
          // color="red"
          shape="rounded"
          onChange={handlePageChange}
        />
      </div>
        <div className="provider-banner mt-5">
        <BriefcaseMedical aria-hidden="true" />
        <span className="provider-text">
          Associate Partners:{" "}
          {serviceProviderNames ? (
            serviceProviderNames
          ) : (
            <span className="no-provider">
              <CircleOff size={16} />
            </span>
          )}
        </span>
      </div>
      {showGiftInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowGiftInfo(false)}
        >
          <div
            className="relative w-full max-w-md rounded-xl bg-white shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowGiftInfo(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold text-[#1F6F5C] mb-4">
              Note
            </h3>

            <div className="text-gray-700 leading-relaxed">
              <p>
                The <strong>Gift Now</strong> button will be enabled only after you:
              </p>

              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Log in to your account.</li>
                <li>Select one or more healthcare services.</li>
              </ul>

              <div className="mt-4 rounded-lg bg-[#F5F9F8] border border-[#D6E7E2] p-3 text-sm">
                Once both conditions are met, you can proceed to complete your gift purchase.
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <form
      onSubmit={handleUpdateService}
      className="relative w-full max-w-xl rounded-xl bg-white p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setShowEditModal(false)}
        className="absolute right-4 top-4"
      >
        <X size={20} />
      </button>

      <h2 className="mb-6 text-xl font-bold text-[#1F6F5C]">
        Edit Service
      </h2>

      <div className="space-y-4">
        <div>
    <label className="block mb-1 font-medium">
        Provider
    </label>

    <select
        name="providerId"
        value={editingService.providerId}
        onChange={handleEditChange}
        className="w-full rounded border p-2"
    >
        <option value="">
            Select Provider
        </option>

        {providers.map((provider) => (
            <option
                key={provider.id}
                value={provider.id}
            >
                {provider.name}
            </option>
        ))}
    </select>
</div>

        <div>
          <label>Code</label>
          <input
            name="code"
            value={editingService.code}
            onChange={handleEditChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label>Title</label>
          <input
            name="title"
            value={editingService.title}
            onChange={handleEditChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            rows={4}
            name="description"
            value={editingService.description}
            onChange={handleEditChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label>Price (in NPR)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={editingService.price}
            onChange={handleEditChange}
            className="w-full border rounded p-2"
          />
        </div>

      </div>

      <button
        type="submit"
        className="mt-6 rounded bg-[#1F6F5C] px-5 py-2 text-white"
      >
        Update
      </button>

    </form>
  </div>
)}
    </section>
  );
}

export default ServicesPage;
