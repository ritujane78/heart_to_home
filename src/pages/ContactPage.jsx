import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionData, setActionData] = useState(null);

  const labelStyle =
    "mb-2 block text-sm font-semibold text-primary dark:text-light sm:text-base";

  const textFieldStyle =
    "block w-full min-w-0 rounded-md border border-primary bg-white px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-dark dark:border-light dark:bg-gray-600 dark:text-lighter dark:placeholder-gray-300 dark:focus:ring-lighter sm:px-4 sm:text-base";

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    setIsSubmitting(true);
    setActionData(null);

    const formData = new FormData(form);

    const contactData = {
      name: formData.get("name"),
      email: formData.get("email"), 
      mobileNumber: formData.get("mobileNumber"),
      message: formData.get("message"),
      countryCode: formData
        .get("countryCode")
        .replace("+", "")
        .padStart(3, "0"),
    };

    try {
      await api.post("/contacts", contactData);

      setActionData({ success: true });
      form.reset();
      toast.success("Your message has been submitted successfully.");
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.validationErrors) {
        setActionData({
          success: false,
          errors: {
            ...responseData.validationErrors,
            general: null,
          },
        });
      } else {
        setActionData({
          success: false,
          errors: {
            general:
              responseData?.message ||
              responseData?.errorMessage ||
              "Failed to submit your message. Please try again.",
          },
        });
        toast.error(responseData.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full overflow-x-clip px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-8xl">
        {/* Page heading and contact details */}
        <header className="mb-8 sm:mb-12">
          <h4 className=" eyebrow py-2 text-3xl font-bold text-[#1f6f5c] sm:text-4xl lg:text-5xl">
            Contact Us
          </h4>

          <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
            <a
              href="tel:+9779800000000"
              className="flex min-w-0 items-center gap-2 text-sm text-[#65707b] hover:text-[#1f6f5c] sm:text-base"
            >
              <Phone className="h-5 w-5 shrink-0 text-[#1f6f5c]" />
              <span>+977-980-000-0000</span>
            </a>

            <a
              href="mailto:teamhearttohome@gmail.com"
              className="flex min-w-0 items-center gap-2 text-sm text-[#65707b] hover:text-[#1f6f5c] sm:text-base"
            >
              <Mail className="h-5 w-5 shrink-0 text-[#1f6f5c]" />
              <span className="break-all sm:break-normal">
                teamhearttohome@gmail.com
              </span>
            </a>
          </div>
        </header>

        {/* Introduction */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="text-2xl font-bold leading-tight text-[#65707b] sm:text-3xl lg:text-4xl">
            We'd Love to Hear From You
          </div>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#65707b] sm:text-base sm:leading-7">
            Share your thoughts, questions, or suggestions. Your feedback helps
            us make Heart to Home better for everyone.
          </p>
        </div>

        {/* Contact form */}
        <div className="mx-auto w-full max-w-8xl">
          {actionData?.errors?.general && (
            <p
              role="alert"
              className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600"
            >
              {actionData.errors.general}
            </p>
          )}

          {actionData?.success && (
            <p
              role="status"
              className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700"
            >
              Your message has been submitted successfully.
            </p>
          )}

          <form
            method="POST"
            onSubmit={handleSubmit}
            className="w-full min-w-0 space-y-5 rounded-lg bg-white p-4 shadow-sm sm:space-y-6 sm:p-6 md:p-8"
          >
            {/* Name */}
            <div className="min-w-0">
              <label htmlFor="name" className={labelStyle}>
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                className={textFieldStyle}
                required
                minLength={5}
                maxLength={30}
                autoComplete="name"
              />

              {actionData?.errors?.name && (
                <p className="mt-1 text-sm text-red-500">
                  {actionData.errors.name}
                </p>
              )}
            </div>

            {/* Email and mobile: stack on mobile, side by side on larger screens */}
            <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              <div className="min-w-0">
                <label htmlFor="email" className={labelStyle}>
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  className={textFieldStyle}
                  required
                  autoComplete="email"
                />

                {actionData?.errors?.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {actionData.errors.email}
                  </p>
                )}
              </div>
              <div className="min-w-0">
                <label htmlFor="mobileNumber" className={labelStyle}>
                  Mobile Number
                </label>
                <div className="flex w-full min-w-0 gap-2">
                  <div className="relative">
                    <select
                      id="countryCode"
                      name="countryCode"
                      defaultValue="+977"
                      aria-label="Country code"
                      className={`${textFieldStyle} !w-[85px] !min-w-[85px] !max-w-[85px] shrink-0 px-1`}
                      required
                    >
                      <option value="+977">🇳🇵 +977</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+86">🇨🇳 +86</option>
                    </select>

                    {actionData?.errors?.countryCode && (
                      <p className="absolute left-0 top-full mt-1 whitespace-nowrap text-sm text-red-500">
                        {actionData.errors.countryCode}
                      </p>
                    )}
                  </div>

                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    inputMode="numeric"
                    placeholder="Your Mobile Number"
                    className={`${textFieldStyle} !w-0 min-w-0 flex-1`}
                    required
                    pattern="[0-9]{10}"
                    title="Mobile number must be exactly 10 digits"
                    autoComplete="tel-national"
                  />
                </div>

                {actionData?.errors?.mobileNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {actionData.errors.mobileNumber}
                  </p>
                )}

                {actionData?.errors?.mobileNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {actionData.errors.mobileNumber}
                  </p>
                )}

                {actionData?.errors?.mobileNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {actionData.errors.mobileNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="min-w-0">
              <label htmlFor="message" className={labelStyle}>
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Share your thoughts..."
                className={`${textFieldStyle} resize-y`}
                required
                minLength={5}
                maxLength={500}
              />

              {actionData?.errors?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {actionData.errors.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-1 text-center sm:pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-action compact w-full transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? "Submitting..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
