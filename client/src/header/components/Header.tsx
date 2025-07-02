import { useState, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Dropdown from '../../common/components/Dropdown';
import NavLinkItem from './NavLinkItem';
import { getMainMenuItems, getProfileDropdownItems } from '../utils/menuItems';
import TitleHeader from './TitleHeader';
import { useClickOutside } from '../../common/hooks/useClickOutside';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownContainerRef = useRef<HTMLDivElement>({} as HTMLDivElement);
    const items = getMainMenuItems('user');
    const profileDropdownItems = getProfileDropdownItems();

    useClickOutside(dropdownContainerRef, () => {
        setIsDropdownOpen(false);
    });

    return (
        <div className="Header flex flex-row justify-between items-center">
            <TitleHeader />
            <div className="flex flex-1 justify-evenly">
                {items.map((item, index) => (
                    <NavLinkItem key={index} to={item.route} name={item.name} />
                ))}
            </div>

            <div className="relative ml-8" ref={dropdownContainerRef}>
                <button
                    className="btn-menu font-medium text-white flex items-center gap-2"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <span>Usuario</span>
                    <FiChevronDown className="text-white" />
                </button>

                {isDropdownOpen && <Dropdown dropdownItems={profileDropdownItems} />}
            </div>
        </div>
    );
};

export default Header;
