import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Footer from '../components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="flex-1 flex items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>
          </div>

          {/* 404 */}
          <h1 className="text-8xl font-extrabold text-brand-600 dark:text-brand-400 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Page not found</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link to="/">
            <Button size="lg">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
