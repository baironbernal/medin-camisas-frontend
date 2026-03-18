'use client';

import { useAuth } from '@/app/useContext/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, LogOut, Loader2, CircleUserRound } from 'lucide-react';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, logout, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-beige px-4 py-16">
      <div className="container mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-primary mb-8 text-center">
          Mi Perfil
        </h1>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
          <div className="h-2 bg-primary" />
          
          <div className="px-8 py-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-accent-light rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                <CircleUserRound size={48} className="text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-primary">{user.name}</h2>
              <p className="text-secondary text-sm font-medium">{user.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-accent-light border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <User size={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-0.5">Nombre Completo</p>
                  <p className="font-medium text-primary text-base">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-accent-light border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Mail size={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-0.5">Correo Electrónico</p>
                  <p className="font-medium text-primary text-base">{user.email}</p>
                </div>
              </div>

              {user.phone_number && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-accent-light border border-gray-100 hover:shadow-sm transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                    <Phone size={22} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-0.5">Celular</p>
                    <p className="font-medium text-primary text-base">{user.phone_number}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white font-medium bg-primary hover:bg-purple px-8 py-3 rounded-lg transition-colors shadow-sm"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
