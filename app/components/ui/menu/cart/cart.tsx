'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/app/hooks/useCartStore';
import CartItem from './cartItem';
import { X, ShoppingBag, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { formatCOP } from '@/app/lib/formatPrice';
import { Input } from '@/app/components/ui/input';
import { useAuth } from '@/app/context/AuthContext';
import { checkout } from '@/app/services/checkout';

interface CartSidebarProps {
  onClose: () => void;
  isClosing: boolean;
}

type Step = 'cart' | 'form' | 'success';

interface FormState {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string;
}

function getSessionId(): string {
  const key = 'medin_session_id';
  let id = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  if (!id) {
    id = crypto.randomUUID();
    if (typeof window !== 'undefined') localStorage.setItem(key, id);
  }
  return id;
}

export default function CartSidebar({ onClose, isClosing }: CartSidebarProps) {
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>('cart');
  const [formState, setFormState] = useState<FormState>({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone_number || '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState('');

  const total = cart.reduce(
    (acc, p) => acc + Number(p.price) * (p.quantity as number),
    0
  );

  function setField(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormState(prev => ({ ...prev, [field]: e.target.value }));
  }

  function handleProceed() {
    if (!isLoggedIn) {
      onClose();
      router.push('/login?callback=cart');
      return;
    }
    // Auto-fill form if user is logged in
    setFormState({
      customer_name: user?.name || '',
      customer_email: user?.email || '',
      customer_phone: user?.phone_number || '',
      notes: '',
    });
    setStep('form');
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const sessionId = getSessionId();
      const res = await checkout(
        {
          customer_name: formState.customer_name,
          customer_email: formState.customer_email,
          customer_phone: formState.customer_phone || undefined,
          notes: formState.notes || undefined,
          items: cart.map(item => ({
            product_variant_id: item.id,
            quantity: item.quantity as number,
          })),
        },
        sessionId
      );
      setOrderNumber(res.data.order.order_number);
      setOrderTotal(res.data.order.total);
      clearCart();
      setStep('success');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al procesar el pedido. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }

  const animClass = isClosing
    ? 'animate__animated animate__slideOutRight animate__faster'
    : 'animate__animated animate__slideInRight animate__faster';

  const backdropClass = isClosing
    ? 'animate__animated animate__fadeOut animate__faster'
    : 'animate__animated animate__fadeIn animate__faster';

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm';

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-10 ${backdropClass}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <section
        className={`mx-auto w-full bg-accent-light max-w-sm fixed right-0 h-screen z-20 top-0 shadow-2xl flex flex-col ${animClass}`}
      >
        {/* ── HEADER ── */}
        <div className="sticky top-0 bg-accent-light border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          {step === 'cart' && (
            <h2 className="font-heading font-bold text-xl text-primary">
              Carrito
            </h2>
          )}
          {step === 'form' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep('cart')}
                className="text-secondary hover:text-primary transition-colors text-sm"
              >
                ← Volver
              </button>
              <h2 className="font-heading font-bold text-xl text-primary">
                Datos del pedido
              </h2>
            </div>
          )}
          {step === 'success' && (
            <h2 className="font-heading font-bold text-xl text-primary">
              ¡Pedido realizado!
            </h2>
          )}
          <button onClick={onClose} className="cursor-pointer p-2">
            <X size={20} className="text-primary" />
          </button>
        </div>

        {/* ── STEP: CART ── */}
        {step === 'cart' && (
          <>
            <div className="flex-1 px-6 py-4 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <ShoppingBag size={48} className="text-gray-300" />
                  <p className="text-primary font-medium">Tu carrito está vacío</p>
                  <p className="text-sm text-secondary">Agrega productos para comenzar</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map(product => (
                    <CartItem key={product.id} product={product} />
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="sticky bottom-0 bg-accent-light border-t border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-medium text-primary">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCOP(total)}
                  </span>
                </div>
                <button
                  id="btn-proceed-checkout"
                  onClick={handleProceed}
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-purple transition-colors flex items-center justify-center gap-2"
                >
                  {isLoggedIn ? 'Proceder al pago' : 'Inicia sesión para comprar'}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* ── STEP: FORM ── */}
        {step === 'form' && (
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <Input
                label="Nombre completo *"
                id="checkout-name"
                type="text"
                required
                value={formState.customer_name}
                onChange={setField('customer_name')}
                placeholder="Ej: Juan Pérez"
                className="bg-white py-2.5 px-3"
              />

              <Input
                label="Correo electrónico *"
                id="checkout-email"
                type="email"
                required
                value={formState.customer_email}
                onChange={setField('customer_email')}
                placeholder="tucorreo@ejemplo.com"
                className="bg-white py-2.5 px-3"
              />

              <Input
                label="Celular"
                id="checkout-phone"
                type="tel"
                value={formState.customer_phone}
                onChange={setField('customer_phone')}
                placeholder="Ej: 3001234567"
                className="bg-white py-2.5 px-3"
              />

              <div>
                <label className="block text-sm font-medium text-primary mb-1">Notas adicionales</label>
                <textarea
                  id="checkout-notes"
                  rows={3}
                  value={formState.notes}
                  onChange={setField('notes')}
                  placeholder="Instrucciones especiales, dirección, etc."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Order summary */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2 mt-2">
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                  Resumen del pedido
                </p>
                {cart.map(p => (
                  <div key={p.id} className="flex justify-between text-sm text-primary">
                    <span className="truncate max-w-[160px]">
                      {p.product_name || `Variante #${p.id}`} × {p.quantity}
                    </span>
                    <span className="font-medium shrink-0 ml-2">
                      {formatCOP(Number(p.price) * (p.quantity ?? 1))}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-primary">
                  <span>Total</span>
                  <span>{formatCOP(total)}</span>
                </div>
              </div>

              <button
                id="btn-confirm-order"
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-purple transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                {loading ? 'Procesando…' : 'Confirmar pedido'}
              </button>
            </form>
          </div>
        )}

        {/* ── STEP: SUCCESS ── */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={36} className="text-green-600" />
            </div>
            <h3 className="font-heading text-xl font-bold text-primary">
              ¡Pedido confirmado!
            </h3>
            <p className="text-secondary text-sm">
              Tu pedido <span className="font-semibold text-primary">{orderNumber}</span> fue registrado correctamente.
            </p>
            {orderTotal && (
              <p className="text-sm text-secondary">
                Total: <span className="font-semibold text-primary">{formatCOP(Number(orderTotal))}</span>
              </p>
            )}
            <p className="text-secondary text-xs mt-1">
              Nos pondremos en contacto contigo pronto para coordinar la entrega.
            </p>
            <button
              id="btn-close-success"
              onClick={onClose}
              className="mt-4 w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-purple transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </section>
    </>
  );
}