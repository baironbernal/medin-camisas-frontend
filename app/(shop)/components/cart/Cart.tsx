'use client';

import { X } from 'lucide-react';
import { useCartSidebar } from '@/app/hooks/useCartSidebar';
import CartStep from './steps/CartStep';
import CheckoutFormStep from './steps/CheckoutFormStep';
import SuccessStep from './steps/SuccessStep';

interface CartSidebarProps {
  onClose: () => void;
  isClosing: boolean;
}

export default function CartSidebar({ onClose, isClosing }: CartSidebarProps) {
  const {
    cart,
    isLoggedIn,
    step,
    setStep,
    formState,
    setField,
    loading,
    error,
    orderNumber,
    orderData,
    subtotalDiscounted,
    subtotalOriginal,
    handleProceed,
    handleCheckout,
    getDiscountForQuantity
  } = useCartSidebar(onClose);

  const animClass = isClosing
    ? 'animate__animated animate__slideOutRight animate__faster'
    : 'animate__animated animate__slideInRight animate__faster';

  const backdropClass = isClosing
    ? 'animate__animated animate__fadeOut animate__faster'
    : 'animate__animated animate__fadeIn animate__faster';

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 z-10 ${backdropClass}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <section
        className={`mx-auto w-full fade-in backdrop-filter backdrop-blur-md bg-white/80 border-l border-white/20 max-w-sm fixed right-0 h-screen z-20 top-0 shadow-2xl flex flex-col ${animClass}`}
      >
        {/* ── HEADER ── */}
        <div className="sticky top-0  border-b border-gray-200 px-6 py-4 flex justify-between items-center">
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

        {/* ── STEPS ── */}
        {step === 'cart' && (
          <CartStep 
            cart={cart}
            total={subtotalDiscounted}
            originalTotal={subtotalOriginal}
            isLoggedIn={isLoggedIn}
            handleProceed={handleProceed}
          />
        )}

        {step === 'form' && (
          <CheckoutFormStep 
            error={error}
            loading={loading}
            formState={formState}
            setField={setField}
            handleCheckout={handleCheckout}
            cart={cart}
            getDiscountForQuantity={getDiscountForQuantity}
            total={subtotalDiscounted}
          />
        )}

        {step === 'success' && orderData && (
          <SuccessStep 
            orderNumber={orderNumber}
            orderData={orderData}
            onClose={onClose}
          />
        )}
      </section>
    </>
  );
}
