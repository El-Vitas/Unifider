import { useEffect, useState } from 'react';
import axios from 'axios';
import CourtCard from '../../components/CourtCard/CourtCard';
import { useAuth } from '../../hooks/useAuth';
import config from '../../config';

const Courts = () => {
  const [courts, setCourts] = useState([]);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/v1/court/cards-info`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log('Fetched courts:', response.data);

        if (response.status !== 200) {
          throw new Error('Failed to fetch courts');
        }
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid data format');
        }
        setCourts(response.data);
      } catch (error) {
        console.error('Error fetching courts:', error);
      }
    };

    fetchCourts();
  }, [authToken]);

  return (
    <div className="container-cards px-4 mt-6">
      <div className="flex flex-wrap gap-6 justify-center">
        {courts.map((court) => (
          <CourtCard key={court.id} {...court} />
        ))}
      </div>
    </div>
  );
};

export default Courts;
