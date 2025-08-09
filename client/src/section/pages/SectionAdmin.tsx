import { useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SectionDetailCard from '../components/SectionDetailCard';
import { useDeleteSection } from '../hooks/useDeleteSection';
import { useAsync } from '../../common/hooks/useAsync';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { useAuth } from '../../common/hooks/useAuth';
import { customToast } from '../../common/utils/customToast';
import ContainerCards from '../../common/components/ContainerCards';
import BtnPrimary from '../../common/components/button/BtnPrimary';
import config from '../../config';
import type { Section } from '../entities';
import type { CustomHttpResponse } from '../../common/types';

const SectionAdmin = () => {
  const { workshopId } = useParams<{ workshopId: string }>();
  const navigate = useNavigate();
  const url = useMemo(
    () => `${config.apiUrl}/section/workshop/${workshopId}`,
    [workshopId],
  );
  const authToken = useAuth().authToken;
  const { deleteSection } = useDeleteSection();

  const fetchSectionsFn = useCallback(
    () =>
      httpAdapter.get<Section[]>(url, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [url, authToken],
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
    fetchSections();
  }, [fetchSections]);

  const sections = data?.data ?? [];

  useEffect(() => {
    if (error) {
      customToast.error(error);
    }
  }, [error]);

  const handleDelete = async (id: string) => {
    const success = await deleteSection(id);
    if (success) {
      fetchSections();
    }
  };

  if (loading) {
    return <div className="mt-6 text-center">Loading...</div>;
  }

  return (
    <ContainerCards>
      <>
        <div className="flex justify-end w-full mt-4 gap-3">
          <BtnPrimary as={Link} to={`/section/create/${workshopId}`}>
            Crear Sección
          </BtnPrimary>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {sections.map((section) => (
            <SectionDetailCard
              key={section.id}
              number={section.number}
              description={section.description}
              instructor={section.instructor}
              imageUrl={section.imageUrl}
              timeSlots={section.timeSlots}
              bookingsCount={section.bookingsCount || 0}
              isBooked={section.isBooked || false}
              capacity={section.capacity}
              showAdminButtons={true}
              onEdit={() => {
                navigate(`/section/edit/${section.id}/${workshopId}`);
              }}
              onDelete={() => handleDelete(section.id)}
            />
          ))}
        </div>
      </>
    </ContainerCards>
  );
};

export default SectionAdmin;
