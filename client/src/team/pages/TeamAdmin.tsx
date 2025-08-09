import ContainerCards from '../../common/components/ContainerCards';
import { useAsync } from '../../common/hooks/useAsync';
import { useDeleteTeam } from '../hooks/useDeleteTeam';
import { useEffect, useMemo, useCallback } from 'react';
import config from '../../config';
import { customToast } from '../../common/utils/customToast';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import type { Team } from '../entities';
import TeamCard from '../components/TeamCard';
import BtnPrimary from '../../common/components/button/BtnPrimary';
import BtnDelete from '../../common/components/button/BtnDelete';
import { Link } from 'react-router-dom';
import type { CustomHttpResponse } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';

const TeamAdmin = () => {
  const url = useMemo(() => `${config.apiUrl}/team`, []);
  const authToken = useAuth().authToken;
  const { deleteTeam, isDeleted } = useDeleteTeam();

  const fetchTeamsFn = useCallback(
    () =>
      httpAdapter.get<Team[]>(url, {
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
    execute: fetchTeams,
  } = useAsync<CustomHttpResponse<Team[]>>(
    fetchTeamsFn,
    'Failed to fetch Teams',
  );

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const teams = data?.data ?? [];

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
          <BtnPrimary as={Link} to="/team/create">
            Crear equipo
          </BtnPrimary>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {teams
            .filter((team) => !isDeleted(team.id))
            .map((team) => (
              <TeamCard
                {...team}
                key={team.id}
                buttons={
                  <>
                    <BtnPrimary as={Link} to={`/team/edit/${team.id}`}>
                      Editar
                    </BtnPrimary>
                    <BtnDelete
                      onDelete={() => deleteTeam(team.id)}
                      confirmTitle="Confirmar eliminación"
                      confirmMessage="¿Estás seguro de que quieres eliminar este equipo?"
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

export default TeamAdmin;
