import React, { useState } from "react";
import { FiAlertCircle, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Enhanced Input Component with Validation
 */
const ValidatedInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  validator,
  required = false,
  disabled = false,
  className = "",
  showStrength = false,
  strength = null,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange?.(newValue);

    // Validate on change if validator provided
    if (validator) {
      const result = validator(newValue);
      setValidationResult(result);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const displayError = error || (touched && validationResult?.error);
  const isValid = validationResult?.isValid && touched;

  const getStrengthColor = () => {
    switch (strength) {
      case "weak":
        return "bg-red-500";
      case "fair":
        return "bg-yellow-500";
      case "good":
        return "bg-blue-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg transition focus:outline-none focus:ring-2 ${
            displayError
              ? "border-red-500 focus:ring-red-500"
              : isValid
              ? "border-green-500 focus:ring-green-500"
              : "border-gray-300 focus:ring-blue-500"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
          {...props}
        />

        {/* Password Toggle */}
        {type === "password" && value && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}

        {/* Validation Icons */}
        {touched && (
          <div className="absolute right-3 top-2.5">
            {displayError ? (
              <FiAlertCircle className="text-red-500 text-xl" />
            ) : isValid ? (
              <FiCheck className="text-green-500 text-xl" />
            ) : null}
          </div>
        )}
      </div>

      {/* Password Strength Indicator */}
      {showStrength && strength && (
        <div className="space-y-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getStrengthColor()} transition-all`}
              style={{
                width:
                  strength === "weak"
                    ? "25%"
                    : strength === "fair"
                    ? "50%"
                    : strength === "good"
                    ? "75%"
                    : "100%"
              }}
            />
          </div>
          <p className="text-xs text-gray-600 capitalize">
            Password strength: <span className="font-semibold">{strength}</span>
          </p>
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <div className="flex items-start space-x-2 text-red-600 text-sm">
          <FiAlertCircle className="flex-shrink-0 mt-0.5" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Success Message */}
      {isValid && !displayError && (
        <div className="flex items-start space-x-2 text-green-600 text-sm">
          <FiCheck className="flex-shrink-0 mt-0.5" />
          <span>Looks good!</span>
        </div>
      )}
    </div>
  );
};

export default ValidatedInput;
