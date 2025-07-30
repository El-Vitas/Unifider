import React, { useState, useEffect } from 'react';
import InputField from '../../common/components/form/InputField';
import type { LocationType } from '../entities';

interface LocationFormProps {
  initialData?: LocationType | null;
  isLoading?: boolean;
  onFormChange: (data: { name: string; description: string }) => void;
}

const LocationForm: React.FC<LocationFormProps> = ({
  initialData,
  isLoading = false,
  onFormChange,
}) => {
  const [name, setName] = useState<string>(initialData?.name || '');
  const [description, setDescription] = useState<string>(
    initialData?.description || '',
  );

  useEffect(() => {
    setName(initialData?.name || '');
    setDescription(initialData?.description || '');
  }, [initialData]);

  useEffect(() => {
    onFormChange({ name, description });
  }, [name, description, onFormChange]);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  return (
    <>
      <InputField
        id="name"
        label="Nombre del Lugar"
        type="text"
        placeholder="Nombre del lugar"
        required={true}
        value={name}
        onChange={onNameChange}
        props={{ autoComplete: 'off' }}
        isLoading={isLoading}
      />

      <InputField
        id="description"
        label="Descripción"
        type="text"
        placeholder="Descripción del lugar"
        required={true}
        value={description}
        onChange={onDescriptionChange}
        props={{ autoComplete: 'off' }}
        isLoading={isLoading}
      />
    </>
  );
};

export default LocationForm;
