const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN!;

export function getImageUrl(path: string  | null | undefined )   {
    if (!path) return '/home/product.png';

  return `${BACKEND_DOMAIN}/storage/${path}`;
}
