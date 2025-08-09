import { useEffect, useState } from 'react';
import MainForm from '../../common/components/MainForm';
import InputField from '../../common/components/form/InputField';
import InputFileField from '../../common/components/form/InputFileField';
import type { CreateSectionDto, UpdateSectionDto, Section } from '../entities';

interface SectionFormProps {
  onSubmit: (data: CreateSectionDto | UpdateSectionDto) => Promise<void>;
  initialData?: Section;
  isLoading?: boolean;
  isEditMode?: boolean;
  workshopId?: string;
}

const SectionForm = ({
  onSubmit,
  initialData,
  isLoading = false,
  isEditMode = false,
  workshopId,
}: SectionFormProps) => {
  const [number, setNumber] = useState<number>(1);
  const [capacity, setCapacity] = useState<number>(20);
  const [instructor, setInstructor] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setNumber(initialData.number);
      setCapacity(initialData.capacity);
      setInstructor(initialData.instructor || '');
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!instructor.trim() || !description.trim()) {
      return;
    }

    const formData: CreateSectionDto | UpdateSectionDto = {
      number,
      capacity,
      instructor,
      description,
      workshopId: workshopId || initialData?.workshopId || '',
    };

    if (imageFile) {
      const fileList = new DataTransfer();
      fileList.items.add(imageFile);
      (formData as CreateSectionDto).image = fileList.files;
    }

    await onSubmit(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  };

  return (
    <MainForm
      onSubmit={handleSubmit}
      submitButtonText={isEditMode ? 'Actualizar Sección' : 'Crear Sección'}
    >
      <InputField
        id="sectionNumber"
        label="Número de Sección"
        type="number"
        value={number.toString()}
        onChange={(e) => setNumber(parseInt(e.target.value) || 1)}
        required={true}
        placeholder="Ingrese el número de sección"
        props={{ autoComplete: 'off', min: 1 }}
        isLoading={isLoading}
      />

      <InputField
        id="sectionCapacity"
        label="Capacidad"
        type="number"
        value={capacity.toString()}
        onChange={(e) => setCapacity(parseInt(e.target.value) || 20)}
        required={true}
        placeholder="Ingrese la capacidad"
        props={{ autoComplete: 'off', min: 1 }}
        isLoading={isLoading}
      />

      <InputField
        id="sectionInstructor"
        label="Instructor"
        type="text"
        value={instructor}
        onChange={(e) => setInstructor(e.target.value)}
        required={true}
        placeholder="Ingrese el nombre del instructor"
        props={{ autoComplete: 'off' }}
        isLoading={isLoading}
      />

      <InputField
        id="sectionDescription"
        label="Descripción"
        type="textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required={true}
        placeholder="Ingrese la descripción de la sección"
        props={{ autoComplete: 'off' }}
        isLoading={isLoading}
      />

      <InputFileField
        id="sectionImage"
        label="Imagen de la Sección"
        onChange={handleFileChange}
        required={false}
        accept="image/*"
        multiple={false}
        isLoading={isLoading}
      />
    </MainForm>
  );
};

export default SectionForm;
