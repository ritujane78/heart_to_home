import { Gift, MapPin } from 'lucide-react';
import { services } from '../data/services.js';
import GiftForm from './GiftForm.jsx';

function ServicesPage({
  selectedIds,
  selectedServices,
  serviceProviderNames,
  total,
  giftDetails,
  giftStarted,
  paymentReady,
  paymentMethod,
  giftFormRef,
  onToggle,
  onGiftNow,
  onGiftDetailsChange,
  onSubmitGift,
  onPaymentMethodChange,
  onReset
}) {
  return (
    <section className="services-layout">
      <div className="provider-banner">
        <MapPin aria-hidden="true" />
        <span>Kathmandu providers: {serviceProviderNames}</span>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Browse Services</p>
          <h1>Select health services to gift</h1>
        </div>
        <button className="primary-action compact" type="button" onClick={onGiftNow} disabled={selectedIds.length === 0}>
          <Gift aria-hidden="true" />
          Gift Now
        </button>
      </div>

      <div className="service-grid">
        {services.map((service) => (
          <label className={`service-card ${selectedIds.includes(service.id) ? 'selected' : ''}`} key={service.id}>
            <input
              type="checkbox"
              checked={selectedIds.includes(service.id)}
              onChange={() => onToggle(service.id)}
            />
            <div className="service-card-top">
              <span>{service.code}</span>
              <strong>NPR {service.price.toLocaleString()}</strong>
            </div>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </label>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <aside className="selection-summary">
          <div>
            <strong>{selectedServices.length} selected</strong>
            <span>Total NPR {total.toLocaleString()}</span>
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
