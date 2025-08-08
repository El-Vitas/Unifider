import React from 'react';
import MainForm from '../../common/components/MainForm';
import InputField from '../../common/components/form/InputField';
import SelectField from '../../common/components/form/SelectField';
import {
  WeeklyScheduleSelector,
  ScheduleSummary,
  ScheduleCompactSummary,
  ScheduleConfigButton,
} from '../../common/components/schedule';
import { useState, useEffect, useCallback, useMemo } from 'react';
import InputFileField from '../../common/components/form/InputFileField';
import { useParams, useNavigate } from 'react-router-dom';
import { useAsync } from '../../common/hooks/useAsync';
import {
  convertScheduleForSubmission,
  convertTimeBlocksToScheduleFormat,
} from '../../common/utils/scheduleUtils';
import { useScheduleManager } from '../../common/hooks/useScheduleManager';
import config from '../../config';
import { customToast } from '../../common/utils/customToast';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import type { CourtType } from '../entities';
import type { LocationType } from '../../location/entities';
import type { CustomHttpResponse, OptionType } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';

const CourtEdit = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const authToken = useAuth().authToken;

  const {
    scheduleByDay,
    capacityByDay,
    scheduleData,
    isScheduleModalOpen,
    openScheduleModal,
    closeScheduleModal,
    onScheduleChange,
    onCapacityChange,
    setScheduleByDay,
    setCapacityByDay,
  } = useScheduleManager({ authToken });
  const navigate = useNavigate();

  const { courtName } = useParams<{ courtName: string }>();

  const urlCourt = useMemo(() => `${config.apiUrl}/court/${courtName}`, [courtName]);
  const urlLocation = useMemo(() => `${config.apiUrl}/location`, []);

  const fetchCourtFn = useCallback(
    () =>
      httpAdapter.get<CourtType>(urlCourt, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [urlCourt, authToken],
  );

  const fetchLocationsFn = useCallback(
    () =>
      httpAdapter.get<LocationType[]>(urlLocation, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [urlLocation, authToken],
  );

  const {
    data: courtData,
    loading: courtLoading,
    error: courtError,
    execute: fetchCourt,
  } = useAsync<CustomHttpResponse<CourtType>>(fetchCourtFn, 'Failed to fetch Court');

  const {
    data: locationsData,
    loading: locationsLoading,
    error: locationsError,
    execute: fetchLocations,
  } = useAsync<CustomHttpResponse<LocationType[]>>(
    fetchLocationsFn,
    'Failed to fetch Locations',
  );

  const locationOptions = useMemo<OptionType[]>(() => {
    if (locationsData?.data) {
      return locationsData.data.map((loc) => ({
        label: loc.name,
        value: loc.name,
      }));
    }
    return [];
  }, [locationsData]);

  useEffect(() => {
    fetchCourt();
    fetchLocations();
  }, [fetchCourt, fetchLocations]);

  useEffect(() => {
    if (courtData?.data) {
      setName(courtData.data.name);
      setDescription(courtData.data.description || '');
      setLocation(courtData.data.location?.name || '');
      if (courtData.data.schedule?.timeBlocks && scheduleData?.data) {
        const {
          scheduleByDay: initialSchedule,
          capacityByDay: initialCapacity,
        } = convertTimeBlocksToScheduleFormat(
          courtData.data.schedule.timeBlocks,
          scheduleData.data,
        );
        setScheduleByDay(initialSchedule);
        setCapacityByDay(initialCapacity);
      }
    }
  }, [courtData, scheduleData, setScheduleByDay, setCapacityByDay]);

  useEffect(() => {
    if (courtError) {
      customToast.error(courtError);
    }
  }, [courtError]);

  useEffect(() => {
    if (locationsError) {
      customToast.error(locationsError);
    }
  }, [locationsError]);

  const hasError = courtError || locationsError;

  if (hasError) {
    return (
      <div className="mt-6 text-center text-red-600">
        Ocurrió un error al cargar los datos. Por favor, inténtelo de nuevo.
      </div>
    );
  }

  if (!courtData) {
    return (
      <div className="mt-6 text-center">
        No se encontraron datos para esta cancha.
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!courtData?.data?.id) {
      customToast.error('No se encontró el ID de la cancha');
      return;
    }

    try {
      setSubmitting(true);

      const selectedLocation = locationsData?.data?.find(
        (loc) => loc.name === location,
      );
      if (!selectedLocation) {
        customToast.error('Por favor selecciona una ubicación válida');
        return;
      }

      const timeBlocks = convertScheduleForSubmission(
        scheduleByDay,
        capacityByDay,
        scheduleData?.data || [],
      );

      const updateData = {
        name: name.trim(),
        description: description.trim() || undefined,
        locationId: selectedLocation.id,
        schedule: {
          timeBlocks,
        },
      };

      await httpAdapter.patch(
        `${config.apiUrl}/court/${courtData.data.id}/edit`,
        updateData,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (imageFile && courtData.data.id) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        await httpAdapter.post(
          `${config.apiUrl}/court/${courtData.data.id}/image`,
          imageFormData,
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      customToast.success('Cancha actualizada correctamente');
      navigate('/court');
    } catch (err: unknown) {
      console.error('Error updating court:', err);
      customToast.error('Error al actualizar la cancha');
    } finally {
      setSubmitting(false);
    }
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const onLocationChange = (selectedValue: string) => {
    setLocation(selectedValue);
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <MainForm
      onSubmit={onSubmit}
      submitButtonText={submitting ? 'Guardando...' : 'Guardar Cambios'}
    >
      <>
        <div className="space-y-4">
          <InputField
            id="name"
            label="Nombre de la Cancha"
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder="Nombre de la cancha"
            required={true}
            props={{ autoComplete: 'off' }}
            isLoading={courtLoading}
          />
          <InputField
            id="description"
            label="Descripción"
            type="text"
            value={description}
            onChange={onDescriptionChange}
            placeholder="Descripción de la cancha"
            required={true}
            props={{ autoComplete: 'off' }}
            isLoading={courtLoading}
          />
          <InputFileField
            id="courtImage"
            label="Imagen de la Cancha"
            onChange={onImageChange}
            required={false}
            accept="image/*"
            multiple={false}
            isLoading={courtLoading}
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
                {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)}{' '}
                MB)
              </span>
            </div>
          )}
          {courtData?.data?.imageUrl && !imageFile && (
            <div className="text-xs text-gray-600 mt-1">
              <img
                src={`${config.domain}${courtData.data.imageUrl}`}
                alt="Imagen actual de la cancha"
                className="max-w-xs max-h-48 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-600 mt-1">Imagen actual</p>
            </div>
          )}
          <SelectField
            id="location"
            label="Ubicación"
            value={location}
            onChange={onLocationChange}
            options={locationOptions}
            isLoading={courtLoading || locationsLoading}
          />

          <div className="space-y-2">
            <ScheduleConfigButton
              onClick={openScheduleModal}
              disabled={courtLoading || !scheduleData?.data}
              isLoading={courtLoading}
            />

            <ScheduleCompactSummary
              scheduleByDay={scheduleByDay}
              capacityByDay={capacityByDay}
              scheduleBlocks={scheduleData?.data || []}
            />

            <ScheduleSummary
              scheduleByDay={scheduleByDay}
              capacityByDay={capacityByDay}
              scheduleBlocks={scheduleData?.data || []}
            />
          </div>
        </div>
      </>

      <WeeklyScheduleSelector
        blocks={scheduleData?.data || []}
        onChange={onScheduleChange}
        onCapacityChange={onCapacityChange}
        initialSchedule={scheduleByDay}
        initialCapacity={capacityByDay}
        isOpen={isScheduleModalOpen}
        onClose={closeScheduleModal}
      />
    </MainForm>
  );
};

export default CourtEdit;
