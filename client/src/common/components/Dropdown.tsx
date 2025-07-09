import { Link } from 'react-router-dom';

type DropdownItem = {
  to: string;
  name: string;
  icon?: React.ReactElement;
};

type DropdownProps = {
  dropdownItems: DropdownItem[];
  isAnimatingOut?: boolean;
  alignRight?: boolean;
};

const Dropdown = ({ dropdownItems, isAnimatingOut, alignRight }: DropdownProps) => {
  return (
    <div
      className={`
        absolute mt-2 w-40 bg-slate-100 text-gray-700 ring-1 ring-primary/10 rounded shadow-md z-50
        transition-opacity duration-200 ease-out
        ${isAnimatingOut ? 'opacity-0' : 'opacity-100'}

        ${alignRight
          ? 'right-0 transform-none' 
          : 'left-1/2 -translate-x-1/2'
        }
      `}
    >
      {dropdownItems.map((item) => (
        <Link
          key={item.name}
          to={item.to}
          className="flex items-center justify-start gap-2 px-4 py-2 transition rounded hover:bg-slate-200"
        >
          {item.icon}
          {item.name}
        </Link>
      ))}
    </div>
  );
};
export default Dropdown;

// import { Link } from 'react-router-dom';

// type DropdownItem = {
//   to: string;
//   name: string;
//   icon?: React.ReactElement;
// };

// const Dropdown = ({ dropdownItems }: { dropdownItems: DropdownItem[] }) => {
//   return (
//     <div className="absolute right-0 mt-2 w-48 bg-[#0d73ab] text-white border border-white/20 rounded shadow-md z-50">
//       {dropdownItems.map((item) => (
//         <Link
//           key={item.name}
//           to={item.to}
//           className="flex px-4 py-2 hover:bg-[#0b669a] transition justify-start items-center gap-2"
//         >
//           {item.icon}
//           {item.name}
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default Dropdown;
