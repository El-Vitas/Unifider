import React, { useState, useCallback } from 'react';
import MainForm from '../../common/components/MainForm';
import TeamForm from '../components/TeamForm';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { customToast } from '../../common/utils/customToast';
import config from '../../config';
import type { Team } from '../entities';
import { useAuth } from '../../common/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const TeamCreate = () => {
  const [formData, setFormData] = useState<{
    name: string;
    instructor: string;
    contact: string;
    imageUrl: string;
  }>({ name: '', instructor: '', contact: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const redirectUrl = '/team/';
  const authToken = useAuth().authToken;

  const handleFormChange = useCallback(
    (data: {
      name: string;
      instructor: string;
      contact: string;
      imageUrl: string;
    }) => {
      setFormData(data);
    },
    [],
  );

  const handleFileChange = useCallback((file: File | null) => {
    setImageFile(file);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const teamData: Omit<Team, 'id'> = {
        name: formData.name.trim(),
        instructor: formData.instructor.trim() || undefined,
        contact: formData.contact.trim() || undefined,
        imageUrl: undefined, // Will be set by image upload if file exists
      };

      const createTeamResponse = await httpAdapter.post<Team>(
        `${config.apiUrl}/team/create`,
        teamData,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const createdTeam = createTeamResponse.data;

      if (imageFile && createdTeam.id) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        await httpAdapter.post(
          `${config.apiUrl}/team/${createdTeam.id}/image`,
          imageFormData,
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      customToast.success('Equipo creado correctamente');
      navigate(redirectUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        customToast.error(`Error al crear el equipo: ${err.message}`);
      } else {
        customToast.error('Error al crear el equipo: Error desconocido');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = submitting;

  return (
    <MainForm onSubmit={onSubmit} submitButtonText="Crear Equipo">
      <TeamForm
        initialData={null}
        isLoading={isLoading}
        onFormChange={handleFormChange}
        onFileChange={handleFileChange}
      />
    </MainForm>
  );
};

export default TeamCreate;
