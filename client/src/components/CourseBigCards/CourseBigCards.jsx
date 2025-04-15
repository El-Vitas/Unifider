import CourseBigCard from '../CourseBigCard/CourseBigCard';
import extracurriculars from '../../data/extracurriculars.json';
import { useParams } from 'react-router-dom';

const CourseBigCards = () => {
  const { extracurricularName } = useParams();

  const courses = extracurriculars.find(
    (extracurricular) => extracurricular.name === extracurricularName,
  ).courses;
  return (
    <div className="space-y-10 mt-6 px-4">
      {courses.map((course) => (
        <CourseBigCard key={course.courseCode} props={course} />
      ))}
    </div>
  );
};

export default CourseBigCards;
