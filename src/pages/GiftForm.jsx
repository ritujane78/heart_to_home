import { CheckCircle2, CreditCard } from 'lucide-react';
import { relationships } from '../data/services.js';
import { useState, useMemo } from 'react';
import { Navigate } from "react-router-dom";


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
    onReset, 
    onSaveOrder
  }) {
    if (selectedServices.length === 0) {
      return <Navigate to="/services" replace />;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nepalPhoneRegex = /^(01\d{6}|9[78]\d{8})$/;

const errors = useMemo(() => {
  const e = {};

  if (!giftDetails.recipientName.trim()) {
    e.recipientName = "Recipient name is required.";
  }

  if (!giftDetails.recipientPhone.trim()) {
    e.recipientPhone = "Phone number is required.";
  } else if (!nepalPhoneRegex.test(giftDetails.recipientPhone.trim())) {
    e.recipientPhone =
      "Enter a valid Kathmandu landline (01XXXXXX) or Nepal mobile (97XXXXXXXX / 98XXXXXXXX).";
  }

  if (
    giftDetails.recipientEmail.trim() &&
    !emailRegex.test(giftDetails.recipientEmail.trim())
  ) {
    e.recipientEmail = "Enter a valid email address.";
  }

  if (!giftDetails.senderName.trim()) {
    e.senderName = "Sender name is required.";
  }

  if (!giftDetails.senderEmail.trim()) {
    e.senderEmail = "Sender email is required.";
  } else if (!emailRegex.test(giftDetails.senderEmail.trim())) {
    e.senderEmail = "Enter a valid email address.";
  }

  if (!giftDetails.message.trim()) {
    e.message = "Message is required.";
  }

  return e;
}, [giftDetails]);

const isFormValid = Object.keys(errors).length === 0;

    return (
      <section className='gift-page'>
        <section
          ref={giftFormRef}
          className="w-full px-4 md:px-8 lg:px-12 py-6"
        >
          <form
            className="w-full max-w-none mx-auto"
            onSubmit={(e) => {
              if (!isFormValid) {
                e.preventDefault();
                return;
              }

              onSubmit(e);
            }}
          >

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
                {errors.recipientName && (
                  <small className="text-red-600">{errors.recipientName}</small>
                )}
              </label>

              <label>
                <span>Contact Details</span>
                <input
                  name="recipientPhone"
                  value={giftDetails.recipientPhone}
                  onChange={onChange}
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9801234567 or 01423456"
                />
                <small className="text-gray-500">
                  Enter a Kathmandu landline (01XXXXXX) or a Nepal mobile number (97XXXXXXXX or 98XXXXXXXX).
                </small>
                {errors.recipientPhone && (
                  <small className="text-red-600">{errors.recipientPhone}</small>
                )}
                <input
                  type='email'
                  autoComplete="email"
                  name="recipientEmail"
                  value={giftDetails.recipientEmail}
                  onChange={onChange}
                  placeholder="Email (optional)"
                />
                {errors.recipientEmail && (
                  <small className="text-red-600">{errors.recipientEmail}</small>
                )}
              </label>

            <div className="form-section full-width">
              {/* <label className='full-width'> */}
                <h3>Relationship</h3>
                <select
                className='full-width'
                  name="relationship"
                  value={giftDetails.relationship}
                  onChange={onChange}
                >
                  {relationships.map((relationship) => (
                    <option key={relationship}>{relationship}</option>
                  ))}
                </select>
              {/* </label> */}
            </div> 
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
                {errors.senderName && (
                  <small className="text-red-600">{errors.senderName}</small>
                )}
              </label>

              <label>
                <span>Contact Details</span>
                <input
                  name="senderEmail"
                  type='email'
                  autoComplete="email"
                  value={giftDetails.senderEmail}
                  onChange={onChange}
                  placeholder="Email"
                  required
                />
                {errors.senderEmail && (
                  <small className="text-red-600">{errors.senderEmail}</small>
                )}
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Message to Recipient</h3>

            <label className="message-field">
              {/* <span>Message to Recipient</span> */}
              <textarea
                name="message"
                value={giftDetails.message}
                onChange={onChange}
                rows="5"
                placeholder="Write a thoughtful message to accompany your gift..."
              />
              {errors.message && (
                <small className="text-red-600">{errors.message}</small>
              )}
            </label>
          </div>

            <div className="flex justify-center mt-8">
              <button
                className="primary-action disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={!isFormValid}
              >
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
