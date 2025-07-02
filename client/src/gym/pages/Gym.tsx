import { useMemo, useState } from 'react';
import GymCard from '../components/GymCard';
import type { GymType } from '../entities';

const Gym = () => {
    const [gyms, setGyms] = useState<GymType[]>([]);
    useMemo(() => {
        setGyms([
            {
                id: '1',
                name: 'Gym A',
                description: 'A great place to work out.',
                location: '123 Fitness St.',
                imageUrl: 'https://example.com/gym-a.jpg',
            },
            {
                id: '2',
                name: 'Gym B',
                description: 'The best gym in town.',
                location: '456 Workout Ave.',
                imageUrl: 'https://example.com/gym-b.jpg',
            },
            {
                id: '3',
                name: 'Gym C',
                description: 'Your fitness journey starts here.',
                location: '789 Health Blvd.',
                imageUrl: 'https://example.com/gym-c.jpg',
            },
        ]);
    }, []);

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
