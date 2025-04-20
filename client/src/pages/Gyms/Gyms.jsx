import { useEffect, useState } from 'react';
import axios from 'axios';
import GymCard from '../../components/GymCard/GymCard';
import { useAuth } from '../../hooks/useAuth';
import config from '../../config';

const Gym = () => {
  const [gyms, setGyms] = useState([]);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/v1/gym/cards-info`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log('Fetched gyms:', response.data);

        if (response.status !== 200) {
          throw new Error('Failed to fetch gyms');
        }
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid data format');
        }
        setGyms(response.data);
      } catch (error) {
        console.error('Error fetching gyms:', error);
      }
    };

    fetchGyms();
  }, [authToken]);

  return (
    <div className="container-cards px-4 mt-6">
      <div className="flex flex-wrap gap-6 justify-center">
        {gyms.map((gym) => (
          <GymCard key={gym.id} {...gym} />
        ))}
      </div>
    </div>
  );
};

export default Gym;
