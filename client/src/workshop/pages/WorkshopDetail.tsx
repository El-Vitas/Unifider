import { useEffect, useMemo, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import SectionDetailCard from '../../section/components/SectionDetailCard';
import BtnPrimary from '../../common/components/button/BtnPrimary';
import BtnDelete from '../../common/components/button/BtnDelete';
import { useAsync } from '../../common/hooks/useAsync';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { useAuth } from '../../common/hooks/useAuth';
import { customToast } from '../../common/utils/customToast';
import config from '../../config';
import type { Section } from '../../section/entities';
import type { CustomHttpResponse } from '../../common/types';

const WorkshopDetail = () => {
  const { id: workshopId } = useParams<{ id: string }>();
  const authToken = useAuth().authToken;

  const sectionsUrl = useMemo(
    () => `${config.apiUrl}/section/workshop/${workshopId}`,
    [workshopId],
  );

  const fetchSectionsFn = useCallback(
    () =>
      httpAdapter.get<Section[]>(sectionsUrl, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [sectionsUrl, authToken],
  );

  const {
    data,
    loading,
    error,
    execute: fetchSections,
  } = useAsync<CustomHttpResponse<Section[]>>(
    fetchSectionsFn,
    'Failed to fetch sections',
  );

  useEffect(() => {
    if (workshopId) {
      fetchSections();
    }
  }, [fetchSections, workshopId]);

  const sections = data?.data ?? [];

  useEffect(() => {
    if (error) {
      customToast.error(error);
    }
  }, [error]);

  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const handleEnroll = async (sectionId: string, isBooked: boolean) => {
    setEnrollingId(sectionId);
    try {
      if (!isBooked) {
        await httpAdapter.post(
          `${config.apiUrl}/section/booking`,
          { sectionId },
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
        customToast.success('Inscripción realizada exitosamente');
      } else {
        await httpAdapter.post(
          `${config.apiUrl}/section/unbooking`,
          { sectionId },
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
        customToast.success('Inscripción cancelada');
      }
      fetchSections();
    } catch (error) {
      console.error('Error (un)enrolling in section:', error);
      customToast.error('Error al procesar la inscripción');
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return <div className="mt-6 text-center">Loading...</div>;
  }

  if (!sections.length) {
    return (
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          No hay secciones disponibles para este workshop.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {sections.map((section) => {
        const isFull = (section.bookingsCount || 0) >= section.capacity;
        const isBooked = !!section.isBooked;
        return (
          <div
            key={section.id}
            className="rounded-lg shadow border bg-white p-3 md:p-4 flex flex-col md:flex-row gap-4 items-center"
          >
            <div className="flex-1 w-full">
              <SectionDetailCard
                number={section.number}
                imageUrl={section.imageUrl}
                description={section.description}
                instructor={section.instructor}
                timeSlots={section.timeSlots || []}
                bookingsCount={section.bookingsCount || 0}
                isBooked={isBooked}
                capacity={section.capacity}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-48 items-stretch">
              {isBooked ? (
                <BtnDelete
                  onDelete={() => handleEnroll(section.id, true)}
                  className="!py-2.5 !text-sm !px-4"
                  confirmTitle="Cancelar inscripción"
                  confirmMessage="¿Estás seguro de cancelar tu inscripción en esta sección?"
                >
                  {enrollingId === section.id
                    ? 'Cancelando...'
                    : 'Cancelar inscripción'}
                </BtnDelete>
              ) : (
                <BtnPrimary
                  onClick={() => handleEnroll(section.id, false)}
                  className="!py-2.5 !text-sm !px-4"
                  disabled={isFull || enrollingId === section.id}
                >
                  {isFull
                    ? 'Sección completa'
                    : enrollingId === section.id
                      ? 'Inscribiendo...'
                      : 'Inscribirse'}
                </BtnPrimary>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkshopDetail;
