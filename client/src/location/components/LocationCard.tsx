import { useState } from 'react';
import type { LocationType } from '../entities';
import BtnPrimary from '../../common/components/button/BtnPrimary';
import { Link } from 'react-router-dom';
import BtnDelete from '../../common/components/button/BtnDelete';
import { useAuth } from '../../common/hooks/useAuth';
import config from '../../config';
import { useCallback } from 'react';
import { customToast } from '../../common/utils/customToast';
import { httpAdapter } from '../../common/adapters/httpAdapter';

const LocationCard = ({ id, name, description }: LocationType) => {
  const authToken = useAuth().authToken;
  const [isDeleted, setIsDeleted] = useState(false);

  const deleteLocationFn = useCallback(
    () =>
      httpAdapter.delete(`${config.apiUrl}/location/delete/${id}`, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [authToken, id],
  );

  const onDelete = async () => {
    try {
      setIsDeleted(true);
      
      await deleteLocationFn();
      customToast.success('Ubicación eliminada correctamente');
    } catch (err: unknown) {
      setIsDeleted(false);
      
      if (err instanceof Error) {
        customToast.error(
          `Error al eliminar la ubicación: ${err?.message ?? 'Error desconocido'}`,
        );
      } else {
        customToast.error('Error al eliminar la ubicación: Error desconocido');
      }
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div className="mb-4 transition-shadow duration-150 shadow-lg w-60 ring-1 ring-slate-700/30 rounded-2xl bg-slate-50 hover:shadow-xl">
      <div className="px-4 py-4 text-center">
        <span className="font-semibold text-gray-800">Nombre:</span>
        <p className="text-gray-600">{name}</p>
        <span className="font-semibold text-gray-800">Descripción:</span>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex justify-center gap-3 mb-2">
        <BtnPrimary as={Link} to={`/location/edit/${name}`}>
          Editar
        </BtnPrimary>
        <BtnDelete
          onDelete={onDelete}
          confirmTitle="Confirmar eliminación"
          confirmMessage="¿Estás seguro de que quieres eliminar esta ubicación?"
        >
          Eliminar
        </BtnDelete>
      </div>
    </div>
  );
};

export default LocationCard;
