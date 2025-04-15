import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseBigCard = ({ props }) => {
  const { time, instructor, courseCode, weekDay, courtImage, courtName } =
    props;
  const [enrolled, setEnrolled] = useState(false);
  const handleEnroll = () => {
    if (!enrolled) {
      // Only trigger the toast if not enrolled yet
      setEnrolled(true);
      toast('Inscripción realizada!');
    }
  };

  return (
    <>
      <div className="columns-2 overflow-hidden">
        <div className="border  bg-white p-4 h-64 rounded-2xl">
          <ul className="space-y-4">
            <li>
              <span className="font-medium">Paralelo:</span> {courseCode}
            </li>
            <li>
              <span className="font-medium">Profesor:</span> {instructor}
            </li>
            <li>
              <span className="font-medium">Horario:</span> {weekDay} {time}
            </li>
            <li>
              <span className="font-medium">Lugar:</span> {courtName}
            </li>
          </ul>
          <div className="mt-8">
            <button
              // className='hover:bg-sky-300 border rounded-xl px-6 py-2'
              className={enrolled ? 'btn-disabled' : 'btn-card'}
              onClick={handleEnroll}
              disabled={enrolled}
            >
              {enrolled ? 'Inscrito' : 'Inscribirse'}
            </button>
          </div>
        </div>
        <div className="">
          <img className="w-96 h-64 rounded-2xl" src={courtImage} alt="" />
        </div>
      </div>
    </>
  );
};

export default CourseBigCard;
