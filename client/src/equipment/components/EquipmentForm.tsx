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
  onFileChange?: (file: File | null) => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  initialData,
  isLoading = false,
  onFormChange,
  onFileChange,
}) => {
  const [name, setName] = useState<string>(initialData?.name || '');
  const [description, setDescription] = useState<string>(
    initialData?.description || '',
  );
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    if (onFileChange) {
      onFileChange(file || null);
    }
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
        onChange={onImageChange}
        required={false}
        accept="image/*"
        multiple={false}
        isLoading={isLoading}
      />

      {imageFile && (
        <div className="text-xs text-gray-600 mt-1">
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
          </span>
        </div>
      )}
    </>
  );
};

export default EquipmentForm;
