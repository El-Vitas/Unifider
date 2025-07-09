import React, { useState } from 'react';

interface FileInputFieldProps {
  id: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  isLoading?: boolean;
}

const InputFileField = ({
  id,
  label,
  onChange,
  required = false,
  accept,
  multiple = false,
  isLoading = false,
}: FileInputFieldProps) => {
  const [fileName, setFileName] = useState<string>(
    'Ningún archivo seleccionado',
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((file) => file.name);
      setFileName(names.join(', '));
    } else {
      setFileName('Ningún archivo seleccionado');
    }
  };

  if (isLoading) {
    return (
      <div className="mb-4 mt-6 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
        <div className="h-10 mt-2 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block mb-2">{label}:</label>
      <div className="flex items-center space-x-4">
        <label
          htmlFor={id}
          className="px-4 py-2 bg-primary text-white rounded cursor-pointer hover:bg-accent"
        >
          Subir archivo
        </label>
        <span className="text-gray-600 text-sm truncate max-w-xs">
          {fileName}
        </span>
      </div>
      <input
        type="file"
        id={id}
        onChange={handleChange}
        required={required}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
    </div>
  );
};

export default InputFileField;
