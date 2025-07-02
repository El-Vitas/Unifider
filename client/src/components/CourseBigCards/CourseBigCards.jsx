import CourseBigCard from '../CourseBigCard/CourseBigCard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import config from '../../config';

const CourseBigCards = () => {
  const [sections, setSections] = useState([]);
  const [extracurricular, setExtracurricular] = useState(null);
  const [error, setError] = useState(null);

  const { extracurricularName } = useParams();
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchExtracurricular = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/v1/workshop/${extracurricularName}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        setExtracurricular(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchExtracurricular();
  }, [authToken, extracurricularName]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const extracurricularId = extracurricular.id;
        const response = await axios.get(
          `${config.apiUrl}/v1/section/card-info/${extracurricularId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        setSections(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (extracurricular?.id) {
      fetchSections();
    }
  }, [authToken, extracurricular]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-10 mt-6 px-4">
      {sections.map((section) => (
        <CourseBigCard key={section.number} {...section} />
      ))}
    </div>
  );
};

export default CourseBigCards;
