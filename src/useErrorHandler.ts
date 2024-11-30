import { useCallback } from 'react';

export const useErrorHandler = () => {
  return useCallback((error: unknown) => {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(String(error));
    }
  }, []);
};
