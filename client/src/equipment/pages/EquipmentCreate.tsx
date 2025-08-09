import React, { useState, useCallback } from 'react';
import MainForm from '../../common/components/MainForm';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { customToast } from '../../common/utils/customToast';
import config from '../../config';
import { useAuth } from '../../common/hooks/useAuth';
import EquipmentForm from '../components/EquipmentForm';
import type { EquipmentType } from '../entities';
import { useNavigate } from 'react-router-dom';

const EquipmentCreate = () => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    imageUrl?: string;
  }>({ name: '', description: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const redirectUrl = '/gym/equipment/';
  const authToken = useAuth().authToken;

  const handleFormChange = useCallback(
    (data: { name: string; description: string; imageUrl?: string }) => {
      setFormData(data);
    },
    [],
  );

  const handleFileChange = useCallback((file: File | null) => {
    setImageFile(file);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const equipmentData: Omit<EquipmentType, 'id'> = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        imageUrl: undefined, // Will be set by image upload if file exists
      };

      const createEquipmentResponse = await httpAdapter.post<EquipmentType>(
        `${config.apiUrl}/equipment/create`,
        equipmentData,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const createdEquipment = createEquipmentResponse.data;

      if (imageFile && createdEquipment.id) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        await httpAdapter.post(
          `${config.apiUrl}/equipment/${createdEquipment.id}/image`,
          imageFormData,
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      customToast.success('Equipamiento creado correctamente');
      navigate(redirectUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        customToast.error(`Error al crear el equipamiento: ${err.message}`);
      } else {
        customToast.error('Error al crear el equipamiento: Error desconocido');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = submitting;

  return (
    <MainForm onSubmit={onSubmit} submitButtonText="Crear Equipamiento">
      <EquipmentForm
        initialData={null}
        isLoading={isLoading}
        onFormChange={handleFormChange}
        onFileChange={handleFileChange}
      />
    </MainForm>
  );
};

export default EquipmentCreate;
