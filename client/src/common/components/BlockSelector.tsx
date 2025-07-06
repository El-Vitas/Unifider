import { useState } from 'react';
import { toast } from 'react-toastify';
import { getWeekDaysName } from '../services/weekDayService';

import 'react-toastify/dist/ReactToastify.css';

const BlockSelector = () => {
  const days = getWeekDaysName();
  const times = [
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];
  const [availability, setAvailability] = useState([
    [false, true, false, true, true, true, false], // 10:00
    [true, true, false, true, true, true, true], // 11:00
    [true, true, true, true, false, true, true], // 12:00
    [true, true, true, true, true, true, true], // 13:00
    [true, true, false, true, true, true, true], // 14:00
    [true, true, true, false, true, true, true], // 15:00
    [true, true, false, true, true, false, true], // 16:00
    [false, true, false, false, true, false, true], // 17:00
  ]);

  const [selectedSlots, setSelectedSlots] = useState([] as string[]);

  const handleSlotClick = (dayIndex: number, timeIndex: number) => {
    const slot = `${dayIndex}-${timeIndex}`;
    setSelectedSlots((prevSelected) =>
      prevSelected.includes(slot)
        ? prevSelected.filter((s) => s !== slot)
        : [...prevSelected, slot],
    );
  };

  const handleReserve = () => {
    if (selectedSlots.length === 0) return;
    const newAvailability = [...availability];

    selectedSlots.forEach((slot) => {
      const [dayIndex, timeIndex] = slot.split('-').map(Number);
      newAvailability[dayIndex][timeIndex] = false;
    });

    setAvailability(newAvailability);
    setSelectedSlots([]);
    toast('Reserva Realizada!');
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="flex flex-col space-y-1">
        <div className="flex">
          <div className="w-24"></div>
          {days.map((day, index) => (
            <div key={index} className="w-24 text-center font-semibold">
              {day}
            </div>
          ))}
        </div>

        {times.map((time, timeIndex) => (
          <div key={timeIndex} className="flex items-center">
            <div className="w-24 p-2 text-center bg-white border border-black rounded-lg font-medium">
              {time}
            </div>

            {availability[timeIndex].map((isAvailable, dayIndex) => (
              <div
                key={dayIndex}
                className={`w-20 h-10 m-2 border-2 rounded-md flex justify-center items-center cursor-pointer ${
                  isAvailable
                    ? selectedSlots.includes(`${timeIndex}-${dayIndex}`)
                      ? 'bg-yellow-400' // Selected
                      : 'bg-green-300' // Available
                    : 'bg-red-300 cursor-not-allowed'
                }`}
                onClick={() =>
                  isAvailable && handleSlotClick(timeIndex, dayIndex)
                }
              ></div>
            ))}
          </div>
        ))}
      </div>
      <button
        className={`mt-4 px-6 py-3 text-white rounded-md font-bold focus:outline-none ${
          selectedSlots.length !== 0
            ? 'cursor-pointer bg-[#005E90] transition-colors duration-300 transform hover:bg-[#004070] hover:scale-[1.03]'
            : 'cursor-not-allowed bg-gray-300'
        }`}
        onClick={handleReserve}
        disabled={selectedSlots.length === 0}
      >
        Reservar
      </button>
    </div>
  );
};

export default BlockSelector;
