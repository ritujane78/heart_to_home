import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  resetField,
  validation = {},
  disableCopyPaste = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (readOnly) {
      setShowPassword(false);
    }
  }, [readOnly]);

  const inputType =
    type === "password" && showPassword ? "text" : type;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className="font-semibold text-md text-slate-800"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          autoFocus={autoFocus}
          readOnly={readOnly}
          disabled={disabled}
          className={`w-full px-2 py-2 pr-10 border outline-none bg-transparent text-slate-700 rounded-md
            ${readOnly ? "cursor-default" : "cursor-text"}
            disabled:bg-slate-100 disabled:cursor-not-allowed
            ${autoFocus ? "border-2" : ""}
            ${errors[id]?.message ? "border-red-500" : "border-slate-700"}
          `}
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

        {type === "password" && !readOnly && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-[#1e5146]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {errors[id]?.message && (
        <p className="mt-0 text-sm font-semibold text-red-500">
          {errors[id].message}
        </p>
      )}
    </div>
  );
};

export default InputField;