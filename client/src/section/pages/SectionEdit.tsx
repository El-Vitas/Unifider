import { useEffect, useMemo, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAsync } from '../../common/hooks/useAsync';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { useAuth } from '../../common/hooks/useAuth';
import { customToast } from '../../common/utils/customToast';
import SectionForm from '../components/SectionForm';
import config from '../../config';
import type { Section, UpdateSectionDto, CreateSectionDto } from '../entities';
import type { CustomHttpResponse } from '../../common/types';

const SectionEdit = () => {
  const { sectionId, workshopId } = useParams<{
    sectionId: string;
    workshopId: string;
  }>();
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectionUrl = useMemo(
    () => `${config.apiUrl}/section/${sectionId}`,
    [sectionId],
  );

  const fetchSectionFn = useCallback(
    () =>
      httpAdapter.get<Section>(sectionUrl, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [sectionUrl, authToken],
  );

  const {
    data,
    loading,
    error,
    execute: fetchSection,
  } = useAsync<CustomHttpResponse<Section>>(
    fetchSectionFn,
    'Failed to fetch section',
  );

  useEffect(() => {
    if (sectionId) {
      fetchSection();
    }
  }, [fetchSection, sectionId]);

  const section = data?.data;

  useEffect(() => {
    if (error) {
      customToast.error(error);
      navigate(`/workshop/sections/${workshopId}`);
    }
  }, [error, navigate, workshopId]);

  const handleSubmit = async (
    sectionData: CreateSectionDto | UpdateSectionDto,
  ) => {
    if (!section) return;

    setIsSubmitting(true);
    try {
      const { image, ...sectionPayload } = sectionData as CreateSectionDto & {
        image?: FileList;
      };
      await httpAdapter.put(
        `${config.apiUrl}/section/${section.id}`,
        sectionPayload,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (image && image.length > 0 && section.id) {
        const imageFormData = new FormData();
        imageFormData.append('image', image[0]);
        await httpAdapter.post(
          `${config.apiUrl}/section/${section.id}/image`,
          imageFormData,
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      customToast.success('Sección actualizada exitosamente');
      navigate(`/workshop/sections/${workshopId}`);
    } catch (error) {
      console.error('Error updating section:', error);
      customToast.error('Error al actualizar la sección');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="mt-6 text-center">Cargando sección...</div>;
  }

  if (!section) {
    return <div className="mt-6 text-center">Sección no encontrada</div>;
  }

  return (
    <SectionForm
      onSubmit={handleSubmit}
      initialData={section}
      isLoading={isSubmitting}
      isEditMode={true}
      workshopId={workshopId}
    />
  );
};

export default SectionEdit;
