import { useEffect, useMemo, useCallback } from 'react';
import WorkshopCard from '../components/WorkshopCard';
import { useAsync } from '../../common/hooks/useAsync';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { useAuth } from '../../common/hooks/useAuth';
import { customToast } from '../../common/utils/customToast';
import ContainerCards from '../../common/components/ContainerCards';
import BtnCard from '../../common/components/button/BtnPrimary';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import config from '../../config';
import type { WorkshopWithCount } from '../entities';
import type { CustomHttpResponse } from '../../common/types';

const WorkshopUser = () => {
  const url = useMemo(() => `${config.apiUrl}/workshop`, []);
  const authToken = useAuth().authToken;

  const fetchWorkshopsFn = useCallback(
    () =>
      httpAdapter.get<WorkshopWithCount[]>(url, {
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
    execute: fetchWorkshops,
  } = useAsync<CustomHttpResponse<WorkshopWithCount[]>>(
    fetchWorkshopsFn,
    'Failed to fetch workshops',
  );

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const workshops = data?.data ?? [];

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
      <div className="flex flex-wrap justify-center gap-6">
        {workshops.map((workshop) => (
          <WorkshopCard
            key={workshop.id}
            id={workshop.id}
            name={workshop.name}
            description={workshop.description}
            imageUrl={workshop.imageUrl || undefined}
            sectionsCount={workshop._count.sections}
            buttons={
              <BtnCard
                as={Link}
                to={`/workshop/${workshop.id}`}
                className="!text-xs !py-1.5 !px-3"
              >
                Ver secciones <RightOutlined />
              </BtnCard>
            }
          />
        ))}
      </div>
    </ContainerCards>
  );
};

export default WorkshopUser;
