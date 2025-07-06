import React from 'react';
interface InputFieldProps {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
}

const InputField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  props = {},
}: InputFieldProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-2">
        {label}:
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default InputField;
