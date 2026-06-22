import { CheckCircle2, CreditCard } from 'lucide-react';
import { relationships } from '../data/services.js';

function GiftForm({
  giftFormRef,
  giftDetails,
  selectedServices,
  total,
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
            <h2>Who is receiving this care?</h2>
          </div>
        </div>

        <div className="form-grid">
          <label>
            To name
            <input name="recipientName" value={giftDetails.recipientName} onChange={onChange} required />
          </label>
          <label>
            To contact details
            <input name="recipientContact" value={giftDetails.recipientContact} onChange={onChange} required />
          </label>
          <label>
            Relationship
            <select name="relationship" value={giftDetails.relationship} onChange={onChange}>
              {relationships.map((relationship) => (
                <option key={relationship}>{relationship}</option>
              ))}
            </select>
          </label>
          <label>
            From name
            <input name="senderName" value={giftDetails.senderName} onChange={onChange} required />
          </label>
          <label>
            From contact details
            <input name="senderContact" value={giftDetails.senderContact} onChange={onChange} required />
          </label>
          <label className="wide">
            Message to recipient
            <textarea name="message" value={giftDetails.message} onChange={onChange} rows="4" />
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
                <strong>NPR {service.price.toLocaleString()}</strong>
              </div>
            ))}
            <div className="receipt-total">
              <span>Total to pay</span>
              <strong>NPR {total.toLocaleString()}</strong>
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
