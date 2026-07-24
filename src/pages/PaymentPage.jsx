import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { useEffect, useRef } from "react";

export default function PaymentPage({
  selectedServices,
  giftDetails,
  total,
  formatMoney,
  paymentMethod,
  onPaymentMethodChange,
  onSaveOrder,
  isSaving,
}) {
  const submitButtonRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    submitButtonRef.current?.focus();
  }, []);

const location = useLocation();

if (
  selectedServices.length === 0 &&
  location.state?.fromOrder !== true
) {
  return <Navigate to="/services" replace />;
}
  return (
    <section className="mx-auto w-full max-w-7xl rounded-xl bg-white border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-sm">
      <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#1f6f5c]">
        Dummy Payment
      </p>
      <div className="mb-8 rounded-xl border border-gray-200 bg-white">
  <div className="flex items-center justify-between border-b p-4">
    <h3 className="text-lg font-semibold">Services Ordered</h3>

    <button
      type="button"
      onClick={() => navigate("/services")}
      className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
    >
      Edit
    </button>
  </div>

  <div className="divide-y">
    {selectedServices.map((service) => (
      <div
        key={service.id}
        className="flex justify-between p-4"
      >
        <span>
          {service.code} - {service.title}
        </span>

        <strong>{formatMoney(service.price)}</strong>
      </div>
    ))}

    <div className="flex justify-between p-4 text-lg font-bold">
      <span>Total</span>
      <span>{total}</span>
    </div>
  </div>
</div>
<div className="mb-8 rounded-xl border border-gray-200 bg-white">
  <div className="flex items-center justify-between border-b p-4">
    <h3 className="text-lg font-semibold">Gift Details</h3>

    <button
      type="button"
      onClick={() => navigate("/gift")}
      className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
    >
      Edit
    </button>
  </div>

  <div className="space-y-5 p-4">

    <div>
      <h4 className="font-semibold text-[#1f6f5c]">Recipient</h4>
      <p>{giftDetails.recipientName}</p>
      <p>{giftDetails.recipientPhone}</p>
      <p>{giftDetails.relationship}</p>
    </div>

    <div>
      <h4 className="font-semibold text-[#1f6f5c]">Sender</h4>
      <p>{giftDetails.senderName}</p>
      <p>{giftDetails.senderEmail}</p>
    </div>

    {giftDetails.message && (
      <div>
        <h4 className="font-semibold text-[#1f6f5c]">Message</h4>
        <p className="whitespace-pre-wrap">
          {giftDetails.message}
        </p>
      </div>
    )}
  </div>
</div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isSaving) {
            onSaveOrder();
          }
        }}
         onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            e.target.tagName !== "TEXTAREA"
          ) {
            e.preventDefault();
            e.currentTarget.requestSubmit();
          }
        }}
      >

      {/* Payment Options */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {["card", "paypal", "bank"].map((method) => (
          <label
            key={method}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all hover:border-[#1f6f5c] hover:shadow-md ${
              paymentMethod === method
                ? "border-[#1f6f5c] bg-green-50"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              className="h-5 w-5 accent-[#1f6f5c]"
              checked={paymentMethod === method}
              onChange={() => onPaymentMethodChange(method)}
            />

            <CreditCard
              size={22}
              className="text-[#1f6f5c] flex-shrink-0"
            />

            <span className="font-semibold text-gray-700">
              {method === "card"
                ? "International Card"
                : method === "paypal"
                ? "PayPal"
                : "Bank Transfer"}
            </span>
          </label>
        ))}
      </div>

      <button
        ref={submitButtonRef}
        type="submit"
        disabled={isSaving}
        className="w-full rounded-lg primary-action px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? "Processing Payment..." : "Confirm Dummy Payment"}
      </button>
    </form>
    </section>
  );
}