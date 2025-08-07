import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MainForm from '../../common/components/MainForm';
import InputField from '../../common/components/form/InputField';
import SelectField from '../../common/components/form/SelectField';
import MultiSelectField from '../../common/components/form/MultiSelectField';
import InputFileField from '../../common/components/form/InputFileField';
import {
  WeeklyScheduleSelector,
  ScheduleSummary,
  ScheduleCompactSummary,
  ScheduleConfigButton,
} from '../../common/components/schedule';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { customToast } from '../../common/utils/customToast';
import { convertScheduleForSubmission } from '../../common/utils/scheduleUtils';
import { useScheduleManager } from '../../common/hooks/useScheduleManager';
import config from '../../config';
import type { GymType, GymCreateRequest } from '../entities';
import type { LocationType } from '../../location/entities';
import type { EquipmentType } from '../../equipment/entities';
import type { CustomHttpResponse, OptionType } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useAsync } from '../../common/hooks/useAsync';

const GymCreate = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const redirectUrl = '/gym/';
  const authToken = useAuth().authToken;

  const {
    scheduleByDay,
    capacityByDay,
    scheduleData,
    scheduleLoading,
    scheduleError,
    isScheduleModalOpen,
    openScheduleModal,
    closeScheduleModal,
    onScheduleChange,
    onCapacityChange,
  } = useScheduleManager({ authToken });

  const urlLocation = useMemo(() => `${config.apiUrl}/location`, []);
  const urlEquipment = useMemo(() => `${config.apiUrl}/equipment`, []);

  const fetchLocationsFn = useCallback(
    () =>
      httpAdapter.get<LocationType[]>(urlLocation, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [urlLocation, authToken],
  );

  const fetchEquipmentFn = useCallback(
    () =>
      httpAdapter.get<EquipmentType[]>(urlEquipment, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [urlEquipment, authToken],
  );

  const {
    data: locationsData,
    loading: locationsLoading,
    error: locationsError,
    execute: fetchLocations,
  } = useAsync<CustomHttpResponse<LocationType[]>>(
    fetchLocationsFn,
    'Failed to fetch Locations',
  );

  const {
    data: equipmentData,
    loading: equipmentLoading,
    error: equipmentError,
    execute: fetchEquipment,
  } = useAsync<CustomHttpResponse<EquipmentType[]>>(
    fetchEquipmentFn,
    'Failed to fetch Equipment',
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

  const equipmentOptions = useMemo<OptionType[]>(() => {
    if (equipmentData?.data) {
      return equipmentData.data.map((equip) => ({
        label: equip.name,
        value: equip.name,
      }));
    }
    return [];
  }, [equipmentData]);

  useEffect(() => {
    fetchLocations();
    fetchEquipment();
  }, [fetchLocations, fetchEquipment]);

  useEffect(() => {
    if (locationsError) {
      customToast.error(locationsError);
    }
  }, [locationsError]);

  useEffect(() => {
    if (equipmentError) {
      customToast.error(equipmentError);
    }
  }, [equipmentError]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const timeBlocks = convertScheduleForSubmission(
        scheduleByDay,
        capacityByDay,
        scheduleData?.data || [],
      );

      const selectedLocation = locationsData?.data?.find(
        (loc) => loc.name === location,
      );
      if (!selectedLocation) {
        customToast.error('Por favor selecciona una ubicación válida');
        setSubmitting(false);
        return;
      }

      const selectedEquipmentIds =
        equipmentData?.data
          ?.filter((equip) => equipment.includes(equip.name))
          .map((equip) => equip.id) || [];

      const gymData: GymCreateRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        locationId: selectedLocation.id,
        equipment: selectedEquipmentIds,
        schedule: {
          timeBlocks,
        },
      };

      const createGymResponse = await httpAdapter.post<GymType>(
        `${config.apiUrl}/gym/create`,
        gymData,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const createdGym = createGymResponse.data;

      if (imageFile && createdGym.id) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        await httpAdapter.post(
          `${config.apiUrl}/gym/${createdGym.id}/image`,
          imageFormData,
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      customToast.success('Gimnasio creado correctamente');
      navigate(redirectUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        customToast.error(`Error al crear el gimnasio: ${err.message}`);
      } else {
        customToast.error('Error al crear el gimnasio: Error desconocido');
      }
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

  const onEquipmentChange = (selectedValues: string[]) => {
    setEquipment(selectedValues);
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const isLoading =
    submitting || locationsLoading || scheduleLoading || equipmentLoading;

  if (locationsError || scheduleError || equipmentError) {
    return (
      <div className="mt-6 text-center text-red-600">
        Ocurrió un error al cargar los datos. Por favor, inténtelo de nuevo.
      </div>
    );
  }

  return (
    <MainForm onSubmit={onSubmit} submitButtonText="Crear Gimnasio">
      <>
        <div className="space-y-4">
          <InputField
            id="name"
            label="Nombre del Gimnasio"
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder="Nombre del gimnasio"
            required={true}
            props={{ autoComplete: 'off' }}
            isLoading={isLoading}
          />
          <InputField
            id="description"
            label="Descripción"
            type="text"
            value={description}
            onChange={onDescriptionChange}
            placeholder="Descripción del gimnasio"
            required={true}
            props={{ autoComplete: 'off' }}
            isLoading={isLoading}
          />
          <InputFileField
            id="gymImage"
            label="Imagen del Gimnasio"
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
                {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)}{' '}
                MB)
              </span>
            </div>
          )}
          <SelectField
            id="location"
            label="Ubicación"
            value={location}
            onChange={onLocationChange}
            options={locationOptions}
            isLoading={isLoading}
          />
          <MultiSelectField
            id="equipment"
            label="Equipamiento"
            value={equipment}
            onChange={onEquipmentChange}
            options={equipmentOptions}
            isLoading={isLoading}
          />

          <div className="space-y-2">
            <ScheduleConfigButton
              onClick={openScheduleModal}
              disabled={isLoading || !scheduleData?.data}
              isLoading={isLoading}
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

export default GymCreate;
