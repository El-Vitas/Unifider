import { RightOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const BreadCrumbs = () => {
  const location = useLocation();
  const crumbs = location.pathname
    .split('/')
    .slice(1, location.pathname.length);
  return (
    <div className="text-sm px-4 font-medium">
      {crumbs.map((crumb, index) => {
        const decodedCrumb = decodeURI(crumb);
        return (
          <span key={crumb}>
            {index !== crumbs.length - 1 ? (
              <Link to={`/${decodedCrumb}`}>
                {' '}
                {decodedCrumb.charAt(0).toUpperCase() +
                  decodedCrumb.slice(1)}{' '}
              </Link>
            ) : (
              <span>
                {decodedCrumb.charAt(0).toUpperCase() + decodedCrumb.slice(1)}
              </span>
            )}
            {index !== crumbs.length - 1 && (
              <span>
                {' '}
                <RightOutlined />{' '}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default BreadCrumbs;
