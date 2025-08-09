import { useState, useCallback } from 'react';
import { useAuth } from '../../common/hooks/useAuth';
import config from '../../config';
import { customToast } from '../../common/utils/customToast';
import { httpAdapter } from '../../common/adapters/httpAdapter';

export const useDeleteWorkshop = () => {
  const authToken = useAuth().authToken;
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const deleteWorkshop = useCallback(
    async (id: string) => {
      try {
        setDeletedIds((prev) => new Set([...prev, id]));

        await httpAdapter.delete(`${config.apiUrl}/workshop/delete/${id}`, {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        });

        customToast.success('Workshop eliminado correctamente');
        return true;
      } catch (err: unknown) {
        setDeletedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });

        if (err instanceof Error) {
          customToast.error(err.message);
        } else {
          customToast.error('Error al eliminar el workshop');
        }
        return false;
      }
    },
    [authToken],
  );

  const isDeleted = (id: string) => deletedIds.has(id);

  return { deleteWorkshop, isDeleted };
};
