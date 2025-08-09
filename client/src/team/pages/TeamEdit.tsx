import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MainForm from '../../common/components/MainForm';
import TeamForm from '../components/TeamForm';
import { useParams, useNavigate } from 'react-router-dom';
import { useAsync } from '../../common/hooks/useAsync';
import config from '../../config';
import { customToast } from '../../common/utils/customToast';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import type { Team } from '../entities';
import type { CustomHttpResponse } from '../../common/types';
import { useAuth } from '../../common/hooks/useAuth';

const TeamEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Team>({
    id: '',
    name: '',
    instructor: '',
    contact: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const redirectUrl = '/team/';
  const urlTeam = useMemo(() => `${config.apiUrl}/team/${id}`, [id]);
  const authToken = useAuth().authToken;

  const fetchTeamFn = useCallback(
    () =>
      httpAdapter.get<Team>(urlTeam, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [urlTeam, authToken],
  );

  const updateTeamFn = useCallback(
    (data: Team) =>
      httpAdapter.patch<Team>(`${config.apiUrl}/team/${id}`, data, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [authToken, id],
  );

  const {
    data: initialTeamData,
    loading: fetchLoading,
    error: fetchError,
    execute: fetchTeam,
  } = useAsync<CustomHttpResponse<Team>>(fetchTeamFn, 'Failed to fetch Team');

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  useEffect(() => {
    if (initialTeamData?.data) {
      setFormData(initialTeamData.data);
    }
  }, [initialTeamData]);

  const handleFormChange = useCallback(
    (data: {
      name: string;
      instructor: string;
      contact: string;
      imageUrl: string;
    }) => {
      setFormData((prev) => ({ ...prev, ...data }));
    },
    [],
  );

  const handleFileChange = useCallback((file: File | null) => {
    setImageFile(file);
  }, []);

  useEffect(() => {
    if (fetchError) {
      customToast.error(fetchError);
    }
  }, [fetchError]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const updatedTeam: Team = {
        ...formData,
        name: formData.name,
        instructor: formData.instructor,
        contact: formData.contact,
        imageUrl: formData.imageUrl,
      };

      await updateTeamFn(updatedTeam);

      if (imageFile && formData.id) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        await httpAdapter.post(
          `${config.apiUrl}/team/${formData.id}/image`,
          imageFormData,
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      customToast.success('Equipo actualizado correctamente');
      navigate(redirectUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        customToast.error(
          `Error al actualizar el equipo: ${err?.message ?? 'Error desconocido'}`,
        );
      } else {
        customToast.error('Error al actualizar el equipo: Error desconocido');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = fetchLoading || submitting;

  return (
    <MainForm onSubmit={onSubmit} submitButtonText="Actualizar Equipo">
      <TeamForm
        initialData={formData}
        isLoading={isLoading}
        onFormChange={handleFormChange}
        onFileChange={handleFileChange}
      />
    </MainForm>
  );
};

export default TeamEdit;
