import { useEffect, useMemo, useState } from 'react';
import { Gift, MapPin } from 'lucide-react';
import { services } from '../data/services.js';
import GiftForm from './GiftForm.jsx';
import { useMyContext } from "../store/ContextApi";

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
  onReset
}) {
  const { token } = useMyContext();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredServices = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return services;
    }

    return services.filter((service) => service.title.toLowerCase().includes(normalizedQuery));
  }, [searchQuery]);

  return (
    <section className="services-layout">
      <div className="provider-banner">
        <MapPin aria-hidden="true" />
        <span>Kathmandu providers: {serviceProviderNames}</span>
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
              <strong>Note:</strong> The <strong>Gift Now</strong> button will be enabled only after you sign in and select one or more services.
            </p>
          )}

          <button
            className="primary-action compact"
            type="button"
            onClick={onGiftNow}
            disabled={!token || selectedIds.length === 0}
          >
            <Gift aria-hidden="true" />
            Gift Now
          </button>
        </div>
      </div>

      <div className="service-grid">
        {filteredServices.map((service) => (
          <label className={`service-card ${selectedIds.includes(service.id) ? 'selected' : ''}`} key={service.id}>
            <input
              type="checkbox"
              checked={selectedIds.includes(service.id)}
              onChange={() => onToggle(service.id)}
            />
            <div className="service-card-top">
              <span>{service.code}</span>
              <strong>{formatMoney(service.price)}</strong>
            </div>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </label>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="empty-services">
          <strong>No services found</strong>
          <p>Try searching with another service title.</p>
        </div>
      )}

      {selectedServices.length > 0 && (
        <aside className="selection-summary">
          <div>
            <strong>{selectedServices.length} selected</strong>
            <span>Total {formatMoney(total)}</span>
          </div>
          <p>{selectedServices.map((service) => service.code).join(', ')}</p>
        </aside>
      )}

      {giftStarted && selectedServices.length > 0 && (
        <GiftForm
          giftFormRef={giftFormRef}
          giftDetails={giftDetails}
          selectedServices={selectedServices}
          total={total}
          formatMoney={formatMoney}
          paymentReady={paymentReady}
          paymentMethod={paymentMethod}
          onChange={onGiftDetailsChange}
          onSubmit={onSubmitGift}
          onPaymentMethodChange={onPaymentMethodChange}
          onReset={onReset}
        />
      )}
    </section>
  );
}

export default ServicesPage;
