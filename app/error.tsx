'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <html lang="es">
      <body className="antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <span className="text-8xl">⚠️</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Algo salió mal
            </h1>
            
            <p className="text-gray-600 mb-8">
              Lo sentimos, experimentamos un problema al cargar esta sección.
              Por favor, intenta de nuevo.
            </p>

            {error.digest && (
              <p className="text-xs text-gray-400 mb-4">
                ID de error: {error.digest}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => reset()}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Intentar de nuevo
              </button>
              
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
