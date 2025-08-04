import GymCard from '../components/GymCard';
import type { GymType } from '../entities';
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

const GymAdmin = () => {
  const url = useMemo(() => `${config.apiUrl}/gym`, []);
  const authToken = useAuth().authToken;

  const fetchGymsFn = useCallback(
    () =>
      httpAdapter.get<GymType[]>(url, {
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
    execute: fetchGyms,
  } = useAsync<CustomHttpResponse<GymType[]>>(
    fetchGymsFn,
    'Failed to fetch gyms',
  );

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

  const gyms = data?.data ?? [];

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
          <BtnPrimary as={Link} to="/gym/create">
            Crear gimnasio
          </BtnPrimary>

          <BtnPrimary as={Link} to="/gym/equipment/">
            Gestionar Equipamiento
          </BtnPrimary>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {gyms.map((gym) => (
            <GymCard
              {...gym}
              key={gym.id}
              buttons={
                <>
                  <BtnCard
                    as={Link}
                    to={`/gym/edit/${gym.name.toLowerCase()}`}
                    className="text-xs py-1.5 px-2"
                  >
                    Editar <RightOutlined />
                  </BtnCard>

                  <BtnCard
                    as={Link}
                    to={`/gym/equipment/${gym.name.toLowerCase()}`}
                    className="text-xs py-1.5 px-2"
                  >
                    Ver equipamiento <RightOutlined />
                  </BtnCard>

                  <BtnCard
                    as={Link}
                    to={`/gym/bookings/${gym.id}`}
                    className="text-xs py-1.5 px-2"
                  >
                    <UserOutlined /> Gestionar reservas
                  </BtnCard>

                  <BtnCard
                    as={Link}
                    to={`/gym/delete/${gym.name.toLowerCase()}`}
                    className="!text-xs !py-1.5 !px-2"
                  >
                    Eliminar <RightOutlined />
                  </BtnCard>
                </>
              }
            />
          ))}
        </div>
      </>
    </ContainerCards>
  );
};

export default GymAdmin;
