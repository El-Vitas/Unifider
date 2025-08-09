import { useState, useCallback } from 'react';
import { useAuth } from '../../common/hooks/useAuth';
import config from '../../config';
import { customToast } from '../../common/utils/customToast';
import { httpAdapter } from '../../common/adapters/httpAdapter';

export const useDeleteTeam = () => {
  const authToken = useAuth().authToken;
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const deleteTeam = useCallback(
    async (id: string) => {
      try {
        setDeletedIds((prev) => new Set([...prev, id]));

        await httpAdapter.delete(`${config.apiUrl}/team/${id}`, {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        });

        customToast.success('Equipo eliminado correctamente');
      } catch (err: unknown) {
        setDeletedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });

        if (err instanceof Error) {
          customToast.error(
            `Error al eliminar el equipo: ${err?.message ?? 'Error desconocido'}`,
          );
        } else {
          customToast.error('Error al eliminar el equipo: Error desconocido');
        }
      }
    },
    [authToken],
  );

  const isDeleted = useCallback(
    (id: string) => deletedIds.has(id),
    [deletedIds],
  );

  return { deleteTeam, isDeleted };
};
