import CourtCard from '../components/CourtCard';
import type { CourtType } from '../entities';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { useAsync } from '../../common/hooks/useAsync';
import config from '../../config';
import { useEffect, useMemo, useCallback } from 'react';
import { customToast } from '../../common/utils/customToast';
import ContainerCards from '../../common/components/ContainerCards';
import BtnCard from '../../common/components/button/BtnPrimary';
import { Link } from 'react-router-dom';
import { RightOutlined, UserOutlined } from '@ant-design/icons';
import type { CustomHttpResponse } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';
import BtnPrimary from '../../common/components/button/BtnPrimary';
import BtnDelete from '../../common/components/button/BtnDelete';
import { useDeleteCourt } from '../hooks/useDeleteCourt';

const CourtAdmin = () => {
  const url = useMemo(() => `${config.apiUrl}/court`, []);
  const authToken = useAuth().authToken;
  const { deleteCourt, isDeleted } = useDeleteCourt();

  const fetchCourtsFn = useCallback(
    () =>
      httpAdapter.get<CourtType[]>(url, {
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
    execute: fetchCourts,
  } = useAsync<CustomHttpResponse<CourtType[]>>(
    fetchCourtsFn,
    'Failed to fetch courts',
  );

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  const courts = data?.data ?? [];

  useEffect(() => {
    if (error) {
      customToast.error(error);
    }
  }, [error]);

  if (loading) {
    return <div className="mt-6 text-center">Loading...</div>;
  }

  return (
    <ContainerCards>
      <>
        <div className="flex justify-end w-full mt-4 gap-3">
          <BtnPrimary as={Link} to="/court/create">
            Crear cancha
          </BtnPrimary>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {courts
            .filter((court) => !isDeleted(court.id))
            .map((court) => (
              <CourtCard
                {...court}
                key={court.id}
                buttons={
                  <>
                    <BtnCard
                      as={Link}
                      to={`/court/edit/${court.name.toLowerCase()}`}
                      className="text-xs py-1.5 px-2"
                    >
                      Editar <RightOutlined />
                    </BtnCard>

                    <BtnCard
                      as={Link}
                      to={`/court/bookings/${court.id}`}
                      className="text-xs py-1.5 px-2"
                    >
                      <UserOutlined /> Gestionar reservas
                    </BtnCard>

                    <BtnDelete
                      onDelete={() => deleteCourt(court.id)}
                      confirmTitle="Confirmar eliminación"
                      confirmMessage="¿Estás seguro de que quieres eliminar esta cancha?"
                    >
                      Eliminar
                    </BtnDelete>
                  </>
                }
              />
            ))}
        </div>
      </>
    </ContainerCards>
  );
};

export default CourtAdmin;
