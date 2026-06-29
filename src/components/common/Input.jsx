import React from 'react';

export const Input = React.forwardRef(({
  label,
  name,
  type = 'text',
  error,
  placeholder,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        ref={ref}
        placeholder={placeholder}
        className={`glass-input ${
          error ? 'border-red-500/70 focus:border-red-500/80 focus:ring-red-500/20' : ''
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 font-medium">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
