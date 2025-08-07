import { Link } from 'react-router-dom';

const TitleHeader = () => {
  return (
    <div className="text-white">
      <h1 className="pl-4 text-2xl font-bold ">
        <Link
          className="inline-block transition-transform hover:scale-[1.04] active:scale-[0.96]"
          to="/"
        >
          UNIFIDER
        </Link>
      </h1>
    </div>
  );
};

export default TitleHeader;
