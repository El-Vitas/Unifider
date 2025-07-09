// NavDropdownItem.tsx
import { FiChevronDown } from "react-icons/fi";
import Dropdown from "../../common/components/Dropdown";
import { useRef, useState, useEffect } from "react"; // Importa useEffect
import BtnHeader from "./BtnHeader";
import { Link } from "react-router-dom";
import type{ BaseDropdownItem } from "../types";

type Props = {
  to: string;
  name: string;
  dropdownItems: BaseDropdownItem[]; 
};

const NavDropdownItem = ({ to, name, dropdownItems }: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownAnimatingOut, setIsDropdownAnimatingOut] = useState(false); // Nuevo estado para la animación de salida
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownAnimatingOut(false);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownAnimatingOut(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsDropdownOpen(false);
      setIsDropdownAnimatingOut(false);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative ml-8"
      ref={dropdownContainerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <BtnHeader
        as={Link}
        to={to}
        className="flex gap-2 items-center font-medium text-white transition-transform hover:scale-[1.04] active:scale-[0.96]"
      >
        <span>{name}</span>
        <FiChevronDown className="text-white" />
      </BtnHeader>
      
      {(isDropdownOpen || isDropdownAnimatingOut) && (
        <Dropdown
          dropdownItems={dropdownItems}
          isAnimatingOut={isDropdownAnimatingOut}
        />
      )}
    </div>
  );
};

export default NavDropdownItem;