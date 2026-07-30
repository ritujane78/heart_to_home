import { CheckCircle2, CreditCard, Info, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { useMyContext } from '../store/ContextApi.jsx';
import { relationships } from '../data/defaultValues.js';


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
    const {currentUser} = useMyContext();
    const [showPhoneInfo, setShowPhoneInfo] = useState(false);
    useEffect(() => {
      console.log("user = " + JSON.stringify(currentUser));
      
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setShowPhoneInfo(false);
        }
      };
      if (!giftDetails.senderEmail && currentUser?.email) {
        onChange({
          target: {
            name: "senderEmail",
            value: currentUser.email,
          },
        });
      }

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    
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
      "Enter a valid number.";
  }

  // if (
  //   giftDetails.recipientEmail.trim() &&
  //   !emailRegex.test(giftDetails.recipientEmail.trim())
  // ) {
  //   e.recipientEmail = "Enter a valid email address.";
  // }

  if (!giftDetails.senderName.trim()) {
    e.senderName = "Sender name is required.";
  }

  if (!giftDetails.senderEmail.trim()) {
    e.senderEmail = "Sender email is required.";
  } else if (!emailRegex.test(giftDetails.senderEmail.trim())) {
    e.senderEmail = "Enter a valid email address.";
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
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                e.target.tagName !== "TEXTAREA"
              ) {
                e.preventDefault();

                if (isFormValid) {
                  e.currentTarget.requestSubmit();
                }
              }
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
               <div className="flex items-center justify-between mb-1">
              <span>Contact Details</span>

              <button
                type="button"
                onClick={() => setShowPhoneInfo(true)}
                className="ml-[2px] text-[#1F6F5C] hover:text-[#174d40] transition"
                aria-label="Phone number format"
              >
                <Info size={18} />
              </button>
            </div>

            <input
              name="recipientPhone"
              value={giftDetails.recipientPhone}
              onChange={onChange}
              inputMode="numeric"
              maxLength={10}
              placeholder="9xxxxxxxxx or 01xxxxxxx"
            />
                {errors.recipientPhone && (
                  <small className="text-red-600">{errors.recipientPhone}</small>
                )}
                {/* <input
                  type='email'
                  autoComplete="email"
                  name="recipientEmail"
                  value={giftDetails.recipientEmail}
                  onChange={onChange}
                  placeholder="Email (optional)"
                />
                {errors.recipientEmail && (
                  <small className="text-red-600">{errors.recipientEmail}</small>
                )} */ }
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
                maxLength={1000}
                rows="5"
                placeholder="[optional] Write a thoughtful message to accompany your gift..."
                className='w-full rounded-lg border border-gray-300 px-4 py-3 resize-none
                            placeholder:text-gray-400
                            focus:placeholder:opacity-0
                            focus:border-[#1F6F5C] focus:outline-none focus:ring-2 focus:ring-[#1F6F5C]/20'
              />
                <span className="mt-1 self-end text-xs text-gray-500">
                  {giftDetails.message.length}/1000
                </span>
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
          {showPhoneInfo && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowPhoneInfo(false)}
            >
              <div
                className="relative w-full max-w-md rounded-xl bg-white shadow-2xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setShowPhoneInfo(false)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

                <h3 className="text-lg font-semibold text-[#1F6F5C] mb-4">
                  Phone Number Format
                </h3>

                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    Please enter one of the following Nepal phone number formats:
                  </p>

                  <div className="rounded-lg bg-gray-100 p-3">
                    <p className="font-medium">Kathmandu Landline</p>
                    <p className="font-mono mt-1">01XXXXXX</p>
                    <p className="text-gray-600">Example: 01423456</p>
                  </div>

                  <div className="rounded-lg bg-gray-100 p-3">
                    <p className="font-medium">Nepal Mobile</p>
                    <p className="font-mono mt-1">97XXXXXXXX</p>
                    <p className="font-mono">98XXXXXXXX</p>
                    <p className="text-gray-600">Example: 9801234567</p>
                  </div>

                  <p className="text-xs text-gray-500">
                    Only Kathmandu landline numbers and Nepal mobile numbers are accepted.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </section>
    );
  }

  export default GiftForm;
