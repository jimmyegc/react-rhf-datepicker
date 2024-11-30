import useErrorHandler from "../../hooks/useErrorHandler";

export const MyComponent = () => {
  const { createError, throwError } = useErrorHandler();

  const handleClick = () => {
    const error = createError(
      'Failed to load user data',
      'UserProfile',
      { userId: 123 },
      'USER_LOAD_ERROR'
    );
    throwError(error);
  };

  return (
    <div>
      <h1>Mi Componente</h1>
      <button onClick={handleClick}>Lanzar Error</button>
    </div>
  );
}