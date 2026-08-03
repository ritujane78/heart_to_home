import toast from "react-hot-toast";

export const handleApiError = (
  error,
  fallbackMessage = "Something went wrong.",
  setError
) => {
  console.error(error);

  // Network error
  if (!error.response) {
    toast.error(
      "Unable to connect. Please check your internet connection and try again."
    );
    return;
  }

  const { status, data } = error.response;

  // Validation errors from Spring Boot
  if (data?.validationErrors) {
    Object.entries(data.validationErrors).forEach(([field, message]) => {
      if (setError) {
        setError(field, {
          type: "server",
          message,
        });
      }

      // toast.error(message);
    });

    return;
  }

  switch (status) {
    case 400:
      toast.error(data?.message || fallbackMessage);
      break;

    case 401:
      toast.error(data?.message || "Invalid username or password.");
      break;

    case 403:
      toast.error(data?.message || "You are not authorized.");
      break;

    case 404:
      toast.error(data?.message || "Requested resource not found.");
      break;

    case 409:
      toast.error(data?.message || "Duplicate record.");
      break;

    case 500:
      toast.error(
        data?.message ||
          "Something went wrong on our end. Please try again later."
      );
      break;

    default:
      toast.error(data?.message || fallbackMessage);
  }
};