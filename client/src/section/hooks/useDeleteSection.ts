import { useCallback } from 'react';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { useAuth } from '../../common/hooks/useAuth';
import { customToast } from '../../common/utils/customToast';
import config from '../../config';

export const useDeleteSection = () => {
  const { authToken } = useAuth();

  const deleteSection = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await httpAdapter.delete(`${config.apiUrl}/section/${id}`, {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        });

        customToast.success('Sección eliminada exitosamente');
        return true;
      } catch (error) {
        console.error('Error deleting section:', error);
        customToast.error('Error al eliminar la sección');
        return false;
      }
    },
    [authToken],
  );

  return { deleteSection };
};
