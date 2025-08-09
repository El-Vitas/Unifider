import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MainForm from '../../common/components/MainForm';
import EquipmentForm from '../components/EquipmentForm';
import { useParams } from 'react-router-dom';
import { useAsync } from '../../common/hooks/useAsync';
import config from '../../config';
import { customToast } from '../../common/utils/customToast';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import type { EquipmentType } from '../entities';
import type { CustomHttpResponse } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
const EquipmentEdit = () => {
  const { equipmentName } = useParams<{ equipmentName: string }>();
  const [formData, setFormData] = useState<EquipmentType>({
    id: '',
    name: '',
    description: '',
    imageUrl: undefined,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const redirectUrl = '/gym/equipment/';
  const [submitting, setSubmitting] = useState(false);
  const urlEquipment = useMemo(
    () => `${config.apiUrl}/equipment/${equipmentName}`,
    [equipmentName],
  );
  const authToken = useAuth().authToken;

  const fetchEquipmentFn = useCallback(
    () =>
      httpAdapter.get<EquipmentType>(urlEquipment, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [urlEquipment, authToken],
  );

  const updateEquipmentFn = useCallback(
    (data: EquipmentType) =>
      httpAdapter.put<EquipmentType>(
        `${config.apiUrl}/equipment/update`,
        data,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        },
      ),
    [authToken],
  );

  const {
    data: initialEquipmentData,
    loading: fetchLoading,
    error: fetchError,
    execute: fetchEquipment,
  } = useAsync<CustomHttpResponse<EquipmentType>>(
    fetchEquipmentFn,
    'Failed to fetch Equipment',
  );

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  useEffect(() => {
    if (initialEquipmentData?.data) {
      setFormData(initialEquipmentData.data);
    }
  }, [initialEquipmentData]);

  const handleFormChange = useCallback(
    (data: { name: string; description: string; imageUrl?: string }) => {
      setFormData((prev) => ({ ...prev, ...data }));
    },
    [],
  );

  const handleFileChange = useCallback((file: File | null) => {
    setImageFile(file);
  }, []);

  useEffect(() => {
    if (fetchError) {
      customToast.error(fetchError);
    }
  }, [fetchError]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const updatedEquipment: EquipmentType = {
        ...formData,
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl || undefined,
      };

      await updateEquipmentFn(updatedEquipment);

      if (imageFile && formData.id) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        await httpAdapter.post(
          `${config.apiUrl}/equipment/${formData.id}/image`,
          imageFormData,
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      customToast.success('Equipamiento actualizado correctamente');
      navigate(redirectUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        customToast.error(
          `Error al actualizar el equipamiento: ${err?.message ?? 'Error desconocido'}`,
        );
      } else {
        customToast.error(
          'Error al actualizar el equipamiento: Error desconocido',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = fetchLoading || submitting;

  if ((!fetchLoading && !initialEquipmentData) || fetchError) {
    navigate(redirectUrl);
  }

  return (
    <MainForm onSubmit={onSubmit} submitButtonText="Guardar Cambios">
      <EquipmentForm
        initialData={formData}
        isLoading={isLoading}
        onFormChange={handleFormChange}
        onFileChange={handleFileChange}
      />
    </MainForm>
  );
};

export default EquipmentEdit;
