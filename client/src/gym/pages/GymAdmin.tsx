import GymCard from '../components/GymCard';
import type { GymType } from '../entities';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { useAsync } from '../../common/hooks/useAsync';
import config from '../../config';
import { useEffect, useMemo, useCallback } from 'react';
import { customToast } from '../../common/utils/customToast';
import ContainerCards from '../../common/components/ContainerCards';
import BtnCard from '../../common/components/BtnPrimary';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';

const GymAdmin = () => {
  const url = useMemo(() => `${config.apiUrl}/gym`, []);
  const fetchGymsFn = useCallback(() => httpAdapter.get<GymType[]>(url), [url]);

  const {
    data,
    loading,
    error,
    execute: fetchGyms,
  } = useAsync<GymType[]>(fetchGymsFn, 'Failed to fetch gyms');

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

  const gyms = data ?? [];

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
        {gyms.map((gym) => (
            <GymCard
              {...gym}
              key={gym.id}
              buttons={
                <>
                  <BtnCard as={Link} to={`/gym/edit/${gym.name.toLowerCase()}`}>
                    Editar {' '}
                    <RightOutlined />
                  </BtnCard>
                  
                  <BtnCard as={Link} to={`/gym/delete/${gym.name.toLowerCase()}`}>
                    Eliminar {' '}
                    <RightOutlined />
                  </BtnCard>
                </>
              }
            />
        ))}
      </>
    </ContainerCards>
  );
};

export default GymAdmin;
