'use client'

import Link from 'next/link';
import { useState, useActionState, useEffect, Suspense } from 'react';
import { useQueryState } from 'nuqs';
import { signup } from '@/app/services/auth';
import { FormState } from '@/app/lib/definitions';
import { Loader2, UserPlus } from 'lucide-react';
import { Input } from '@/app/components/ui/input';

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const [callback] = useQueryState('callback');
  const [state, action, pending] = useActionState<FormState, FormData>(signup, undefined);

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-2 bg-primary" />

          <div className="px-8 py-10">
            {/* Title */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <UserPlus size={26} className="text-primary" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-primary">Crear cuenta</h1>
              <p className="text-secondary text-sm mt-2">Regístrate para comprar en Medin Camisas</p>
            </div>

            {/* Error general */}
            {state?.message && (
              <div className="mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                {state.message}
              </div>
            )}

            <form action={action} className="space-y-4">
              {callback && <input type="hidden" name="callback" value={callback} />}
              {/* Name */}
              <Input
                label="Nombre completo"
                id="name"
                name="name"
                type="text"
                placeholder="Ej: Juan Pérez"
                error={state?.errors?.name}
              />

              {/* Email */}
              <Input
                label="Correo electrónico"
                id="email"
                name="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                error={state?.errors?.email}
              />

              {/* Cellphone */}
              <Input
                label="Celular"
                id="cellphone"
                name="cellphone"
                type="tel"
                placeholder="Ej: 3001234567"
                error={state?.errors?.cellphone}
              />

              {/* Address */}
              <Input
                label="Dirección"
                id="address"
                name="address"
                type="text"
                placeholder="Tu dirección completa"
                error={state?.errors?.address}
              />

              {/* Password */}
              <Input
                label="Contraseña"
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                error={state?.errors?.password}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={pending}
                className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-purple transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {pending ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                {pending ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>
            </form>

            <p className="text-center text-sm text-secondary mt-6">
              ¿Ya tienes cuenta?{' '}
              <Link href={`/login${callback ? `?callback=${callback}` : ''}`} className="text-primary font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}