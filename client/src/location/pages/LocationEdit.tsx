// src/location/pages/LocationEdit.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MainForm from '../../common/components/MainForm'; // Asumiendo que MainForm es tu DataForm general
import LocationForm from '../components/LocationForm'; // Importa el componente de los campos
import { useParams } from 'react-router-dom';
import { useAsync } from '../../common/hooks/useAsync';
import config from '../../config';
import { customToast } from '../../common/utils/customToast';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import type { LocationType } from '../entities';

const LocationEdit = () => {
  const { locationName } = useParams<{ locationName: string }>();
  const [formData, setFormData] = useState<LocationType>({
    id: '',
    name: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false); // Estado para el envío de actualización

  const urlLocation = useMemo(
    () => `${config.apiUrl}/location/${locationName}`,
    [locationName],
  );

  const fetchLocationFn = useCallback(
    () => httpAdapter.get<LocationType>(urlLocation),
    [urlLocation],
  );

  const updateLocationFn = useCallback(
    (data: LocationType) =>
      httpAdapter.put<LocationType>(`${config.apiUrl}/location/update`, data), // Ajusta la URL si el ID va en la URL
    [], // Esta función no depende de nada que cambie aquí, el data se pasa en el submit
  );

  const {
    data: initialLocationData, // Renombrado para mayor claridad
    loading: fetchLoading,
    error: fetchError,
    execute: fetchLocation,
  } = useAsync<LocationType>(fetchLocationFn, 'Failed to fetch Location');

  // Cargar datos iniciales al montar o al cambiar locationName
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  // Actualizar formData cuando initialLocationData llega
  useEffect(() => {
    if (initialLocationData) {
      setFormData(initialLocationData); // Establece todos los datos iniciales
    }
  }, [initialLocationData]);

  // Handler para recibir los cambios de los campos desde LocationForm
  const handleFormChange = useCallback(
    (data: { name: string; description: string }) => {
      setFormData((prev) => ({ ...prev, ...data })); // Combina con el ID existente
    },
    [],
  );

  // Manejo de errores
  useEffect(() => {
    if (fetchError) {
      customToast.error(fetchError);
    }
  }, [fetchError]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const updatedLocation: LocationType = {
      ...formData,
      name: formData.name,
      description: formData.description,
    };

    try {
      await updateLocationFn(updatedLocation);
      customToast.success('Ubicación actualizada correctamente');
    } catch (err: unknown) {
      if (err instanceof Error) {
        customToast.error(
          `Error al actualizar la ubicación: ${err?.message ?? 'Error desconocido'}`,
        );
      } else {
        customToast.error(
          'Error al actualizar la ubicación: Error desconocido',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = fetchLoading || submitting;

  if (fetchError) {
    return (
      <div className="mt-6 text-center text-red-600">
        Ocurrió un error al cargar los datos. Por favor, inténtelo de nuevo.
      </div>
    );
  }

  if (!fetchLoading && !initialLocationData) {
    return (
      <div className="mt-6 text-center">
        No se encontraron datos para la ubicación.
      </div>
    );
  }

  return (
    <MainForm onSubmit={onSubmit} submitButtonText="Guardar Cambios">
      <LocationForm
        initialData={formData}
        isLoading={isLoading}
        onFormChange={handleFormChange}
      />
    </MainForm>
  );
};

export default LocationEdit;
