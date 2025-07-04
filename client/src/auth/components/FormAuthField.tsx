// src/common/components/InputField.tsx
import React from 'react';
interface FormFieldProps {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const FormAuthField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
}: FormFieldProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-4">
        {label}:
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormAuthField;
