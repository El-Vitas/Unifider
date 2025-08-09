import { useEffect, useState } from 'react';
import MainForm from '../../common/components/MainForm';
import InputField from '../../common/components/form/InputField';
import InputFileField from '../../common/components/form/InputFileField';
import type {
  CreateWorkshopDto,
  UpdateWorkshopDto,
  Workshop,
} from '../entities';

interface WorkshopFormProps {
  onSubmit: (data: CreateWorkshopDto | UpdateWorkshopDto) => Promise<void>;
  initialData?: Workshop;
  isLoading?: boolean;
  isEditMode?: boolean;
}

const WorkshopForm = ({
  onSubmit,
  initialData,
  isLoading = false,
  isEditMode = false,
}: WorkshopFormProps) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      return;
    }

    const formData: CreateWorkshopDto | UpdateWorkshopDto = {
      name,
      description,
      imageUrl: '',
    };

    if (imageFile) {
      const fileList = new DataTransfer();
      fileList.items.add(imageFile);
      (formData as CreateWorkshopDto).image = fileList.files;
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
      submitButtonText={isEditMode ? 'Actualizar Workshop' : 'Crear Workshop'}
    >
      <InputField
        id="workshopName"
        label="Nombre del Workshop"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required={true}
        placeholder="Ingrese el nombre del workshop"
        props={{ autoComplete: 'off' }}
        isLoading={isLoading}
      />

      <InputField
        id="workshopDescription"
        label="Descripción"
        type="textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required={true}
        placeholder="Ingrese la descripción del workshop"
        props={{ autoComplete: 'off' }}
        isLoading={isLoading}
      />

      <InputFileField
        id="workshopImage"
        label="Imagen del Workshop"
        onChange={handleFileChange}
        required={false}
        accept="image/*"
        multiple={false}
        isLoading={isLoading}
      />
    </MainForm>
  );
};

export default WorkshopForm;
