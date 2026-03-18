'use client'

import Link from 'next/link';
import { useActionState, useEffect, Suspense } from 'react';
import { useQueryState } from 'nuqs';
import { useRouter } from 'next/navigation';
import { signup } from '@/app/services/auth';
import { useAuth } from '@/app/useContext/AuthContext';
import { FormState } from '@/app/lib/definitions';
import { Loader2, User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { Input } from '@/app/components/ui';

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const router = useRouter();
  const { setLoggedIn, setUser } = useAuth();
  const [callback] = useQueryState('callback');
  const [openCart, setOpenCart] = useQueryState('openCart');
  const [state, action, pending] = useActionState<FormState, FormData>(signup, undefined);

  useEffect(() => {
    if (state?.success) {
      setLoggedIn(true);
      if (state.user) setUser(state.user);
      
      if (callback === 'cart' || state.redirectUrl?.includes('openCart')) {
        setOpenCart('true');
        router.push('/');
      } else {
        router.push(state.redirectUrl || '/');
      }
    }
  }, [state, setLoggedIn, setUser, router, callback, setOpenCart]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-24 font-sans">
      <div className="w-full max-w-lg">
        <div className="bg-primary rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden p-6 md:p-12">
          
          <div className="mb-10 text-left">
            <p className="text-tertiary font-bold tracking-[0.2em] text-xs uppercase mb-3 text-gray-400">MEDIN</p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-3">Crear Cuenta</h1>
            <p className="text-description text-sm">Regístrate para ver nuestro catálogo y comprar productos</p>
          </div>

          {state?.message && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {state.message}
            </div>
          )}

          <form action={action} className="space-y-6">
            {callback && <input type="hidden" name="callback" value={callback} />}
            
            <Input
              label="Nombre completo"
              id="name"
              name="name"
              type="text"
              placeholder="Ej: Juan Pérez"
              defaultValue={state?.fields?.name}
              error={state?.errors?.name}
              theme="dark"
              icon={<User size={18} />}
            />

            <Input
              label="Correo electrónico"
              id="email"
              name="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              defaultValue={state?.fields?.email}
              error={state?.errors?.email}
              theme="dark"
              icon={<Mail size={18} />}
            />

            <Input
              label="Celular"
              id="cellphone"
              name="cellphone"
              type="tel"
              placeholder="Ej: 3001234567"
              defaultValue={state?.fields?.cellphone}
              error={state?.errors?.cellphone}
              theme="dark"
              icon={<Phone size={18} />}
            />

            <Input
              label="Dirección"
              id="address"
              name="address"
              type="text"
              placeholder="Tu dirección completa"
              defaultValue={state?.fields?.address}
              error={state?.errors?.address}
              theme="dark"
              icon={<MapPin size={18} />}
            />

            <Input
              label="Contraseña"
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              error={state?.errors?.password}
              theme="dark"
              icon={<Lock size={18} />}
            />

            <button
              type="submit"
              disabled={pending}
              className="w-full md:w-auto md:px-10 bg-accent text-primary font-semibold py-3 rounded-full hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {pending && <Loader2 size={18} className="animate-spin" />}
              {pending ? 'Creando…' : 'Registrarse'}
            </button>
          </form>

          <p className="text-sm text-description mt-8">
            ¿Ya tienes cuenta?{' '}
            <Link href={`/login${callback ? `?callback=${callback}` : ''}`} className="text-white hover:underline transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}