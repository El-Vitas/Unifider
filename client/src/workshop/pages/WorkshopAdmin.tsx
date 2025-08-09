import { useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import WorkshopCard from '../components/WorkshopCard';
import { useDeleteWorkshop } from '../hooks/useDeleteWorkshop';
import { useAsync } from '../../common/hooks/useAsync';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { useAuth } from '../../common/hooks/useAuth';
import { customToast } from '../../common/utils/customToast';
import ContainerCards from '../../common/components/ContainerCards';
import BtnPrimary from '../../common/components/button/BtnPrimary';
import BtnDelete from '../../common/components/button/BtnDelete';
import { RightOutlined } from '@ant-design/icons';
import config from '../../config';
import type { WorkshopWithCount } from '../entities';
import type { CustomHttpResponse } from '../../common/types';

const WorkshopAdmin = () => {
  const url = useMemo(() => `${config.apiUrl}/workshop`, []);
  const authToken = useAuth().authToken;
  const { deleteWorkshop } = useDeleteWorkshop();

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

  const handleDelete = async (id: string) => {
    const success = await deleteWorkshop(id);
    if (success) {
      fetchWorkshops();
    }
  };

  if (loading) {
    return <div className="mt-6 text-center">Loading...</div>;
  }

  return (
    <ContainerCards>
      <>
        <div className="flex justify-end w-full mt-4 gap-3">
          <BtnPrimary as={Link} to="/workshop/create">
            Crear Workshop
          </BtnPrimary>
        </div>

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
                <div className="flex gap-1.5">
                  <BtnPrimary
                    as={Link}
                    to={`/workshop/edit/${workshop.id}`}
                    className="!text-xs !py-1.5 !px-3"
                  >
                    Editar <RightOutlined />
                  </BtnPrimary>
                  <BtnDelete
                    onDelete={() => handleDelete(workshop.id)}
                    className="!text-xs !py-1.5 !px-3"
                  >
                    Eliminar
                  </BtnDelete>
                  <BtnPrimary
                    as={Link}
                    to={`/workshop/sections/${workshop.id}`}
                    className="!text-xs !py-1.5 !px-3"
                  >
                    Gestionar <RightOutlined />
                  </BtnPrimary>
                </div>
              }
            />
          ))}
        </div>
      </>
    </ContainerCards>
  );
};

export default WorkshopAdmin;
