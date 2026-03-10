'use client';

import Link from 'next/link';
import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { login } from '@/app/services/auth';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2, Mail, Lock } from 'lucide-react';
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
  const { isLoggedIn, setLoggedIn, setUser } = useAuth();

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
      const res = await login({ email, password });
      setLoggedIn(true);
      if (res.user) setUser(res.user);
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
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-16 font-sans">
      <div className="w-full max-w-lg">
        <div className="bg-primary rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden p-6 md:p-12">
          <div className="mb-10 text-left">
            <p className="text-tertiary font-bold tracking-[0.2em] text-xs uppercase mb-3 text-gray-400">MEDIN</p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-3">Iniciar Sesión</h1>
            <p className="text-description text-sm">Inicia sesión y accede a nuestros catálogo y precios mayoristas</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Ejemplo@gmail.com"
              error={validationErrors.email}
              theme="dark"
              icon={<Mail size={18} />}
            />

            <Input
              label="Contraseña"
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              error={validationErrors.password}
              theme="dark"
              icon={<Lock size={18} />}
            />

            <button
              id="btn-login"
              type="submit"
              disabled={loading}
              className="w-full md:w-auto md:px-10 bg-accent text-primary font-semibold py-3 rounded-full hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="text-sm text-description mt-8">
            ¿No tienes cuenta?{' '}
            <Link href={`/signup${callback ? `?callback=${callback}` : ''}`} className="text-white hover:underline transition-colors">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
