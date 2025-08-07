import type { EquipmentType } from '../entities';
import defaultImg from '../../assets/img/defaultImg.png';

type EquipmentCardProps = EquipmentType & {
  buttons?: React.ReactNode;
};

const EquipmentCard = ({
  name,
  description,
  imageUrl,
  buttons,
}: EquipmentCardProps) => {
  return (
    <div className="group bg-white rounded-xl mb-6 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 w-72">
      <div className="relative overflow-hidden">
        <img
          src={imageUrl ?? defaultImg}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-700 mb-2 line-clamp-1">
            {name}
          </h3>
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

export default EquipmentCard;
