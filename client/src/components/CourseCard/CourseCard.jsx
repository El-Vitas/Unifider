import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CourseCard = ({ name, image, numCourses, weekdays }) => {
  return (
    <div className="card w-64 border rounded-2xl">
      <div>
        <img
          className="rounded-t-2xl w-64 h-40 object-cover"
          src={image}
          alt=""
        />
      </div>
      <div className="px-4 py-4">
        <h2 className="font-medium text-lg">
          {String(name).charAt(0).toUpperCase() + String(name).slice(1)}
        </h2>
        <ul>
          <li>
            {numCourses} {numCourses > 1 ? 'Paralelos' : 'Paralelo'}
          </li>
          <li>{weekdays}</li>
        </ul>
        <div className="pt-4">
          <Link className="btn-card" to={`${name}`}>
            Paralelos
            <RightOutlined />
          </Link>
        </div>
      </div>
    </div>
  );
};
CourseCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  numCourses: PropTypes.number.isRequired,
  weekdays: PropTypes.string.isRequired,
};

export default CourseCard;
