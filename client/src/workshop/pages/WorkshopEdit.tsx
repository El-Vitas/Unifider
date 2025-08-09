import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/hooks/useAuth';
import { useAsync } from '../../common/hooks/useAsync';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { customToast } from '../../common/utils/customToast';
import config from '../../config';
import WorkshopForm from '../components/WorkshopForm';
import type {
  Workshop,
  UpdateWorkshopDto,
  CreateWorkshopDto,
} from '../entities';
import type { CustomHttpResponse } from '../../common/types';

const WorkshopEdit = () => {
  const { workshopId } = useParams<{ workshopId: string }>();
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const workshopUrl = useMemo(
    () => `${config.apiUrl}/workshop/${workshopId}`,
    [workshopId],
  );
  const fetchWorkshopFn = useCallback(
    () =>
      httpAdapter.get<Workshop>(workshopUrl, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [workshopUrl, authToken],
  );

  const {
    data,
    loading,
    error,
    execute: fetchWorkshop,
  } = useAsync<CustomHttpResponse<Workshop>>(
    fetchWorkshopFn,
    'Failed to fetch workshop',
  );

  useEffect(() => {
    if (workshopId) {
      fetchWorkshop();
    }
  }, [fetchWorkshop, workshopId]);

  const workshop = data?.data;
  useEffect(() => {
    if (error) {
      customToast.error(error);
      navigate('/workshop');
    }
  }, [error, navigate]);

  const handleSubmit = async (
    workshopData: CreateWorkshopDto | UpdateWorkshopDto,
    imageFile?: File,
  ) => {
    if (!workshop) return;

    setIsSubmitting(true);
    try {
      const updateData = {
        id: workshop.id,
        name: workshopData.name,
        description: workshopData.description,
      };

      await httpAdapter.put(`${config.apiUrl}/workshop/update`, updateData, {
        headers: {
          authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (imageFile && workshop.id) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        await httpAdapter.post(
          `${config.apiUrl}/workshop/${workshop.id}/image`,
          imageFormData,
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      customToast.success('Workshop actualizado exitosamente');
      navigate('/workshop');
    } catch (error) {
      console.error('Error updating workshop:', error);
      customToast.error('Error al actualizar el workshop');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return <div className="mt-6 text-center">Cargando workshop...</div>;
  }

  if (!workshop) {
    return <div className="mt-6 text-center">Workshop no encontrado</div>;
  }

  if (!workshop) {
    return <div className="mt-6 text-center">Workshop no encontrado</div>;
  }

  return (
    <WorkshopForm
      onSubmit={handleSubmit}
      initialData={workshop}
      isLoading={isSubmitting}
      isEditMode={true}
    />
  );
};

export default WorkshopEdit;
