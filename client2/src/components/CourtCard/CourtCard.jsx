import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import defaultImg from '../../assets/img/defaultImg.png';

const CourtCard = ({
  name,
  description,
  location,
  imageUrl,
  scheduleByDay,
}) => {
  return (
    <div className="flex items-center border rounded-2xl overflow-hidden shadow-lg w-full max-w-5xl bg-white hover:shadow-xl transition-shadow p-4 mt-4 mb-4">
      <div className="flex-1 pr-6 text-sm space-y-4">
        <h2 className="font-semibold text-xl mb-2">{name}</h2>

        <p>
          <span className="font-medium">Descripción:</span> {description}
        </p>

        {scheduleByDay && Object.keys(scheduleByDay).length > 0 && (
          <div>
            <p className="font-medium mb-1">Horarios:</p>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(scheduleByDay).map(([day, hours]) => (
                <li key={day}>
                  <span className="font-semibold">{day}:</span>{' '}
                  {hours.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p>
            <span className="font-medium">Ubicación:</span> {location.name}
          </p>
          <p>
            <span className="font-medium">Descripción:</span>{' '}
            {location.description}
          </p>
        </div>

        <div className="pt-4">
          <Link
            className="btn-card inline-flex items-center gap-1"
            to={`${name}`}
          >
            Horarios <RightOutlined />
          </Link>
        </div>
      </div>

      <div className="flex-shrink-0 w-2/3 max-w-[250px] aspect-square rounded-2xl overflow-hidden ml-4">
        <img
          className="w-full h-full object-cover object-center"
          src={imageUrl ?? defaultImg}
          alt={`Imagen de ${name}`}
        />
      </div>
    </div>
  );
};

CourtCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  location: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  imageUrl: PropTypes.string,
  scheduleByDay: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
};

export default CourtCard;
