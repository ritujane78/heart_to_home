import toast from "react-hot-toast";

export const handleApiError = (
  error,
  fallbackMessage = "Something went wrong.",
  setError,
) => {
  console.error(error);

  const showError = (message) => {
    toast.error(message, {
      id: `api-error-${message}`,
    });
  };

  // Network error
  if (!error.response) {
    showError(
      "Unable to connect. Please check your internet connection and try again."
    );
    return;
  }

  const { status, data } = error.response;

  // Field validation errors from Spring Boot
  if (data?.validationErrors) {
    const validationErrors = data.validationErrors;

    if (setError) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field, {
          type: "server",
          message,
        });
      });
    } else {
      Object.values(validationErrors).forEach(showError);
    }

    return;
  }

  switch (status) {
    case 400:
      showError(data?.message || fallbackMessage);
      break;

    case 401:
      showError(data?.message || "Invalid username or password.");
      break;

    case 403:
      showError(data?.message || "You are not authorized.");
      break;

    case 404:
      showError(data?.message || "Requested resource not found.");
      break;

    case 409:
      showError(data?.message || "Duplicate record.");
      break;

    case 500:
      showError(
        data?.message ||
          "Something went wrong on our end. Please try again later."
      );
      break;

    case 503:
      showError(
        data?.message ||
          "Service temporarily unavailable. Please try again later."
      );
      break;

    default:
      showError(data?.message || fallbackMessage);
  }
};
