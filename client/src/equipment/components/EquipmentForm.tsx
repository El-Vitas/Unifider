import React, { useState, useEffect } from 'react';
import InputField from '../../common/components/form/InputField';
import type { EquipmentType } from '../entities';
import InputFileField from '../../common/components/form/InputFileField';

interface EquipmentFormProps {
  initialData?: EquipmentType | null;
  isLoading?: boolean;
  onFormChange: (data: {
    name: string;
    description: string;
    imageUrl?: string;
  }) => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  initialData,
  isLoading = false,
  onFormChange,
}) => {
  const [name, setName] = useState<string>(initialData?.name || '');
  const [description, setDescription] = useState<string>(
    initialData?.description || '',
  );
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || '');
  useEffect(() => {
    setName(initialData?.name || '');
    setDescription(initialData?.description || '');
    setImageUrl(initialData?.imageUrl || '');
  }, [initialData]);

  useEffect(() => {
    onFormChange({
      name,
      description,
      imageUrl: imageUrl || undefined,
    });
  }, [name, description, imageUrl, onFormChange]);

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
        label="Nombre del equipamiento"
        type="text"
        placeholder="Nombre del equipamiento"
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
        placeholder="Descripción del equipamiento"
        required={true}
        value={description}
        onChange={onDescriptionChange}
        props={{ autoComplete: 'off' }}
        isLoading={isLoading}
      />

      <InputFileField
        id="equipmentImage"
        label="Imagen del Equipamiento"
        onChange={() => {}}
        required={false}
        accept="image/*"
        multiple={false}
        isLoading={isLoading}
      />
    </>
  );
};

export default EquipmentForm;
