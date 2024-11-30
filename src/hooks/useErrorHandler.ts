import { useCallback, useState } from 'react';

// Extensión del objeto Error para incluir información personalizada
interface CustomError extends Error {
  componentName: string; // Dónde ocurrió (e.g., 'LoginForm')
  errorCode?: string;    // Código único para identificar el tipo de error
  context?: Record<string, any>; // Información contextual relevante
}

// Retorno del hook
interface UseErrorHandlerReturn {
  error: CustomError | null; // Último error registrado
  createError: (
    message: string,
    componentName: string,
    context?: Record<string, any>,
    errorCode?: string
  ) => CustomError; // Crea un error personalizado
  throwError: (error: Error) => void; // Lanza un error hacia el ErrorBoundary
}

// Hook para manejar errores
const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<CustomError | null>(null);

  // Lanza el error hacia un ErrorBoundary
  const throwError = useCallback((error: Error) => {
    setError(() => {
      throw error; // Capturado automáticamente por el ErrorBoundary
    });
  }, []);

  // Crea un error personalizado con información adicional
  const createError = useCallback(
    (
      message: string,
      componentName: string,
      context?: Record<string, any>,
      errorCode?: string
    ): CustomError => {
      const error: CustomError = new Error(message) as CustomError;
      error.componentName = componentName;
      error.context = context;
      error.errorCode = errorCode;
      return error;
    },
    []
  );

  return { error, createError, throwError };
};

export default useErrorHandler;
