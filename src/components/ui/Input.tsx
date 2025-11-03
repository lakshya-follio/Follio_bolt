import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`form-input ${icon ? 'pl-10' : ''} ${
              error ? 'input-error' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && <div className="text-error">{error}</div>}
        {hint && !error && <div className="text-hint">{hint}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
