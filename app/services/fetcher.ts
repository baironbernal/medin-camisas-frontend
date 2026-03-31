export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  let res: Response;
  
  try {
    res = await fetch(url, {
      ...options,
      next: options.next,
    });
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('No se pudo conectar con el servidor. Verifica tu conexión a internet.', 0);
    }
    throw error;
  }

  const contentType = res.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (res.status === 404) {
    throw new NotFoundError();
  }

  if (!res.ok) {
    let message = `Error ${res.status}`;
    
    if (isJson) {
      try {
        const errorData = await res.json();
        message = errorData.message || errorData.error || message;
      } catch {
        // Keep default message
      }
    } else {
      message = `Error ${res.status}: ${res.statusText}`;
    }
    
    throw new ApiError(message, res.status);
  }

  if (!isJson) {
    throw new ApiError('Respuesta inválida del servidor', res.status);
  }

  try {
    return await res.json() as T;
  } catch {
    throw new ApiError('Respuesta inválida del servidor', res.status);
  }
}