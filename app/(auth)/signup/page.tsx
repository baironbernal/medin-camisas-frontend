'use client'

import Link from 'next/link';
import { useActionState, useEffect, useState, Suspense } from 'react';
import { useQueryState } from 'nuqs';
import { useRouter } from 'next/navigation';
import { signup } from '@/app/services/auth';
import { useAuth } from '@/app/useContext/AuthContext';
import { FormState } from '@/app/lib/definitions';
import { Loader2, User, Mail, Phone, Lock, Store } from 'lucide-react';
import { Input } from '@/app/components';

interface Location { id: number; nombre: string }

async function fetchDepartments(): Promise<Location[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/departments`);
  return res.json();
}

async function fetchMunicipalities(departmentId: number): Promise<Location[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/municipalities/${departmentId}`);
  return res.json();
}

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
  const [, setOpenCart] = useQueryState('openCart');
  const [state, action, pending] = useActionState<FormState, FormData>(signup, undefined);

  const [departments, setDepartments] = useState<Location[]>([]);
  const [municipalities, setMunicipalities] = useState<Location[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  useEffect(() => {
    fetchDepartments().then(setDepartments);
  }, []);

  const handleDepartmentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedDepartment(id);
    setMunicipalities([]);
    if (id) {
      const munis = await fetchMunicipalities(Number(id));
      setMunicipalities(munis);
    }
  };

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

  const selectClass = "w-full px-4 py-3 rounded-xl bg-dark/50 border-none text-white focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm appearance-none";
  const optionalSpan = <span className="text-white/50 font-normal">(opcional)</span>;

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

          <form action={action} className="space-y-5">
            {callback && <input type="hidden" name="callback" value={callback} />}

            {/* ── Basic info ── */}
            <Input
              label="Nombre completo"
              id="name" name="name" type="text"
              placeholder="Ej: Juan Pérez"
              defaultValue={state?.fields?.name}
              error={state?.errors?.name}
              theme="dark"
              icon={<User size={18} />}
            />

            <Input
              label="Correo electrónico"
              id="email" name="email" type="email"
              placeholder="tucorreo@ejemplo.com"
              defaultValue={state?.fields?.email}
              error={state?.errors?.email}
              theme="dark"
              icon={<Mail size={18} />}
            />

            <Input
              label="Celular"
              id="cellphone" name="cellphone" type="tel"
              placeholder="Ej: 3001234567"
              defaultValue={state?.fields?.cellphone}
              error={state?.errors?.cellphone}
              theme="dark"
              icon={<Phone size={18} />}
            />

            <Input
              label="Contraseña"
              id="password" name="password" type="password"
              placeholder="Mínimo 8 caracteres"
              error={state?.errors?.password}
              theme="dark"
              icon={<Lock size={18} />}
            />

            {/* ── Wholesaler info ── */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-4">Datos de mayorista {optionalSpan}</p>

              <div className="space-y-4">
                {/* WhatsApp */}
                <Input
                  label={<>WhatsApp {optionalSpan}</>}
                  id="whatsapp_number" name="whatsapp_number" type="tel"
                  placeholder="Ej: 3001234567"
                  defaultValue={state?.fields?.whatsapp_number}
                  theme="dark"
                  icon={<Phone size={18} />}
                />

                {/* Departamento + Municipio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="department_id" className="block text-sm font-medium mb-1.5 text-white">
                      Departamento {optionalSpan}
                    </label>
                    <select
                      id="department_id" name="department_id"
                      value={selectedDepartment}
                      onChange={handleDepartmentChange}
                      className={selectClass}
                    >
                      <option value="" className="text-gray-800">Selecciona...</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id} className="text-gray-800">{d.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="municipality_id" className="block text-sm font-medium mb-1.5 text-white">
                      Municipio {optionalSpan}
                    </label>
                    <select
                      id="municipality_id" name="municipality_id"
                      disabled={!selectedDepartment}
                      className={`${selectClass} disabled:opacity-40`}
                    >
                      <option value="" className="text-gray-800">
                        {selectedDepartment ? 'Selecciona...' : 'Primero elige departamento'}
                      </option>
                      {municipalities.map(m => (
                        <option key={m.id} value={m.id} className="text-gray-800">{m.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Canal de venta + Tipo de ropa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="selling_channel" className="block text-sm font-medium mb-1.5 text-white">
                      ¿Cómo vendes? {optionalSpan}
                    </label>
                    <select id="selling_channel" name="selling_channel" defaultValue={state?.fields?.selling_channel ?? ''} className={selectClass}>
                      <option value="" className="text-gray-800">Selecciona...</option>
                      <option value="Tienda física" className="text-gray-800">Tienda física</option>
                      <option value="Instagram" className="text-gray-800">Instagram</option>
                      <option value="WhatsApp" className="text-gray-800">WhatsApp</option>
                      <option value="Personal" className="text-gray-800">Personal</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="clothing_type" className="block text-sm font-medium mb-1.5 text-white">
                      Tipo de ropa {optionalSpan}
                    </label>
                    <select id="clothing_type" name="clothing_type" defaultValue={state?.fields?.clothing_type ?? ''} className={selectClass}>
                      <option value="" className="text-gray-800">Selecciona...</option>
                      <option value="Hombre" className="text-gray-800">Hombre</option>
                      <option value="Dama" className="text-gray-800">Dama</option>
                      <option value="Niño" className="text-gray-800">Niño</option>
                      <option value="Mixto" className="text-gray-800">Mixto</option>
                    </select>
                  </div>
                </div>

                {/* Ubicación de venta */}
                <div>
                  <label htmlFor="selling_location" className="block text-sm font-medium mb-1.5 text-white">
                    ¿Desde dónde vendes? {optionalSpan}
                  </label>
                  <select id="selling_location" name="selling_location" defaultValue={state?.fields?.selling_location ?? ''} className={selectClass}>
                    <option value="" className="text-gray-800">Selecciona...</option>
                    <option value="Tienda física" className="text-gray-800">Tienda física</option>
                    <option value="Redes sociales" className="text-gray-800">Redes sociales</option>
                    <option value="Catálogo" className="text-gray-800">Catálogo</option>
                    <option value="Otro" className="text-gray-800">Otro</option>
                  </select>
                </div>

                {/* Nombre del negocio */}
                <Input
                  label={<>Nombre del negocio o marca {optionalSpan}</>}
                  id="business_name" name="business_name" type="text"
                  placeholder="Ej: Moda Lucía"
                  defaultValue={state?.fields?.business_name}
                  theme="dark"
                  icon={<Store size={18} />}
                />
              </div>
            </div>

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
