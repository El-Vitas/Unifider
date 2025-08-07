import { GrLogout } from 'react-icons/gr';
import { FaUserCircle } from 'react-icons/fa';
import { menuType } from '../constants';
import type { MainMenuItem, ProfileDropdownItem } from '../types';
import type { RoleType } from '../types';

export const getMainMenuItems = (role: RoleType): MainMenuItem[] => {
  if (role === 'admin') {
    return getAdminMenuItems();
  }
  return getUserMenuItems();
};

const getUserMenuItems = (): MainMenuItem[] => {
  const routes = {
    workshops: '/workshop',
    teams: '/team',
    gyms: '/gym',
    courts: '/court',
  };

  return [
    {
      name: 'Talleres',
      route: routes.workshops,
    },
    {
      name: 'Selecciones',
      route: routes.teams,
    },
    {
      name: 'Gimnasios',
      route: routes.gyms,
    },
    {
      name: 'Canchas',
      route: routes.courts,
    },
  ];
};

const getAdminMenuItems = (): MainMenuItem[] => {
  const routes = {
    workshops: '/workshop',
    teams: '/team',
    gyms: '/gym',
    courts: '/court',
    equipment: '/gym/equipment',
  };

  return [
    {
      name: 'Talleres',
      route: routes.workshops,
    },
    {
      name: 'Selecciones',
      route: routes.teams,
    },
    {
      name: 'Gimnasios',
      route: routes.gyms,
      type: menuType.Dropdown,
      dropdownItems: [
        {
          to: routes.equipment,
          name: 'Equipamiento',
        },
      ],
    },
    {
      name: 'Canchas',
      route: routes.courts,
    },
    {
      name: 'Ubicaciones',
      route: '/location',
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
      icon: <FaUserCircle className="text-gray-700" />,
    },
    {
      to: routes.logout,
      name: 'Cerrar Sesión',
      icon: <GrLogout className="text-gray-700" />,
    },
  ];
};
