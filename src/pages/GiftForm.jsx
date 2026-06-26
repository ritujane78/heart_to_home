  import { CheckCircle2, CreditCard } from 'lucide-react';
  import { relationships } from '../data/services.js';

  function GiftForm({
    giftFormRef,
    giftDetails,
    selectedServices,
    total,
    formatMoney,
    paymentReady,
    paymentMethod,
    onChange,
    onSubmit,
    onPaymentMethodChange,
    onReset
  }) {
    return (
      <section className="gift-flow" ref={giftFormRef}>
        <form className="gift-form" onSubmit={onSubmit}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Gift details</p>
              <h3>Who is receiving this care?</h3>
            </div>
          </div>

          <div className="form-section">
          <h3>Recipient Details</h3>

          <div className="form-grid">
            <label>
              <span>Full Name</span>
              <input
                name="recipientName"
                value={giftDetails.recipientName}
                onChange={onChange}
                placeholder="Enter recipient's full name"
                required
              />
            </label>

            <label>
              <span>Contact Details</span>
              <input
                name="recipientContact"
                value={giftDetails.recipientContact}
                onChange={onChange}
                placeholder="Phone number or email"
                required
              />
            </label>

            <label>
              <span>Relationship</span>
              <select
                name="relationship"
                value={giftDetails.relationship}
                onChange={onChange}
              >
                {relationships.map((relationship) => (
                  <option key={relationship}>{relationship}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Sender Details</h3>

          <div className="form-grid">
            <label>
              <span>Full Name</span>
              <input
                name="senderName"
                value={giftDetails.senderName}
                onChange={onChange}
                placeholder="Enter your full name"
                required
              />
            </label>

            <label>
              <span>Contact Details</span>
              <input
                name="senderContact"
                value={giftDetails.senderContact}
                onChange={onChange}
                placeholder="Phone number or email"
                required
              />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Personal Message</h3>

          <label className="message-field">
            <span>Message to Recipient</span>
            <textarea
              name="message"
              value={giftDetails.message}
              onChange={onChange}
              rows="5"
              placeholder="Write a thoughtful message to accompany your gift..."
            />
          </label>
        </div>

          <button className="primary-action" type="submit">
            <CheckCircle2 aria-hidden="true" />
            Continue to Payment
          </button>
        </form>

        {paymentReady && (
          <section className="payment-panel">
            <p className="eyebrow">Dummy payment</p>
            <h2>Payment summary</h2>
            <div className="receipt">
              {selectedServices.map((service) => (
                <div key={service.id}>
                  <span>{service.code} - {service.title}</span>
                  <strong>{formatMoney(service.price)}</strong>
                </div>
              ))}
              <div className="receipt-total">
                <span>Total to pay</span>
                <strong>{formatMoney(total)}</strong>
              </div>
            </div>
            <div className="payment-options" role="radiogroup" aria-label="Payment options">
              {['card', 'paypal', 'bank'].map((method) => (
                <label className={paymentMethod === method ? 'active' : ''} key={method}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => onPaymentMethodChange(method)}
                  />
                  <CreditCard aria-hidden="true" />
                  <span>{method === 'card' ? 'International Card' : method === 'paypal' ? 'PayPal' : 'Bank Transfer'}</span>
                </label>
              ))}
            </div>
            <button className="primary-action full" type="button" onClick={onReset}>
              Confirm Dummy Payment
            </button>
          </section>
        )}
      </section>
    );
  }

  export default GiftForm;
