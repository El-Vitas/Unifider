import { useState, useCallback } from 'react';

type AsyncState<T> = {
  loading: boolean;
  error: string | null;
  data: T | null;
};

export function useAsync<T>(asyncFn: () => Promise<T>, errorMessage?: string) {
  const [state, setState] = useState<AsyncState<T>>({
    loading: false,
    error: null,
    data: null,
  });

  const execute = useCallback(async () => {
    setState({ loading: true, error: null, data: null });
    try {
      const data = await asyncFn();
      setState({ loading: false, error: null, data });
    } catch (error) {
      console.error(error);
      console.debug('Error in useAsync:', error);
      setState({
        loading: false,
        error: errorMessage ?? 'Something went wrong. Please try again later.',
        data: null,
      });
    }
  }, [asyncFn, errorMessage]);

  return { ...state, execute };
}
