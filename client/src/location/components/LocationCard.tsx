import type { LocationType } from "../entities";
import BtnPrimary from "../../common/components/BtnPrimary";
import { Link } from "react-router-dom";
const LocationCard = ({ name, description }: LocationType) => {
  return (
        <div className="mb-4 transition-shadow duration-150 shadow-lg w-60 ring-1 ring-slate-700/30 rounded-2xl bg-slate-50 hover:shadow-xl">
          <div className="px-4 py-4 text-center">
            <span className="font-semibold text-gray-800">Nombre:</span>
            <p className="text-gray-600">{name}</p>
            <span className="font-semibold text-gray-800">Descripción:</span>
            <p className="text-gray-600">{description}</p>
          </div>
          <div className="flex justify-center gap-3 mb-2">
            <BtnPrimary
              as={Link}
              to={`/location/edit/${name}`}
            >
              Editar
            </BtnPrimary>
            <BtnPrimary
              as={Link}
              to={`/location/edit/${name}`}
            >
              Eliminar
            </BtnPrimary>
          </div>
        </div>
  );
}

export default LocationCard;