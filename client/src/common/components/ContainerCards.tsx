import type { JSX } from 'react';

const ContainerCards = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="px-4 m-2 mt-4 bg-white rounded-lg shadow">
      <div className="flex flex-wrap gap-6 justify-between">{children}</div>
    </div>
  );
};

export default ContainerCards;
