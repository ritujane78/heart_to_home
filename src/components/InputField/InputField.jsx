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
  disabled = false,
  validation = {},
  disableCopyPaste = false,
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
        disabled={disabled}
        className={`px-2 py-2 border outline-none bg-transparent text-slate-700 rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed ${
          autoFocus ? "border-2" : ""
        } ${
          errors[id]?.message ? "border-red-500" : "border-slate-700"
        }`}
        onCopy={disableCopyPaste ? (e) => e.preventDefault() : undefined}
        onCut={disableCopyPaste ? (e) => e.preventDefault() : undefined}
        onPaste={disableCopyPaste ? (e) => e.preventDefault() : undefined}
        {...register(id, {
          required: required
            ? {
                value: true,
                message,
              }
            : false,
          minLength: min
            ? {
                value: min,
                message: `Minimum ${min} characters are required`,
              }
            : undefined,
          ...validation,
        })}
      />

      {errors[id]?.message && (
        <p className="mt-0 text-sm font-semibold text-red-500">
          {errors[id].message}
        </p>
      )}
    </div>
  );
};

export default InputField;