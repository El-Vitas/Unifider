import { useEffect, useCallback } from 'react';

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  const handleClickOrTouchOutside = useCallback((event: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  }, [ref, callback]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOrTouchOutside);
    document.addEventListener('touchstart', handleClickOrTouchOutside); 
    return () => {
      document.removeEventListener('mousedown', handleClickOrTouchOutside);
      document.removeEventListener('touchstart', handleClickOrTouchOutside);
    };
  }, [handleClickOrTouchOutside]);
}