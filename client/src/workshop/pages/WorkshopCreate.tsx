import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/hooks/useAuth';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { customToast } from '../../common/utils/customToast';
import config from '../../config';
import WorkshopForm from '../components/WorkshopForm';
import type { CreateWorkshopDto, Workshop } from '../entities';

const WorkshopCreate = () => {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (workshopData: CreateWorkshopDto) => {
    setIsSubmitting(true);
    try {
      const createData = {
        name: workshopData.name.trim(),
        description: workshopData.description.trim(),
      };

      const createResponse = await httpAdapter.post<Workshop>(
        `${config.apiUrl}/workshop/create`,
        createData,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const createdWorkshop = createResponse.data;

      if (
        workshopData.image &&
        workshopData.image.length > 0 &&
        createdWorkshop.id
      ) {
        const imageFormData = new FormData();
        imageFormData.append('image', workshopData.image[0]);

        await httpAdapter.post(
          `${config.apiUrl}/workshop/${createdWorkshop.id}/image`,
          imageFormData,
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      customToast.success('Workshop creado exitosamente');
      navigate('/workshop');
    } catch (error) {
      console.error('Error creating workshop:', error);
      customToast.error('Error al crear el workshop');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <WorkshopForm onSubmit={handleSubmit} isLoading={isSubmitting} />;
};

export default WorkshopCreate;
