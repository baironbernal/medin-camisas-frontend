'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { useAuth } from '@/app/useContext/AuthContext';

interface Props {
  onConfirm: (name: string, phone: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function WhatsAppCustomerModal({ onConfirm, onCancel, loading }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setPhone((user as { phone_number?: string }).phone_number ?? '');
    }
  }, [user]);

  const validate = () => {
    const next: { name?: string; phone?: string } = {};
    if (!name.trim()) next.name = 'El nombre es obligatorio';
    if (!phone.trim()) next.phone = 'El teléfono es obligatorio';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    onConfirm(name.trim(), phone.trim());
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onCancel} />

      <div className="fixed bottom-0 left-0 right-0 mx-3 mb-3 sm:bottom-6 sm:left-auto sm:right-6 sm:mx-0 z-[61] bg-white rounded-2xl shadow-2xl border border-gray-200 sm:w-80 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-green-500" />
            <h3 className="font-heading font-bold text-primary text-sm">Datos del pedido</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-secondary mb-4">
          Para crear tu pedido por WhatsApp necesitamos tu información de contacto.
        </p>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-primary block mb-1">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tu nombre completo"
              className={`w-full border rounded-lg text-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400 transition-colors ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-primary block mb-1">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="Ej: 3001234567"
              inputMode="numeric"
              className={`w-full border rounded-lg text-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400 transition-colors ${
                errors.phone ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div className="flex gap-2 mt-1">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 border border-gray-300 text-secondary py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              {loading ? (
                'Enviando...'
              ) : (
                <>
                  <MessageCircle size={14} />
                  Confirmar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
