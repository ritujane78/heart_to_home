import { useEffect, useMemo, useState } from 'react';
import { Gift, MapPin, Trash2, SearchX, Inbox, CircleOff } from 'lucide-react';
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

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchServices(page, searchQuery);
  }, [page, searchQuery]);
  // useEffect(() => {
  //   fetchServices(page - 1, 6); // Spring uses 0-based pages
  // }, [page]);
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

  return (
    <section className="services-layout">
      <div className="provider-banner">
        <MapPin aria-hidden="true" />
        <span className="provider-text">
          Kathmandu providers:{" "}
          {serviceProviderNames ? (
            serviceProviderNames
          ) : (
            <span className="no-provider">
              <CircleOff size={16} />
            </span>
          )}
        </span>
      </div>
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
          {(!token || selectedIds.length === 0) && (
            <p className="gift-note">
              <strong>Note:</strong> The <strong>Gift Now</strong> button will be enabled only after you log in and select one or more services.
            </p>
          )}

          <button
            className="primary-action compact transition active:scale-[0.98]"
            type="button"
            onClick={onGiftNow}
            disabled={!token || selectedIds.length === 0}
          >
            <Gift aria-hidden="true" />
            Gift Now
          </button>
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
              <button
                type="button"
                className="delete-service-btn"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (!window.confirm(`Delete "${service.title}"?`)) {
                    return;
                  }

                  await handleDelete(service.id);
                }}
              >
                <Trash2 size={16} />
              </button>
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

    </section>
  );
}

export default ServicesPage;
