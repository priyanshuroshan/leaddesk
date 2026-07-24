import { forwardRef } from 'react';

/**
 * @param {{
 *   label?: string,
 *   error?: string,
 *   hint?: string,
 *   className?: string,
 *   as?: 'input'|'textarea'|'select',
 * } & React.InputHTMLAttributes<HTMLInputElement>} props
 */
const Input = forwardRef(function Input(
  { label, error, hint, className = '', as: Tag = 'input', children, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <Tag
        ref={ref}
        className={`input ${error ? 'input-error' : ''} ${
          Tag === 'textarea' ? 'resize-none min-h-[120px]' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </Tag>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-0.5 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{hint}</p>
      )}
    </div>
  );
});

export default Input;
