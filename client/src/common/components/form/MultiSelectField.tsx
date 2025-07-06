import { useMemo } from 'react';
import Select, { type MultiValue } from 'react-select';

type OptionType = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: OptionType[];
  props?: Record<string, unknown>;
};

const MultiSelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  props = {},
}: SelectFieldProps) => {
  const computedOptions = useMemo(() => {
    return [{ value: 'all', label: 'Seleccionar todo' }, ...options];
  }, [options]);

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-2">
        {label}:
      </label>

      <Select
        inputId={id}
        isMulti
        value={options.filter((option) => value.includes(option.value))}
        onChange={(newValue) => {
          const selectedValues = (newValue as MultiValue<OptionType>).map(
            (option) => option.value,
          );
          if (selectedValues.includes('all')) {
            onChange(options.map((option) => option.value));
          } else {
            onChange(selectedValues);
          }
        }}
        options={value.length === options.length ? options : computedOptions}
        className="block mt-1 rounded-md shadow-sm w-full"
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
          multiValue: (base) => ({
            ...base,
            backgroundColor: 'var(--color-primary)',
            color: 'white',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: 'white',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: 'white',
            ':hover': {
              backgroundColor: 'var(--color-accent)',
              color: 'white',
            },
          }),
        }}
        {...props}
      />
    </div>
  );
};

export default MultiSelectField;
