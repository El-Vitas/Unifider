import { useState, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Dropdown from '../../common/components/Dropdown';
import NavLinkItem from './NavLinkItem';
import { getMainMenuItems, getProfileDropdownItems } from '../utils/menuItems';
import TitleHeader from './TitleHeader';
import { useClickOutside } from '../../common/hooks/useClickOutside';
import { menuType } from '../constants';
import type { MainMenuItem, RoleType } from '../types';
import NavDropdownItem from './NavDropdownItem';
import { useAuth } from '../../common/hooks/useAuth';

const Header = () => {
  const auth = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const items = getMainMenuItems((auth.role ?? 'user') as RoleType);
  const profileDropdownItems = getProfileDropdownItems();

  useClickOutside(dropdownContainerRef, () => {
    setIsDropdownOpen(false);
  });

  return (
    <div className="flex flex-row items-center justify-between p-4 text-center bg-primary">
      <TitleHeader />
      <div className="flex flex-1 justify-evenly">
        {items.map((item: MainMenuItem) =>
          item.type === menuType.Dropdown ? (
            <NavDropdownItem
              to={item.route}
              name={item.name}
              dropdownItems={item.dropdownItems}
              key={item.name}
            />
          ) : (
            <NavLinkItem key={item.name} to={item.route} name={item.name} />
          ),
        )}
      </div>

      <div className="relative ml-8" ref={dropdownContainerRef}>
        <button
          className="flex items-center gap-2 font-medium text-white transition-transform hover:scale-[1.04] active:scale-[0.96]"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span>Usuario</span>
          <FiChevronDown className="text-white" />
        </button>

        {isDropdownOpen && (
          <Dropdown dropdownItems={profileDropdownItems} alignRight={true} />
        )}
      </div>
    </div>
  );
};

export default Header;
