import { CheckCircle2, CreditCard } from 'lucide-react';
import { relationships } from '../data/services.js';
import { useState } from 'react';
import { Navigate } from "react-router-dom";


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
    onReset, 
    onSaveOrder
  }) {
    const [isSaving, setIsSaving] = useState(false);
    if (selectedServices.length === 0) {
      return <Navigate to="/services" replace />;
  }
    const handleSaveOrder = () => {
      if (isSaving) return;

      setIsSaving(true);
      onSaveOrder();
    };
    return (
      <section className='gift-page'>
        <section
          ref={giftFormRef}
          className="w-full px-4 md:px-8 lg:px-12 py-6"
        >
          <form
            className="w-full max-w-none mx-auto"
            onSubmit={onSubmit}
          >
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
                  name="recipientPhone"
                  value={giftDetails.recipientPhone}
                  onChange={onChange}
                  placeholder="Phone number"
                  required
                />
                <input
                  name="recipientEmail"
                  value={giftDetails.recipientEmail}
                  onChange={onChange}
                  placeholder="Email (optional)"
                />
              </label>

              <label className='full-width'>
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
                  name="senderEmail"
                  value={giftDetails.senderEmail}
                  onChange={onChange}
                  placeholder="Email"
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

            <div className="flex justify-center mt-8">
              <button className="primary-action" type="submit">
                <CheckCircle2 aria-hidden="true" />
                Continue to Payment
              </button>
            </div>
          </form>
        </section>
      </section>
    );
  }

  export default GiftForm;
