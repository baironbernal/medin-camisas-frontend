import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | string[];
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, type, ...props }, ref) => {
    const defaultInputClass =
      'w-full px-4 py-3 rounded-lg border border-gray-200 bg-accent-light text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm';

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-primary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            {...props}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            ref={ref}
            className={`${defaultInputClass} ${isPassword ? 'pr-11' : ''} ${className}`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1 font-medium">
            {Array.isArray(error) ? error[0] : error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
