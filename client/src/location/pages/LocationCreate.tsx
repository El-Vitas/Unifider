import React, { useState, useCallback } from 'react';
import MainForm from '../../common/components/MainForm'; // Asumiendo que MainForm es tu DataForm general
import LocationForm from '../components/LocationForm'; // Importa el componente de los campos del formulario
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { customToast } from '../../common/utils/customToast';
import config from '../../config';
import type { LocationType } from '../entities';

const LocationCreate = () => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
  }>({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleFormChange = useCallback(
    (data: { name: string; description: string }) => {
      setFormData(data);
    },
    [],
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const newLocation: Omit<LocationType, 'id'> = {
      name: formData.name,
      description: formData.description,
    };
    try {
      await httpAdapter.post<LocationType>(
        `${config.apiUrl}/location/create`,
        newLocation,
      );
      customToast.success('Ubicación creada correctamente');
    } catch (err: unknown) {
      if (err instanceof Error) {
        customToast.error(`Error al crear la ubicación: ${err.message}`);
      } else {
        customToast.error('Error al crear la ubicación: Error desconocido');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = submitting;

  return (
    <MainForm onSubmit={onSubmit} submitButtonText="Crear Ubicación">
      <LocationForm
        initialData={null}
        isLoading={isLoading}
        onFormChange={handleFormChange}
      />
    </MainForm>
  );
};

export default LocationCreate;
