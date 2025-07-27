import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MainForm from '../../common/components/MainForm'; 
import LocationForm from '../components/LocationForm';
import { useParams } from 'react-router-dom';
import { useAsync } from '../../common/hooks/useAsync';
import config from '../../config';
import { customToast } from '../../common/utils/customToast';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import type { LocationType } from '../entities';
import type { CustomHttpResponse } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';

const LocationEdit = () => {
  const { locationName } = useParams<{ locationName: string }>();
  const [formData, setFormData] = useState<LocationType>({
    id: '',
    name: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false); 
  const urlLocation = useMemo(
    () => `${config.apiUrl}/location/${locationName}`,
    [locationName],
  );
  const authToken = useAuth().authToken;

  const fetchLocationFn = useCallback(
    () => httpAdapter.get<LocationType>(urlLocation, {
      headers: {
        'authorization': `Bearer ${authToken}`,
      }
    }),
    [urlLocation, authToken],
  );

  const updateLocationFn = useCallback(
    (data: LocationType) =>
      httpAdapter.put<LocationType>(`${config.apiUrl}/location/update`, data, {
        headers: {
          'authorization': `Bearer ${authToken}`,
        }
      }),
    [authToken],
  );

  const {
    data: initialLocationData,
    loading: fetchLoading,
    error: fetchError,
    execute: fetchLocation,
  } = useAsync<CustomHttpResponse<LocationType>>(fetchLocationFn, 'Failed to fetch Location');

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    if (initialLocationData?.data) {
      setFormData(initialLocationData.data); 
    }
  }, [initialLocationData]);

  const handleFormChange = useCallback(
    (data: { name: string; description: string }) => {
      setFormData((prev) => ({ ...prev, ...data }));
    },
    [],
  );

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
