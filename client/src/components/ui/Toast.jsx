import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertCircle, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useToastState } from '../../hooks/useToast';

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
  error: <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
  info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
};

const borders = {
  success: 'border-l-emerald-500',
  error: 'border-l-red-500',
  info: 'border-l-blue-500',
  warning: 'border-l-amber-500',
};

function ToastItem({ id, type, message, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`
        flex items-start gap-3 w-full max-w-sm p-4 rounded-2xl
        bg-white dark:bg-zinc-900 shadow-card-hover
        border border-zinc-100 dark:border-zinc-800
        border-l-4 ${borders[type]}
      `}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug pr-2">
        {message}
      </p>
      <button
        onClick={() => onRemove(id)}
        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts, remove } = useToastState();

  return createPortal(
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onRemove={remove} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
