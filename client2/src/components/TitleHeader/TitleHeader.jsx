import { Link } from 'react-router-dom';

const TitleHeader = () => {
  return (
    <div className="TitleHeader">
      <h1 className="pl-4 text-2xl font-bold">
        <Link className="btn-header" to="/">
          UNIFIDER
        </Link>
      </h1>
    </div>
  );
};

export default TitleHeader;
