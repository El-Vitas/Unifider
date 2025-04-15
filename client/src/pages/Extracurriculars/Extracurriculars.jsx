import { useEffect, useState } from 'react';
import axios from 'axios';
import CourseCard from '../../components/CourseCard/CourseCard';
import config from '../../config';
import { useAuth } from '../../hooks/useAuth';
import defaultImg from '../../assets/img/defaultImg.png';

const Extracurriculars = () => {
  const [extracurriculars, setExtracurriculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useAuth();
  useEffect(() => {
    const fetchExtracurriculars = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/v1/workshop/detailed`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        setExtracurriculars(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExtracurriculars();
  }, [authToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container-cards px-4 mt-6 flex flex-row space-x-12">
      {extracurriculars.map((extracurricular) => {
        const name = extracurricular.name;
        const image = extracurricular.imageUrl ?? defaultImg;
        const description = extracurricular.description ?? '';
        const numberOfCourses = extracurricular.sectionsCount;

        return (
          <CourseCard
            key={name}
            props={{
              name,
              image,
              description,
              numCourses: numberOfCourses,
            }}
          />
        );
      })}
    </div>
  );
};

export default Extracurriculars;
