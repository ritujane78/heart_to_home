const InputField = ({
  label,
  id,
  type = "text",
  errors = {},
  register,
  required = false,
  message = "",
  className = "",
  min,
  autoFocus = false,
  placeholder = "",
  readOnly = false,
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className="font-semibold text-md text-slate-800"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoFocus={autoFocus}
        readOnly={readOnly}
        className={`px-2 py-2 border outline-none bg-transparent text-slate-700 rounded-md ${
          autoFocus ? "border-2" : ""
        } ${
          errors[id]?.message ? "border-red-500" : "border-slate-700"
        }`}
        {...register(id, {
          required: {
            value: required,
            message,
          },
          minLength: min
            ? {
                value: min,
                message: `Minimum ${min} characters are required`,
              }
            : undefined,
        })}
      />

      {errors[id]?.message && (
        <p className="mt-0 text-sm font-semibold text-red-500">
          {errors[id].message}*
        </p>
      )}
    </div>
  );
};

export default InputField;