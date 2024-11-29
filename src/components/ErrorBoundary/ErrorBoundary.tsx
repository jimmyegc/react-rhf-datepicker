import React, { ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface CustomError extends Error {
  componentName: string; // Dónde ocurrió (e.g., 'LoginForm')
  errorCode?: string;    // Código único para identificar el tipo de error
  context?: Record<string, any>; // Información contextual relevante
}

function createError(
  message: string,
  componentName: string,
  context?: Record<string, any>,
  errorCode?: string
): CustomError {
  const error: CustomError = new Error(message) as CustomError;
  error.componentName = componentName;
  error.context = context;
  error.errorCode = errorCode;
  return error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary atrapó un error:', error, errorInfo);
  
    // Estructura para reportar errores al sistema de monitoreo
    const report = {
      message: error.message,
      componentName: (error as CustomError).componentName || 'Desconocido',
      stack: error.stack || 'Sin stack',
      errorCode: (error as CustomError).errorCode || 'UNHANDLED_ERROR',
      context: (error as CustomError).context || {},
      componentStack: errorInfo.componentStack, // Detalles específicos de React
      timestamp: new Date().toISOString(),
    };
  
    // Aquí puedes enviar el error a Bugsnag, Sentry, etc.
    if (this.props.onError) {
      this.props.onError(report, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <img
              src="https://via.placeholder.com/150"
              alt="Error"
              className="error-image"
            />
            <h1>¡Ups! Algo salió mal</h1>
            <p>
              Parece que ocurrió un problema inesperado. Por favor, intenta
              nuevamente.
            </p>
            {this.state.error && (
              <details className="error-details">
                <summary>Detalles del error</summary>
                <p>{this.state.error.message}</p>
              </details>
            )}
            <button onClick={this.resetError} className="error-button">
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
