import BtnPrimary from '../../common/components/button/BtnPrimary';
import BtnDelete from '../../common/components/button/BtnDelete';
import defaultImg from '../../assets/img/defaultImg.png';
import config from '../../config';
import type { Section } from '../entities';

interface SectionCardProps {
  section: Section;
  onEdit?: (section: Section) => void;
  onDelete?: (id: string) => void;
  showAdminActions?: boolean;
}

const SectionCard = ({
  section,
  onEdit,
  onDelete,
  showAdminActions = false,
}: SectionCardProps) => {
  const isCapacityFull = (section.bookingsCount || 0) >= section.capacity;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          className="w-full h-32 object-cover"
          src={
            section.imageUrl
              ? `${config.domain}${section.imageUrl}`
              : defaultImg
          }
          alt={`Sección ${section.number}`}
        />
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
            isCapacityFull ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {section.bookingsCount || 0}/{section.capacity}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Sección {section.number}
          </h3>
        </div>

        {section.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {section.description}
          </p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Instructor:</span>
            <span className="font-medium">
              {section.instructor || 'No asignado'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500">Capacidad:</span>
            <span
              className={`font-medium ${isCapacityFull ? 'text-red-600' : 'text-green-600'}`}
            >
              {section.bookingsCount || 0}/{section.capacity}
            </span>
          </div>
        </div>

        {showAdminActions && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
            <BtnPrimary
              onClick={() => onEdit?.(section)}
              className="!text-xs !py-1.5 !px-3 flex-1"
            >
              Editar
            </BtnPrimary>
            <BtnDelete
              onDelete={() => onDelete?.(section.id)}
              className="!text-xs !py-1.5 !px-3"
            >
              Eliminar
            </BtnDelete>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionCard;
