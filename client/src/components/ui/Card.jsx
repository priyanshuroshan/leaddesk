import { motion } from 'framer-motion';

/**
 * @param {{
 *   children: React.ReactNode,
 *   glass?: boolean,
 *   hover?: boolean,
 *   className?: string,
 *   animate?: boolean,
 * }} props
 */
export default function Card({ children, glass = false, hover = false, animate = false, className = '' }) {
  const base = glass ? 'glass-card' : 'card';

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 200 }}
        className={`${base} ${hover ? 'hover:shadow-card-hover cursor-pointer' : ''} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${base} ${hover ? 'hover:shadow-card-hover cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
}
