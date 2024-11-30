import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetErrorBoundary: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught an error:", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError && error) {
      return fallback ? fallback(error, this.resetErrorBoundary) : <div>Something went wrong!</div>;
    }

    return children;
  }
}

export default ErrorBoundary;
