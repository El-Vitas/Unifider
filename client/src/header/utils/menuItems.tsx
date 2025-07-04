import React from 'react';
import { GrLogout } from 'react-icons/gr';
import { FaUserCircle } from 'react-icons/fa';

type RoleType = 'admin' | 'user';

type MainMenuItem = {
  name: string;
  route: string;
};

type ProfileDropdownItem = {
  to: string;
  name: string;
  icon?: React.ReactElement;
};

export const getMainMenuItems = (role: RoleType): MainMenuItem[] => {
  const routes = {
    workshops: '/workshops',
    teams: '/selecciones',
    gyms: '/gyms',
    courts: '/courts',
  };

  return [
    {
      name: role === 'admin' ? 'Crear Taller' : 'Talleres',
      route: routes.workshops,
    },
    {
      name: role === 'admin' ? 'Crear Selección' : 'Selecciones',
      route: routes.teams,
    },
    {
      name: role === 'admin' ? 'Crear Gimnasio' : 'Gimnasio',
      route: routes.gyms,
    },
    {
      name: role === 'admin' ? 'Crear Cancha' : 'Canchas',
      route: routes.courts,
    },
  ];
};

export const getProfileDropdownItems = (): ProfileDropdownItem[] => {
  const routes = {
    profile: '/profile',
    logout: '/logout',
  };

  return [
    {
      to: routes.profile,
      name: 'Perfil',
      icon: <FaUserCircle className="text-white" />,
    },
    {
      to: routes.logout,
      name: 'Cerrar Sesión',
      icon: <GrLogout className="text-white" />,
    },
  ];
};
