import { Link } from 'react-router-dom';

type Props = {
    to: string;
    name: string;
};

const NavLinkItem = ({ to, name }: Props) => {
    return (
        <Link
            to={to}
            className="btn-header font-medium text-white"
        >
            {name}
        </Link>
    );
}

export default NavLinkItem;