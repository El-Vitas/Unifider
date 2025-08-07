import type { ReactNode } from 'react';

interface BookingContentAreaProps {
  children: ReactNode;
}

export const BookingContentArea = ({ children }: BookingContentAreaProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{children}</div>
  );
};
