import { useCallback } from 'react';
//import Bugsnag from '@bugsnag/js';

export const useErrorHandler = () => {
  const createError = useCallback((error: Error, context?: Record<string, any>) => {
    console.error('Error generado:', { error, context });

    // Reportar a Bugsnag
    /*Bugsnag.notify(error, (event) => {
      if (context) {
        event.addMetadata('context', context);
      }
    }); */
  }, []);

  return { createError };
};
