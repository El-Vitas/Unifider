import React, { useState, useEffect } from 'react';
import InputField from '../../common/components/form/InputField';
import InputFileField from '../../common/components/form/InputFileField';
import type { Team } from '../entities';

interface TeamFormProps {
  initialData?: Team | null;
  isLoading?: boolean;
  onFormChange: (data: {
    name: string;
    instructor: string;
    contact: string;
    imageUrl: string;
  }) => void;
  onFileChange?: (file: File | null) => void;
}

const TeamForm: React.FC<TeamFormProps> = ({
  initialData,
  isLoading = false,
  onFormChange,
  onFileChange,
}) => {
  const [name, setName] = useState<string>(initialData?.name || '');
  const [instructor, setInstructor] = useState<string>(
    initialData?.instructor || '',
  );
  const [contact, setContact] = useState<string>(initialData?.contact || '');
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    setName(initialData?.name || '');
    setInstructor(initialData?.instructor || '');
    setContact(initialData?.contact || '');
    setImageUrl(initialData?.imageUrl || '');
  }, [initialData]);

  useEffect(() => {
    onFormChange({ name, instructor, contact, imageUrl });
  }, [name, instructor, contact, imageUrl, onFormChange]);

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
        label="Nombre del Equipo"
        type="text"
        placeholder="Nombre del equipo"
        required={true}
        value={name}
        onChange={(e) => setName(e.target.value)}
        props={{ autoComplete: 'off' }}
        isLoading={isLoading}
      />
      <InputField
        id="instructor"
        label="Instructor"
        type="text"
        placeholder="Nombre del instructor"
        value={instructor}
        onChange={(e) => setInstructor(e.target.value)}
        props={{ autoComplete: 'off' }}
        isLoading={isLoading}
      />
      <InputField
        id="contact"
        label="Contacto"
        type="text"
        placeholder="Contacto"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        props={{ autoComplete: 'off' }}
        isLoading={isLoading}
      />

      <InputFileField
        id="teamImage"
        label="Imagen del Equipo"
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

export default TeamForm;
