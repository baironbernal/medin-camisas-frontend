declare module 'toastify-js' {
  interface ToastifyOptions {
    text?: string;
    duration?: number;
    destination?: string;
    newWindow?: boolean;
    close?: boolean;
    gravity?: 'top' | 'bottom';
    position?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    avatar?: string;
    className?: string;
    stopOnFocus?: boolean;
    callback?: () => void;
    onClick?: () => void;
    offset?: { x: number | string; y: number | string };
    escapeMarkup?: boolean;
    style?: Record<string, string>;
    selector?: string | HTMLElement;
    node?: HTMLElement;
    oldestFirst?: boolean;
  }

  interface Toast {
    showToast: () => void;
    hideToast: () => void;
  }

  function Toastify(options: ToastifyOptions): Toast;
  export = Toastify;
}

declare module 'toastify-js/src/toastify.css' {
  const styles: Record<string, string>;
  export default styles;
}
