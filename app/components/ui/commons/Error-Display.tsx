'use client';

import { useState } from 'react';
import { ApiError, NotFoundError } from '@/app/services/fetcher';

interface ErrorDisplayProps {
  error: Error | null;
  reset?: () => void;
}

export function ErrorDisplay({ error, reset }: ErrorDisplayProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!reset) return;
    
    setIsRetrying(true);
    try {
      reset();
    } finally {
      setIsRetrying(false);
    }
  };

  const isNotFound = error instanceof NotFoundError;
  
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-4">
        <span className="text-6xl">
          {isNotFound ? '🔍' : '⚠️'}
        </span>
      </div>
      
      <h2 className="text-xl font-medium text-gray-800 mb-2">
        {isNotFound ? 'No encontrado' : 'Algo salió mal'}
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {error?.message || (isNotFound 
          ? 'El recurso que buscas no existe.' 
          : 'Ocurrió un error al cargar los datos. Por favor, intenta de nuevo.')}
      </p>

      {reset && (
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
        >
          {isRetrying ? 'Intentando...' : 'Intentar de nuevo'}
        </button>
      )}
    </div>
  );
}

export function ErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [error, setError] = useState<Error | null>(null);
  const [key, setKey] = useState(0);

  const reset = () => {
    setError(null);
    setKey(prev => prev + 1);
  };

  if (error) {
    return fallback || <ErrorDisplay error={error} reset={reset} />;
  }

  return (
    <ErrorBoundaryInner key={key} onError={setError}>
      {children}
    </ErrorBoundaryInner>
  );
}

function ErrorBoundaryInner({ 
  children, 
  onError 
}: { 
  children: React.ReactNode;
  onError: (error: Error) => void;
}) {
  return <>{children}</>;
}
