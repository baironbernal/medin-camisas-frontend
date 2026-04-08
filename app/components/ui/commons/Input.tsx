'use client'
import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string | string[];
  theme?: 'light' | 'dark';
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, type, theme = 'light', icon, ...props }, ref) => {
    
    const isDark = theme === 'dark';

    const defaultInputClass = isDark
      ? 'w-full py-3 rounded-xl bg-dark/50 border-none text-white placeholder-tertiary focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm'
      : 'w-full px-4 py-3 rounded-lg border border-gray-200 bg-accent-light text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm';

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div>
        {label && (
          <label htmlFor={props.id} className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white' : 'text-primary'}`}>
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-tertiary' : 'text-gray-400'}`}>
              {icon}
            </div>
          )}
          <input
            {...props}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            ref={ref}
            className={`${defaultInputClass} ${icon ? 'pl-11' : isDark ? 'px-4' : ''} ${isPassword ? 'pr-11' : ''} ${className}`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-tertiary hover:text-white' : 'text-gray-400 hover:text-primary'}`}
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

export default Input;
