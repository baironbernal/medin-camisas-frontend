import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6">
        <span className="text-8xl">🔍</span>
      </div>
      
      <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
        404
      </h1>
      
      <h2 className="text-xl font-medium text-gray-700 mb-4">
        Página no encontrada
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>

      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Volver al inicio
        </Link>
        
        <Link
          href="/coleccion"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          Ver productos
        </Link>
      </div>
    </div>
  );
}