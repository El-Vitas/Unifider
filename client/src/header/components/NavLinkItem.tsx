import { Link } from 'react-router-dom';
import BtnHeader from './BtnHeader';
type Props = {
  to: string;
  name: string;
};

const NavLinkItem = ({ to, name }: Props) => {
  return (
    <BtnHeader as={Link} to={to}>
      {name}
    </BtnHeader>
  );
};

export default NavLinkItem;
