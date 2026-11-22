import { Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "../services/api";
import toast from "react-hot-toast";

function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      countryCode: "+977",
      mobileNumber: "",
      message: "",
    },
    mode: "onTouched",
  });

  const message = watch("message");

  const labelStyle =
    "mb-2 block text-sm font-semibold text-primary dark:text-light sm:text-base";

  const textFieldStyle =
    "block w-full min-w-0 rounded-md border border-primary bg-white px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-dark dark:border-light dark:bg-gray-600 dark:text-lighter dark:placeholder-gray-300 dark:focus:ring-lighter sm:px-4 sm:text-base";

  async function onSubmit(data) {
    const contactData = {
      ...data,
      countryCode: data.countryCode.replace("+", "").padStart(3, "0"),
    };

    try {
      await api.post("/contacts", contactData);

      toast.success("Your message has been submitted successfully.");
      reset();
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.validationErrors) {
        Object.entries(responseData.validationErrors).forEach(
          ([field, message]) => {
            setError(field, {
              type: "server",
              message,
            });
          },
        );
      } else {
        const errorMessage =
          responseData?.message ||
          responseData?.errorMessage ||
          "Failed to submit your message. Please try again.";

        toast.error(errorMessage);

        setError("root.server", {
          type: "server",
          message: errorMessage,
        });
      }
    }
  }

  return (
    <section className="w-full overflow-x-clip px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-8xl">
        {/* Page heading and contact details */}
        <header className="mb-8 sm:mb-12">
          <h4 className="eyebrow py-2 text-3xl font-bold text-[#1f6f5c] sm:text-4xl lg:text-5xl">
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
          {errors.root?.server && (
            <p
              role="alert"
              className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600"
            >
              {errors.root.server.message}
            </p>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full min-w-0 space-y-5 rounded-lg bg-white p-4 shadow-sm sm:space-y-6 sm:p-6 md:p-8"
          >
            {/* Name */}
            <div className="min-w-0">
              <label htmlFor="name" className={labelStyle}>
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Your Name"
                className={textFieldStyle}
                autoComplete="name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 5,
                    message: "Name must be at least 5 characters",
                  },
                  maxLength: {
                    value: 30,
                    message: "Name cannot exceed 30 characters",
                  },
                })}
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email and mobile */}
            <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              {/* Email */}
              <div className="min-w-0">
                <label htmlFor="email" className={labelStyle}>
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  className={textFieldStyle}
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="min-w-0">
                <label htmlFor="mobileNumber" className={labelStyle}>
                  Mobile Number
                </label>

                <div className="flex w-full min-w-0 gap-2">
                  {/* Country Code */}
                  <div className="shrink-0">
                    <select
                      id="countryCode"
                      aria-label="Country code"
                      className={`${textFieldStyle} !w-[85px] !min-w-[85px] !max-w-[85px] px-1`}
                      {...register("countryCode", {
                        required: "Country code is required",
                      })}
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

                    {errors.countryCode && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.countryCode.message}
                      </p>
                    )}
                  </div>

                  {/* Phone number */}
                  <input
                    id="mobileNumber"
                    type="tel"
                    inputMode="numeric"
                    placeholder="Your Mobile Number"
                    className={`${textFieldStyle} !w-0 min-w-0 flex-1`}
                    autoComplete="tel-national"
                    {...register("mobileNumber", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Mobile number must be exactly 10 digits",
                      },
                    })}
                  />
                </div>

                {errors.mobileNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.mobileNumber.message}
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
                rows={4}
                placeholder="Share your thoughts..."
                className={`${textFieldStyle} resize-y`}
                {...register("message", {
                  required: "Message is required",
                  minLength: {
                    value: 5,
                    message: "Message must be at least 5 characters",
                  },
                  maxLength: {
                    value: 500,
                    message: "Message cannot exceed 500 characters",
                  },
                })}
              />

              <span className="mt-1 block text-right text-xs text-gray-500">
                {message.length}/500
              </span>

              {errors.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-1 text-center sm:pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
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
