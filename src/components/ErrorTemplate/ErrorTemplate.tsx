import React from 'react';

interface ErrorTemplateProps {
  error: Error;
  onRetry: () => void;
}

const ErrorTemplate: React.FC<ErrorTemplateProps> = ({ error, onRetry }) => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <img
        src="https://via.placeholder.com/200x150.png?text=Error"
        alt="Error Illustration"
        style={{ marginBottom: '1rem' }}
      />
      <h1 style={{ color: '#ff4d4f' }}>Something went wrong!</h1>
      <p style={{ marginBottom: '1rem', color: '#333' }}>We encountered an unexpected error.</p>
      <details style={{ textAlign: 'left', maxWidth: '400px', margin: '1rem auto', color: '#777' }}>
        <summary>Error Details</summary>
        {error.message}
      </details>
      <button
        onClick={onRetry}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          color: '#fff',
          backgroundColor: '#1890ff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorTemplate;
