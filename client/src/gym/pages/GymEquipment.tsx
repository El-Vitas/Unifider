import { httpAdapter } from '../../common/adapters/httpAdapter';
import { useAsync } from '../../common/hooks/useAsync';
import config from '../../config';
import { useEffect, useMemo, useCallback } from 'react';
import { customToast } from '../../common/utils/customToast';
import ContainerCards from '../../common/components/ContainerCards';
import { useParams } from 'react-router-dom';
import type { CustomHttpResponse } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';
import type { EquipmentType } from '../../equipment/entities';
import EquipmentCard from '../../equipment/components/EquipmentCard';

const GymEquipment = () => {
  const { gymName } = useParams<{ gymName: string }>();
  const url = useMemo(
    () => `${config.apiUrl}/gym/${gymName}/equipment`,
    [gymName],
  );
  const authToken = useAuth().authToken;

  const fetchGymEquipmentFn = useCallback(
    () =>
      httpAdapter.get<EquipmentType[]>(url, {
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
    execute: fetchGymEquipment,
  } = useAsync<CustomHttpResponse<EquipmentType[]>>(
    fetchGymEquipmentFn,
    'Failed to fetch gym equipment',
  );

  useEffect(() => {
    fetchGymEquipment();
  }, [fetchGymEquipment]);

  const equipments = data?.data ?? [];

  useEffect(() => {
    if (error) {
      customToast.error(error);
    }
  }, [error]);

  if (loading) {
    return <div className="mt-6 text-center">Loading...</div>;
  }

  if (equipments.length === 0) {
    return (
      <ContainerCards>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No hay equipamiento asociado
          </h2>
          <p className="text-gray-500">
            Este gimnasio no tiene equipamiento registrado actualmente.
          </p>
        </div>
      </ContainerCards>
    );
  }

  return (
    <ContainerCards>
      <>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            Equipamiento - {gymName?.replace(/-/g, ' ')}
          </h1>
          <p className="text-gray-600 mt-2">
            Equipamiento disponible en este gimnasio
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {equipments.map((equipment) => (
            <EquipmentCard {...equipment} key={equipment.id} buttons={<></>} />
          ))}
        </div>
      </>
    </ContainerCards>
  );
};

export default GymEquipment;
