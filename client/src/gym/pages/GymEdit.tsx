import React from 'react';
import EditForm from '../../common/components/EditForm';
import InputField from '../../common/components/form/InputField';
import SelectField from '../../common/components/form/SelectField';
import MultiSelectField from '../../common/components/form/MultiSelectField';
import { useState } from 'react';
import InputFileField from '../../common/components/form/InputFileField';

const GymEdit = () => {
  const [name, setName] = React.useState('a');
  const [description, setDescription] = React.useState(
    'Una descripción del gimnasio',
  );
  const [location, setLocation] = React.useState('ubi 1');
  const [selected, setSelected] = useState<string[]>([]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Form submitted ${e}`);
    console.log(selected);
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  return (
    <EditForm onSubmit={onSubmit} submitButtonText="Guardar Cambios">
      <>
        <div className="justify-between">
          <InputField
            id="name"
            label="Nombre del Gimnasio"
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder="Nombre del gimnasio"
            required={true}
            props={{ autoComplete: 'off' }}
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
          />

          <InputFileField
            id="gymImage"
            label="Imagen del Gimnasio"
            onChange={(e) => console.log(e.target.files)}
            required={false}
            accept="image/*"
            multiple={false}
          />

          <SelectField
            id="location"
            label="Ubicación"
            value={location}
            onChange={setLocation}
            options={[
              { value: 'gym', label: 'Gimnasio' },
              { value: 'crossfit', label: 'Crossfit' },
              { value: 'yoga', label: 'Yoga' },
              { value: 'pilates', label: 'Pilates' },
            ]}
          />

          <MultiSelectField
            id="equipment"
            label="Equipamiento"
            value={selected}
            onChange={setSelected}
            options={[
              { label: 'Manzana', value: 'manzana' },
              { label: 'Banana', value: 'banana' },
              { label: 'Pera', value: 'pera' },
              { label: 'Naranja', value: 'naranja' },
            ]}
          />
        </div>
      </>
    </EditForm>
  );
};

export default GymEdit;
