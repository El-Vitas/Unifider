import Select from 'react-select';

type OptionType = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  id: string;
  label: string;
  value: string; // valor seleccionado
  onChange: (value: string) => void;
  options: OptionType[];
  props?: Record<string, unknown>;
};

const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  props = {},
}: SelectFieldProps) => {
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
