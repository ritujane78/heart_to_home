// pages/DummyPaymentPage.jsx

import { CreditCard } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function PaymentPage({
  selectedServices,
  total,
  formatMoney,
  paymentMethod,
  onPaymentMethodChange,
  onSaveOrder,
  isSaving,
}) {
  if (selectedServices.length === 0) {
    return <Navigate to="/services" replace />;
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl bg-white border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-sm">
      <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#1f6f5c]">
        Dummy Payment
      </p>

      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Payment Summary
      </h2>

      {/* Receipt */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50">
        {selectedServices.map((service) => (
          <div
            key={service.id}
            className="flex flex-col gap-2 border-b border-gray-200 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="font-medium text-gray-700 break-words">
              {service.code} - {service.title}
            </span>

            <strong className="text-[#1f6f5c]">
              {formatMoney(service.price)}
            </strong>
          </div>
        ))}

        <div className="flex flex-col gap-2 bg-white p-4 text-lg font-bold sm:flex-row sm:items-center sm:justify-between">
          <span>Total</span>
          <span className="text-[#1f6f5c]">
            {formatMoney(total)}
          </span>
        </div>
      </div>

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

      {/* Button */}
      <button
        onClick={onSaveOrder}
        disabled={isSaving}
        className="w-full rounded-lg bg-[#1f6f5c] px-6 py-3 font-semibold text-white transition hover:bg-[#174f42] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Processing..." : "Confirm Dummy Payment"}
      </button>
    </section>
  );
}