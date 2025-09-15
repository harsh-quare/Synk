import { useState } from "react";

const EyeIcon = ({ closed }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400 hover:text-gray-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {closed ? (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 
          0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 
          3 0 114.243 4.243M9.878 9.878l4.242 4.242"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3l18 18"
        />
      </>
    ) : (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.522 5 12 
          5c4.478 0 8.268 2.943 9.542 7-1.274 
          4.057-5.064 7-9.542 7-4.477 
          0-8.268-2.943-9.542-7z"
        />
      </>
    )}
  </svg>
);

const PasswordInput = ({
  label,
  id,
  name,
  value,
  onChange,
  required = false,
  className,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-gray-300 text-sm font-bold mb-2"
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={isPasswordVisible ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${className} pr-10`}
        />

        {value && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            <EyeIcon closed={isPasswordVisible} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
