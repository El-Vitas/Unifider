import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/hooks/useAuth';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { customToast } from '../../common/utils/customToast';
import config from '../../config';
import SectionForm from '../components/SectionForm';
import type { CreateSectionDto } from '../entities';

const SectionCreate = () => {
  const { workshopId } = useParams<{ workshopId: string }>();
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (sectionData: CreateSectionDto) => {
    setIsSubmitting(true);
    try {
      const { image, ...sectionPayload } = sectionData;

      const createSectionResponse = await httpAdapter.post<{ id: string }>(
        `${config.apiUrl}/section`,
        sectionPayload,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const createdSection = createSectionResponse.data;

      if (image && image.length > 0 && createdSection && createdSection.id) {
        const imageFormData = new FormData();
        imageFormData.append('image', image[0]);
        await httpAdapter.post(
          `${config.apiUrl}/section/${createdSection.id}/image`,
          imageFormData,
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      customToast.success('Sección creada exitosamente');
      navigate(`/workshop/sections/${workshopId}`);
    } catch (error) {
      console.error('Error creating section:', error);
      customToast.error('Error al crear la sección');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionForm
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
      workshopId={workshopId}
    />
  );
};

export default SectionCreate;
