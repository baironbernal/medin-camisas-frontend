'use client';

import Link from 'next/link';
import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { login } from '@/app/services/auth';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2, LogIn } from 'lucide-react';
import { LoginFormSchema } from '@/app/lib/definitions';
import { Input } from '@/app/components/ui/input';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const [callback] = useQueryState('callback');
  const [openCart, setOpenCart] = useQueryState('openCart');
  const { isLoggedIn, setLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      if (callback === 'cart') {
        setOpenCart('true');
        router.replace('/');
      } else {
        router.replace('/');
      }
    }
  }, [isLoggedIn, router, callback, setOpenCart]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{email?: string[], password?: string[]}>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    
    const validatedFields = LoginFormSchema.safeParse({ email, password });
    
    if (!validatedFields.success) {
      setValidationErrors(validatedFields.error.flatten().fieldErrors);
      return;
    }
    
    setLoading(true);
    try {
      await login({ email, password });
      setLoggedIn(true);
      if (callback === 'cart') {
        setOpenCart('true');
        router.push('/');
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Credenciales inválidas. Intenta de nuevo.');
      } else {
        setError('Ocurrió un error. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-2 bg-primary" />

          <div className="px-8 py-10">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <LogIn size={26} className="text-primary" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-primary">Iniciar sesión</h1>
              <p className="text-secondary text-sm mt-2">Bienvenido de nuevo a Medin Camisas</p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Correo electrónico"
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                error={validationErrors.email}
              />

              <Input
                label="Contraseña"
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                error={validationErrors.password}
              />

              <button
                id="btn-login"
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-purple transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                {loading ? 'Ingresando…' : 'Ingresar'}
              </button>
            </form>

            <p className="text-center text-sm text-secondary mt-6">
              ¿No tienes cuenta?{' '}
              <Link href={`/signup${callback ? `?callback=${callback}` : ''}`} className="text-primary font-medium hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
