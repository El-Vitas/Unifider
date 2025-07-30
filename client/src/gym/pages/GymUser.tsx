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
import { RightOutlined } from '@ant-design/icons';
import { capitalize } from '../../common/utils/capitalize';
import type { CustomHttpResponse } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';
const GymUser = () => {
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
        {gyms.map((gym) => (
          <GymCard
            {...gym}
            key={gym.id}
            buttons={
              <div className="flex gap-2 pt-2">
                <BtnCard as={Link} to={`/${capitalize(gym.name)}`}>
                  Horarios <RightOutlined />
                </BtnCard>
              </div>
            }
          />
        ))}
      </>
    </ContainerCards>
  );
};

export default GymUser;
