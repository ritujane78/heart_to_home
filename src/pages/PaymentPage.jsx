import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { currencySymbols } from "../utils/currencyUtils";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { handleApiError } from "../utils/errorHandler";
import { useState } from "react";
import sorry from "../assets/images/sorry.png";

const elementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1F2937",
      fontFamily: '"Inter", sans-serif',
      "::placeholder": {
        color: "#9CA3AF",
      },
      iconColor: "#1f6f5c",
    },
    invalid: {
      color: "#DC2626",
    },
  },
};

export default function PaymentPage({
  selectedServices,
  giftDetails,
  total,
  formatMoney,
  resetGift,
}) {
  const [checkoutId] = useState(() => crypto.randomUUID());
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  if (selectedServices.length === 0 && location.state?.fromOrder !== true) {
    return <Navigate to="/services" replace />;
  }
  const stripe = useStripe();
  const elements = useElements();

  const waitForPaymentOrderStatus = async (paymentIntentId) => {
    for (let i = 0; i < 10; i++) {
      const response = await api.get(
        `/orders/payments/${paymentIntentId}/payment-status`,
      );

      const status = response.data.paymentOrderStatus;

      if (status === "ORDER_SAVED") {
        return status;
      }

      if (status === "ORDER_SAVE_FAILED") {
        return status;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return "PENDING";
  };
  const checkout = async () => {
    if (!stripe || !elements || isSaving) return;

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      toast.error("Please enter your card details.");
      return;
    }
    setPaymentError("");
    setIsSaving(true);

    try {
      // Determine currency and amount
      const currencyEntry = Object.entries(currencySymbols).find(([, symbol]) =>
        total.startsWith(symbol),
      );

      if (!currencyEntry) {
        throw new Error(`Unsupported currency format: ${total}`);
      }

      const [currency, symbol] = currencyEntry;

      const { data } = await api.post("/orders/checkout", {
        checkoutId,

        recipientName: giftDetails.recipientName,

        recipientPhone: giftDetails.recipientPhone,

        relationship: giftDetails.relationship,

        senderName: giftDetails.senderName,

        senderEmail: giftDetails.senderEmail,

        message: giftDetails.message,

        serviceIds: selectedServices.map((s) => s.id),

        currency: currency,
      });
      if (data.alreadyCompleted) {
        // Don't call Stripe again.
        // The payment is already done.
        toast.success("Order placed successfuly.");
        resetGift();
        navigate("/my-orders");
        return;
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardNumberElement,

          billing_details: {
            name: giftDetails.senderName,

            email: giftDetails.senderEmail,
          },
        },
      });
      if (result.error) {
        toast.error(result.error.message || "Payment failed.");
        return;
      }

      if (result.paymentIntent?.status !== "succeeded") {
        toast.error("Payment was not completed.");
        return;
      }

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      if (result.paymentIntent?.status === "succeeded") {
        const orderStatus = await waitForPaymentOrderStatus(
          result.paymentIntent.id,
        );

        if (orderStatus === "ORDER_SAVED") {
          toast.success("Order placed successfuly.");
          resetGift();

          navigate("/my-orders", {
            replace: true,
          });
          return;
        } else {
          setPaymentError(
            "Payment was successful, but we couldn't confirm your order. Please contact the Heart to Home support team.",
          );

          return;
        }
      }
    } catch (error) {
      handleApiError(error, "Something went wrong during checkout.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl bg-white border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-sm">
      <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#1f6f5c]">
        Payment
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
            <div key={service.id} className="flex justify-between p-4">
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
              <p className="whitespace-pre-wrap">{giftDetails.message}</p>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isSaving) {
            checkout();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
            e.currentTarget.requestSubmit();
          }
        }}
      >
        {/* Payment Options */}
        <div className="mb-2 flex justify-center">
          <div className="w-full max-w-3xl rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b px-4 py-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Details
              </h3>
            </div>

            <div className="space-y-5 p-5">
              {/* Card Number */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <div className="flex items-center rounded-lg border border-gray-300 px-4 py-3 focus-within:border-[#1f6f5c] focus-within:ring-2 focus-within:ring-[#1f6f5c]/20">
                  <CreditCard size={20} className="mr-3 text-[#1f6f5c]" />
                  <div className="flex-1">
                    <CardNumberElement options={elementOptions} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Expiry */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <div className="rounded-lg border border-gray-300 px-4 py-3 focus-within:border-[#1f6f5c] focus-within:ring-2 focus-within:ring-[#1f6f5c]/20">
                    <CardExpiryElement options={elementOptions} />
                  </div>
                </div>

                {/* CVC */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Security Code
                  </label>
                  <div className="rounded-lg border border-gray-300 px-4 py-3 focus-within:border-[#1f6f5c] focus-within:ring-2 focus-within:ring-[#1f6f5c]/20">
                    <CardCvcElement options={elementOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {paymentError && (
          <div className="flex flex-col items-center text-center">
            <img
              src={sorry}
              alt="sorry"
              className="h-24 w-24 object-contain"
            />

            <p className="mb-3 text-sm font-medium text-red-600">{paymentError}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-lg primary-action px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Processing Payment..." : "Confirm Payment"}
        </button>
      </form>
    </section>
  );
}
