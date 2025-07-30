import { httpAdapter } from '../../common/adapters/httpAdapter';
import { useAsync } from '../../common/hooks/useAsync';
import { useDeleteEquipment } from '../hooks/useDeleteEquipment';
import config from '../../config';
import { useEffect, useMemo, useCallback } from 'react';
import { customToast } from '../../common/utils/customToast';
import ContainerCards from '../../common/components/ContainerCards';
import { Link } from 'react-router-dom';
import BtnDelete from '../../common/components/button/BtnDelete';
import type { CustomHttpResponse } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';
import BtnPrimary from '../../common/components/button/BtnPrimary';
import type { EquipmentType } from '../entities';
import EquipmentCard from '../components/EquipmentCard';

const EquipmentAdmin = () => {
  const url = useMemo(() => `${config.apiUrl}/equipment`, []);
  const authToken = useAuth().authToken;
  const { deleteEquipment, isDeleted } = useDeleteEquipment();

  const fetchEquipmentFn = useCallback(
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
    execute: fetchEquipment,
  } = useAsync<CustomHttpResponse<EquipmentType[]>>(
    fetchEquipmentFn,
    'Failed to fetch equipment',
  );

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const equipments = data?.data ?? [];

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
          <BtnPrimary as={Link} to="/gym/equipment/create">
            Crear equipamiento
          </BtnPrimary>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {equipments
            .filter((equipment) => !isDeleted(equipment.id))
            .map((equipment) => (
              <EquipmentCard
                {...equipment}
                key={equipment.id}
                buttons={
                  <>
                    <BtnPrimary
                      as={Link}
                      to={`/gym/equipment/edit/${equipment.name}`}
                    >
                      Editar
                    </BtnPrimary>
                    <BtnDelete
                      onDelete={() => deleteEquipment(equipment.id)}
                      confirmTitle="Confirmar eliminación"
                      confirmMessage="¿Estás seguro de que quieres eliminar este equipamiento?"
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

export default EquipmentAdmin;
