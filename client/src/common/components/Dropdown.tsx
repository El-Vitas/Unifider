import { Link } from 'react-router-dom';

type DropdownItem = {
    to: string;
    name: string;
    icon?: React.ReactElement;
};

const Dropdown = ({ dropdownItems }: { dropdownItems: DropdownItem[] }) => {
    return (
        <div className="absolute right-0 mt-2 w-48 bg-[#0d73ab] text-white border border-white/20 rounded shadow-md z-50">
            {dropdownItems.map((item) => (
                <Link key={item.name} to={item.to} className="flex px-4 py-2 hover:bg-[#0b669a] transition justify-start items-center gap-2">
                    {item.icon}
                    {item.name}
                </Link>
            ))}
        </div>
    );
};

export default Dropdown;