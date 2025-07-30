import ContainerCards from '../../common/components/ContainerCards';
import { useAsync } from '../../common/hooks/useAsync';
import { useDeleteLocation } from '../hooks/useDeleteLocation';
import { useEffect, useMemo, useCallback } from 'react';
import config from '../../config';
import { customToast } from '../../common/utils/customToast';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import type { LocationType } from '../entities';
import LocationCard from '../components/LocationCard';
import BtnPrimary from '../../common/components/button/BtnPrimary';
import BtnDelete from '../../common/components/button/BtnDelete';
import { Link } from 'react-router-dom';
import type { CustomHttpResponse } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';

const Location = () => {
  const url = useMemo(() => `${config.apiUrl}/location`, []);
  const authToken = useAuth().authToken;
  const { deleteLocation, isDeleted } = useDeleteLocation();

  const fetchLocationsFn = useCallback(
    () =>
      httpAdapter.get<LocationType[]>(url, {
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
  } = useAsync<CustomHttpResponse<LocationType[]>>(
    fetchLocationsFn,
    'Failed to fetch Locations',
  );

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

  const locations = data?.data ?? [];

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
        <div className="flex justify-end w-full mt-4">
          <BtnPrimary as={Link} to="/location/create">
            Crear ubicación
          </BtnPrimary>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {locations
            .filter((location) => !isDeleted(location.id))
            .map((location) => (
              <LocationCard
                {...location}
                key={location.id}
                buttons={
                  <>
                    <BtnPrimary
                      as={Link}
                      to={`/location/edit/${location.name}`}
                    >
                      Editar
                    </BtnPrimary>
                    <BtnDelete
                      onDelete={() => deleteLocation(location.id)}
                      confirmTitle="Confirmar eliminación"
                      confirmMessage="¿Estás seguro de que quieres eliminar esta ubicación?"
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

export default Location;
