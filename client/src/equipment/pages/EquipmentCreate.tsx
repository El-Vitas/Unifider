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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const newEquipment: Omit<EquipmentType, 'id'> = {
      name: formData.name,
      description: formData.description?.trim() || undefined,
      imageUrl: formData.imageUrl?.trim() || undefined,
    };
    try {
      await httpAdapter.post<EquipmentType>(
        `${config.apiUrl}/equipment/create`,
        newEquipment,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        },
      );
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
      />
    </MainForm>
  );
};

export default EquipmentCreate;
