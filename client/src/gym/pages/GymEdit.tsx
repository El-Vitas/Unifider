import React from 'react';
import MainForm from '../../common/components/MainForm';
import InputField from '../../common/components/form/InputField';
import SelectField from '../../common/components/form/SelectField';
import MultiSelectField from '../../common/components/form/MultiSelectField';
import { useState, useEffect, useCallback, useMemo } from 'react'; // Added explicit imports
import InputFileField from '../../common/components/form/InputFileField';
import { useParams } from 'react-router-dom';
import { useAsync } from '../../common/hooks/useAsync';
import config from '../../config';
import { customToast } from '../../common/utils/customToast';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import type { GymType } from '../entities';
import type { LocationType } from '../../location/entities';
import type { CustomHttpResponse, OptionType } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';
const GymEdit = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [equipment, setEquipment] = useState<string[]>([]);

  const authToken = useAuth().authToken;

  const { gymName } = useParams<{ gymName: string }>();

  const urlGym = useMemo(() => `${config.apiUrl}/gym/${gymName}`, [gymName]);
  const urlLocation = useMemo(() => `${config.apiUrl}/location`, []);

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
    fetchGym();
    fetchLocations();
  }, [fetchGym, fetchLocations]);

  useEffect(() => {
    if (gymData?.data) {
      setName(gymData.data.name);
      setDescription(gymData.data.description);
      setEquipment(gymData.data.equipment || []);
      setLocation(gymData.data.location?.name || '');
    }
  }, [gymData]);

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

  const hasError = gymError || locationsError;

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Name:', name);
    console.log('Description:', description);
    console.log('Location:', location);
    console.log('Equipment:', equipment);
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

  return (
    <MainForm onSubmit={onSubmit} submitButtonText="Guardar Cambios">
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
            onChange={(e) => console.log(e.target.files)}
            required={false}
            accept="image/*"
            multiple={false}
            isLoading={gymLoading}
          />
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
            options={[
              { label: 'Manzana', value: 'manzana' },
              { label: 'Banana', value: 'banana' },
              { label: 'Pera', value: 'pera' },
              { label: 'Naranja', value: 'naranja' },
            ]}
            isLoading={gymLoading}
          />
        </div>
      </>
    </MainForm>
  );
};

export default GymEdit;
