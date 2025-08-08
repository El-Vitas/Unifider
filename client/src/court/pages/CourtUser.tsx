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
import { RightOutlined } from '@ant-design/icons';
import type { CustomHttpResponse } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';

const CourtUser = () => {
  const url = useMemo(() => `${config.apiUrl}/court`, []);
  const authToken = useAuth().authToken;
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
        <div className="flex flex-wrap justify-center gap-6">
          {courts.map((court) => (
            <CourtCard
              {...court}
              key={court.id}
              buttons={
                <div className="flex gap-1.5">
                  <BtnCard
                    as={Link}
                    to={`/court/booking/${court.id}`}
                    className="!text-xs !py-1.5 !px-3"
                  >
                    Inscribirse <RightOutlined />
                  </BtnCard>
                </div>
              }
            />
          ))}
        </div>
      </>
    </ContainerCards>
  );
};

export default CourtUser;
