import type { LocationType } from '../entities';

type LocationCardProps = LocationType & {
  buttons?: React.ReactNode;
};

const LocationCard = ({ name, description, buttons }: LocationCardProps) => {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-300 w-72 mb-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-700 text-center">{name}</h3>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {buttons && (
          <div className="flex gap-2 pt-4 border-t border-gray-100 justify-center">
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationCard;
