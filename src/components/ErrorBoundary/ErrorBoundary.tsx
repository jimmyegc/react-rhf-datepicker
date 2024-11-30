import React, { ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetErrorBoundary: () => void) => ReactNode;
  //onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary atrapó un error:', error, errorInfo);
    /*        
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
    */
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError && error) {
      return fallback ? fallback(error, this.resetError) : <div>Something went wrong!</div>;
    }

    return children;
  }
}

export default ErrorBoundary;
