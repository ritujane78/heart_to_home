import { useEffect, useMemo, useState } from "react";
import {
  Gift,
  MapPin,
  Trash2,
  SearchX,
  Inbox,
  CircleOff,
  BriefcaseMedical,
  Info,
  X,
  Pencil,
  Plus,
  Hospital,
  RotateCcw,
} from "lucide-react";
import GiftForm from "./GiftForm.jsx";
import { useMyContext } from "../store/ContextApi";
import toast from "react-hot-toast";
import api from "../services/api";
import TablePagination from "@mui/material/TablePagination";
import ProviderModal from "./admin/ProviderModal.jsx";
import RestoreServiceModal from "./admin/RestoreServiceModal.jsx";
import ServiceModal from "./admin/ServiceModal.jsx";
import { scrollToTop } from "../utils/ScrollToTop.js";
import { handleApiError } from "../utils/errorHandler.js";
import { useSearchParams } from "react-router-dom";

function ServicesPage({
  selectedIds,
  selectedServices,
  serviceProviderNames,
  total,
  selectedCurrency,
  currencies,
  formatMoney,
  onToggle,
  onCurrencyChange,
  onGiftNow,
  services,
  fetchServices,
  totalPages,
  totalServices,
  onServiceDeleted,
  disabledServices,
  fetchDisabledServices,
}) {
  const { token, isAdmin } = useMyContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showGiftInfo, setShowGiftInfo] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showRestoreServicesModal, setShowRestoreServicesModal] =
    useState(false);
  const [mode, setMode] = useState("add");
  const [providers, setProviders] = useState([]);
  const [editingService, setEditingService] = useState({
    id: null,
    code: "",
    title: "",
    description: "",
    price: "",
    providerId: "",
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;

      setShowGiftInfo(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await api.get("/providers");
      setProviders(response.data);
    } catch (error) {
      handleApiError(error, "Unable to load providers.");
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);
  const pageParam = searchParams.get("p");

  let page = pageParam === null ? 1 : Number(pageParam);

  const isValidPage = Number.isInteger(page) && page > 0;

  useEffect(() => {
    if (!searchParams.has("p")) {
      setSearchParams({ p: "1" }, { replace: true });
    }
  }, []);
  useEffect(() => {
    if (searchQuery === "") return;

    setSearchParams({ p: "1" }, { replace: true });
  }, [searchQuery]);

  useEffect(() => {
    if (!isValidPage) {
      return;
    }
    fetchServices(page, searchQuery);
  }, [page, searchQuery]);

  const filteredServices = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return services;
    }

    return services.filter((service) =>
      service.title.toLowerCase().includes(normalizedQuery),
    );
  }, [services, searchQuery]);

  const handlePageChange = (event, newPage) => {
    const pageNumber = newPage + 1;

    page = pageNumber;

    setSearchParams((params) => {
      params.set("p", pageNumber.toString());
      return params;
    });
  };

  useEffect(() => {
    scrollToTop();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/delete-service/${id}`);

      // Remove deleted service from selectedIds
      onServiceDeleted(id);

      toast.success("Service deleted successfully");

      fetchServices(page, searchQuery);
      setPage(1);
    } catch (err) {
      toast.error("Failed to delete service");
      handleApiError(error, "Unable to delete the service.");
    }
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditClick = (service) => {
    setMode("edit");
    setShowServiceModal(true);
    setEditingService({
      id: service.id,
      code: service.code,
      title: service.title,
      description: service.description,
      price: service.price,
      providerId: service.provider?.id ?? "",
    });

    // setShowEditModal(true);
  };
  const handleAddClick = () => {
    setEditingService(null);
    setMode("add");
    setShowServiceModal(true);
  };
  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/services/admin/update-service/${editingService.id}`, {
        ...editingService,
        providerId: Number(editingService.providerId),
        price: Number(editingService.price),
      });

      toast.success("Service updated successfully");

      setShowEditModal(false);

      await fetchServices(page, searchQuery);
    } catch (err) {
      toast.error("Failed to update service");
      handleApiError(error, "Unable to update the service.");
    }
  };

  return (
    <>
      <ServiceModal
        open={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        setShowServiceModal={setShowServiceModal}
        mode={mode}
        service={editingService}
        providers={providers}
        fetchServices={fetchServices}
        currentPage={page}
        searchQuery={searchQuery}
      />
      <ProviderModal
        open={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        setShowProviderModal={setShowProviderModal}
        fetchProviders={fetchProviders}
        providers={providers}
      />
      <RestoreServiceModal
        open={showRestoreServicesModal}
        disabledServices={disabledServices}
        fetchServices={fetchServices}
        fetchDisabledServices={fetchDisabledServices}
        onClose={() => setShowRestoreServicesModal(false)}
        setShowRestoreServicesModal={setShowRestoreServicesModal}
      />
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
            <h2>Select services to gift</h2>
          </div>

          <div className="button-wrapper">
            <div className="flex items-center justify-end gap-1 whitespace-nowrap">
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
                  -translate-y-3
                  text-[#1F6F5C]
                  hover:text-[#174d40]
                  transition
                  focus:outline-none
                  focus:ring-0
                  outline-none
                "
                aria-label="Gift information"
                title="Button info"
              >
                <Info size={18} />
              </button>
            </div>
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-end justify-end gap-8 mt-3 py-5">
            <button
              onClick={handleAddClick}
              className="outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-none"
              title="Add Services"
            >
              <div className="w-10 h-10 rounded-full bg-[#c05242] flex items-center justify-center hover:scale-105">
                <Plus className="text-white" size={18} />
              </div>
            </button>

            <button
              onClick={() => setShowProviderModal(true)}
              className="outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-none"
              title="Add Providers"
            >
              <div className="w-10 h-10 rounded-full bg-[#c05242] flex items-center justify-center hover:scale-105">
                <Hospital className="text-white" size={20} />
              </div>
            </button>

            <button
              onClick={() => setShowRestoreServicesModal(true)}
              className="outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-none"
              title="Restore Services"
            >
              <div className="w-10 h-10 rounded-full bg-[#c05242] flex items-center justify-center hover:scale-105">
                <RotateCcw className="text-white" size={18} />
              </div>
            </button>
          </div>
        )}

        {selectedServices.length > 0 && (
          <aside className="selection-summary">
            <div>
              <strong>{selectedServices.length} selected</strong>
              <span>Total {total}</span>
            </div>
            <p>{selectedServices.map((service) => service.code).join(", ")}</p>
          </aside>
        )}
        <div className="service-grid">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`service-card flex h-44 sm:h-60 lg:h-60 flex-col ${
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
                    onClick={() => handleEditClick(service)}
                    className="outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-none"
                    title="Edit"
                  >
                    <Pencil size={16} className="text-[#1e5146] " />
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm(`Delete "${service.title}"?`)) return;

                      await handleDelete(service.id);
                    }}
                    className="outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-none"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-[#c05242]" />
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

              <h2 className="line-clamp-2">{service.title}</h2>

              <p className="mt-2 h-15 sm:h-16 lg:h-22 overflow-y-auto overflow-x-hidden break-words whitespace-pre-wrap pr-1 text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="mt-18 px-24 flex flex-col items-center justify-center py-8 text-gray-500">
            <SearchX className="w-12 h-12 mb-3 text-gray-400" />
            <strong>No services found</strong>
          </div>
        )}
        {isValidPage && (
        <div className="mt-8 flex justify-end overflow-hidden rounded-xl">
          <TablePagination
            component="div"
            count={totalServices}
            page={page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={6}
            rowsPerPageOptions={[]}
            labelRowsPerPage=""
          />
        </div>
        )}
        <div className="provider-banner mt-5">
          <BriefcaseMedical className="provider-icon" aria-hidden="true" />

          <span className="provider-label">Associate Partners:</span>

          {serviceProviderNames ? (
            <span className="provider-value">{serviceProviderNames}</span>
          ) : (
            <span className="no-provider">
              <CircleOff size={16} />
              No partner available
            </span>
          )}
        </div>
        {showGiftInfo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="presentation"
            onMouseDown={() => setShowGiftInfo(false)}
          >
            <div
              className="relative w-full max-w-md rounded-xl bg-white shadow-2xl p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gift-info-title"
              onMouseDown={(e) => e.stopPropagation()}
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
                  The <strong>Gift Now</strong> button will be enabled only
                  after you:
                </p>

                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Log in to your account.</li>
                  <li>Select one or more healthcare services.</li>
                </ul>

                <div className="mt-4 rounded-lg bg-[#F5F9F8] border border-[#D6E7E2] p-3 text-sm">
                  Once both conditions are met, you can proceed to complete your
                  gift purchase.
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default ServicesPage;
