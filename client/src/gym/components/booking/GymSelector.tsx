import type { GymType } from '../../entities';

interface GymSelectorProps {
  gyms: GymType[];
  selectedGymId: string | null;
  onSelectGym: (gymId: string) => void;
  isLoading?: boolean;
}

export const GymSelector = ({
  gyms,
  selectedGymId,
  onSelectGym,
  isLoading = false,
}: GymSelectorProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Selecciona un Gimnasio
      </label>
      <select
        value={selectedGymId || ''}
        onChange={(e) => onSelectGym(e.target.value)}
        disabled={isLoading}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005E90] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Elige un gimnasio</option>
        {gyms.map((gym) => (
          <option key={gym.id} value={gym.id}>
            {gym.name}
          </option>
        ))}
      </select>
      {isLoading && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#005E90] mr-2"></div>
          Cargando gimnasios...
        </div>
      )}
    </div>
  );
};
