'use client';

import { motion } from 'framer-motion';
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
    whatsappLoading,
    checkoutError,
    whatsappError,
    orderNumber,
    orderData,
    calculatedData,
    subtotalDiscounted,
    subtotalOriginal,
    largeSizeAnalysis,
    handleProceed,
    handleCheckout,
    handleWhatsAppOrder,
  } = useCartSidebar(onClose);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/70 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.section
        className="mx-auto w-full backdrop-filter backdrop-blur-md bg-white/80 border-l border-white/20 max-w-sm fixed right-0 h-screen z-50 top-0 shadow-2xl flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: isClosing ? '100%' : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* ── HEADER ── */}
        <div className="sticky top-0 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          {step === 'cart' && (
            <h2 className="font-heading font-bold text-xl text-primary">Carrito</h2>
          )}
          {step === 'form' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep('cart')}
                className="text-secondary hover:text-primary transition-colors text-sm"
              >
                ← Volver
              </button>
              <h2 className="font-heading font-bold text-xl text-primary">Datos del pedido</h2>
            </div>
          )}
          {step === 'success' && (
            <h2 className="font-heading font-bold text-xl text-primary">¡Pedido realizado!</h2>
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
            largeSizeAnalysis={largeSizeAnalysis}
            calculatedData={calculatedData}
            handleWhatsAppOrder={handleWhatsAppOrder}
            whatsappLoading={whatsappLoading}
            error={whatsappError}
          />
        )}

        {step === 'form' && (
          <CheckoutFormStep
            error={checkoutError}
            loading={loading}
            formState={formState}
            setField={setField}
            handleCheckout={handleCheckout}
            cart={cart}
            total={subtotalDiscounted}
            calculatedData={calculatedData}
          />
        )}

        {step === 'success' && orderData && (
          <SuccessStep
            orderNumber={orderNumber}
            orderData={orderData}
            onClose={onClose}
          />
        )}
      </motion.section>
    </>
  );
}
