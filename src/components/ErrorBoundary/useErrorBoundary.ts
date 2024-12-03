import { useCallback, useState } from 'react';

interface CustomError extends Error {
  componentName: string; // Dónde ocurrió (e.g., 'LoginForm')
  errorCode?: string;    // Código único para identificar el tipo de error
  context?: Record<string, any>; // Información contextual relevante
}

interface UseErrorBoundaryReturn {
  error: Error | null;
  createError: (message: string,
    componentName: string,
    context?: Record<string, any>,
    errorCode?: string) => Error;
  throwError: (error: Error) => void;
}

const useErrorBoundary = (): UseErrorBoundaryReturn => {
  const [error, setError] = useState<Error | null>(null);

  const throwError = useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);

  const createError = (
    message: string,
    componentName: string,
    context?: Record<string, any>,
    errorCode?: string ): CustomError => {
      const error: CustomError = new Error(message) as CustomError;
      error.componentName = componentName;
      error.context = context;
      error.errorCode = errorCode;
      return error;
  }

  return { error, createError, throwError };
};

export default useErrorBoundary;
