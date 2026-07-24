import { useState, useCallback, useEffect, useRef } from 'react';

let toastId = 0;

/** @type {React.MutableRefObject<Function|null>} Global toast dispatcher */
const dispatchers = new Set();

/**
 * Show a toast notification globally
 * @param {'success'|'error'|'info'|'warning'} type
 * @param {string} message
 * @param {number} [duration=4000]
 */
export const toast = {
  success: (message, duration = 4000) => dispatch('success', message, duration),
  error: (message, duration = 5000) => dispatch('error', message, duration),
  info: (message, duration = 4000) => dispatch('info', message, duration),
  warning: (message, duration = 4000) => dispatch('warning', message, duration),
};

function dispatch(type, message, duration) {
  const id = ++toastId;
  dispatchers.forEach((fn) => fn({ id, type, message, duration }));
}

/**
 * Internal hook used by ToastContainer
 */
export function useToastState() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, toast.duration);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    dispatchers.add(add);
    return () => dispatchers.delete(add);
  }, [add]);

  return { toasts, remove };
}
