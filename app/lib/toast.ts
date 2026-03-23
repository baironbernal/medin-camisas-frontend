import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const toast = (text: string, type: 'success' | 'error') => {
  Toastify({
    text,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background: type === 'success'
        ? 'linear-gradient(135deg, var(--theme-color-primary, #292944), var(--theme-color-purple, #3E3C64))'
        : 'linear-gradient(135deg, #c0392b, #e74c3c)',
      borderRadius: '12px',
      padding: '12px 20px',
      fontFamily: 'var(--font-primary), inherit',
      fontSize: '14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      color: 'var(--color-white, #ffffff)'
    },
  }).showToast();
};
