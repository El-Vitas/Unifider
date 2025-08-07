import Select from 'react-select';
import type { OptionType } from '../../types';

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: OptionType[];
  props?: Record<string, unknown>;
  isLoading?: boolean;
};

const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  props = {},
  isLoading = false,
}: SelectFieldProps) => {
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
      <label htmlFor={id} className="block mb-2">
        {label}:
      </label>
      <Select
        inputId={id}
        value={options.find((option) => option.value === value) || null}
        onChange={(newValue) => {
          onChange((newValue as OptionType)?.value ?? '');
        }}
        options={options}
        className="w-full mt-1"
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? 'var(--color-primary)' : '#d1d5db',
            boxShadow: state.isFocused
              ? '0 0 0 2px var(--color-primary)'
              : undefined,
            '&:hover': {
              borderColor: 'var(--color-primary)',
            },
            padding: '2px 8px',
            borderRadius: 'var(--radius-md)',
          }),
        }}
        {...props}
      />
    </div>
  );
};

export default SelectField;
