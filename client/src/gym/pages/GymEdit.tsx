import React from 'react';
import MainForm from '../../common/components/MainForm';
import InputField from '../../common/components/form/InputField';
import SelectField from '../../common/components/form/SelectField';
import MultiSelectField from '../../common/components/form/MultiSelectField';
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
import type { GymType } from '../entities';
import type { LocationType } from '../../location/entities';
import type { EquipmentType } from '../../equipment/entities';
import type { CustomHttpResponse, OptionType } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';
const GymEdit = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const authToken = useAuth().authToken;

  // Initialize schedule manager
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

  const { gymName } = useParams<{ gymName: string }>();

  const urlGym = useMemo(() => `${config.apiUrl}/gym/${gymName}`, [gymName]);
  const urlLocation = useMemo(() => `${config.apiUrl}/location`, []);
  const urlEquipment = useMemo(() => `${config.apiUrl}/equipment`, []);

  const fetchGymFn = useCallback(
    () =>
      httpAdapter.get<GymType>(urlGym, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [urlGym, authToken],
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
    data: gymData,
    loading: gymLoading,
    error: gymError,
    execute: fetchGym,
  } = useAsync<CustomHttpResponse<GymType>>(fetchGymFn, 'Failed to fetch Gym');

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
    fetchGym();
    fetchLocations();
    fetchEquipment();
  }, [fetchGym, fetchLocations, fetchEquipment]);

  useEffect(() => {
    if (gymData?.data) {
      setName(gymData.data.name);
      setDescription(gymData.data.description || '');
      const equipmentNames =
        gymData.data.equipment.map((equip) => equip.name) || [];
      setEquipment(equipmentNames);
      setLocation(gymData.data.location?.name || '');
      if (gymData.data.schedule?.timeBlocks && scheduleData?.data) {
        console.log('Initial schedule:', gymData.data.schedule.timeBlocks);
        const {
          scheduleByDay: initialSchedule,
          capacityByDay: initialCapacity,
        } = convertTimeBlocksToScheduleFormat(
          gymData.data.schedule.timeBlocks,
          scheduleData.data,
        );
        setScheduleByDay(initialSchedule);
        setCapacityByDay(initialCapacity);
      }
    }
  }, [gymData, scheduleData, setScheduleByDay, setCapacityByDay]);

  useEffect(() => {
    if (gymError) {
      customToast.error(gymError);
    }
  }, [gymError]);

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

  const hasError = gymError || locationsError || equipmentError;

  if (hasError) {
    return (
      <div className="mt-6 text-center text-red-600">
        Ocurrió un error al cargar los datos. Por favor, inténtelo de nuevo.
      </div>
    );
  }

  if (!gymData) {
    return (
      <div className="mt-6 text-center">
        No se encontraron datos para este gimnasio.
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!gymData?.data?.id) {
      customToast.error('No se encontró el ID del gimnasio');
      return;
    }

    try {
      setSubmitting(true);

      // Get selected location ID
      const selectedLocation = locationsData?.data?.find(
        (loc) => loc.name === location,
      );
      if (!selectedLocation) {
        customToast.error('Por favor selecciona una ubicación válida');
        return;
      }

      // Get selected equipment IDs
      const selectedEquipmentIds =
        equipmentData?.data
          ?.filter((equip) => equipment.includes(equip.name))
          .map((equip) => equip.id) || [];

      // Convert schedule and capacity data to time blocks
      const timeBlocks = convertScheduleForSubmission(
        scheduleByDay,
        capacityByDay,
        scheduleData?.data || [],
      );

      // Prepare update data
      const updateData = {
        name: name.trim(),
        description: description.trim() || undefined,
        locationId: selectedLocation.id,
        equipment: selectedEquipmentIds,
        schedule: {
          timeBlocks,
        },
      };

      // Update the gym
      await httpAdapter.patch(
        `${config.apiUrl}/gym/${gymData.data.id}/edit`,
        updateData,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Handle image upload if there's a new image
      if (imageFile && gymData.data.id) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        await httpAdapter.post(
          `${config.apiUrl}/gym/${gymData.data.id}/image`,
          imageFormData,
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      customToast.success('Gimnasio actualizado correctamente');
      navigate('/gym');
    } catch (err: unknown) {
      console.error('Error updating gym:', err);
      customToast.error('Error al actualizar el gimnasio');
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
            label="Nombre del Gimnasio"
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder="Nombre del gimnasio"
            required={true}
            props={{ autoComplete: 'off' }}
            isLoading={gymLoading}
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
            isLoading={gymLoading}
          />
          <InputFileField
            id="gymImage"
            label="Imagen del Gimnasio"
            onChange={onImageChange}
            required={false}
            accept="image/*"
            multiple={false}
            isLoading={gymLoading}
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
          {gymData?.data?.imageUrl && !imageFile && (
            <div className="text-xs text-gray-600 mt-1">
              <img
                src={`${config.domain}${gymData.data.imageUrl}`}
                alt="Imagen actual del gimnasio"
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
            isLoading={gymLoading || locationsLoading}
          />
          <MultiSelectField
            id="equipment"
            label="Equipamiento"
            value={equipment}
            onChange={onEquipmentChange}
            options={equipmentOptions}
            isLoading={gymLoading || equipmentLoading}
          />

          <div className="space-y-2">
            <ScheduleConfigButton
              onClick={openScheduleModal}
              disabled={gymLoading || !scheduleData?.data}
              isLoading={gymLoading}
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

export default GymEdit;
