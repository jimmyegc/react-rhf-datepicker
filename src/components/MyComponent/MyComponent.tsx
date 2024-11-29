import useErrorBoundary from "../ErrorBoundary/useErrorBoundary";

export const MyComponent = () => {
  const { throwError, createError } = useErrorBoundary();

  const handleClick = () => {
    try {
      throw new Error('Error simulado para pruebas');
    } catch (e) {
      //throwError(error as Error);
      const error = createError(
        'Fallo al cargar los datos del usuario',
        'UserProfile',
        { userId: 123 },
        'USER_FETCH_ERROR'
      );
      throwError(error);
    }
  };

  return (
    <div>
      <h1>Mi Componente</h1>
      <button onClick={handleClick}>Lanzar Error</button>
    </div>
  );
}