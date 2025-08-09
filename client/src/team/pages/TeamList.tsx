import { useEffect, useCallback, useMemo } from 'react';
import TeamCard from '../components/TeamCard';
import type { Team } from '../entities';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { useAsync } from '../../common/hooks/useAsync';
import config from '../../config';
import { customToast } from '../../common/utils/customToast';
import ContainerCards from '../../common/components/ContainerCards';
import type { CustomHttpResponse } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';

const TeamList = () => {
  const url = useMemo(() => `${config.apiUrl}/team`, []);
  const authToken = useAuth().authToken;

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
    'Failed to fetch teams',
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
        <div className="flex flex-wrap justify-center gap-6">
          {teams.map((team) => (
            <TeamCard
              {...team}
              key={team.id}
              // Sin botones para usuarios normales
            />
          ))}
        </div>
      </>
    </ContainerCards>
  );
};

export default TeamList;
