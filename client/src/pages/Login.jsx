import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Footer from '../components/layout/Footer';
import { Moon, Sun } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export default function Login() {
  const { login, user } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { rememberMe: false } });

  const onSubmit = async ({ email, password, rememberMe }) => {
    setLoading(true);
    try {
      const data = await login(email, password, rememberMe);
      if (data.success) {
        toast.success(`Welcome back, ${data.data.name}!`);
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
      setError('email', { message: ' ' });
      setError('password', { message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Theme toggle top right */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggle}
          className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 justify-center mb-6 group">
              <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow group-hover:shadow-glow-sm transition-shadow">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
                Lead<span className="text-brand-600">Desk</span>{' '}
                <span className="text-sm font-medium text-zinc-400">Mini</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Sign in to your admin dashboard
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@leaddesk.com"
                required
                error={errors.email?.message === ' ' ? undefined : errors.email?.message}
                autoComplete="email"
                {...register('email')}
              />

              {/* Password with show/hide */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`input pr-11 ${errors.password ? 'input-error' : ''}`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && errors.password.message !== ' ' && (
                  <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <span>⚠</span> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-brand-600 bg-white dark:bg-zinc-800 focus:ring-brand-500 focus:ring-offset-0 cursor-pointer"
                  {...register('rememberMe')}
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  Remember me for 7 days
                </span>
              </label>

              <Button type="submit" fullWidth size="lg" loading={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>

            {/* Security note */}
            <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Secured with JWT + bcrypt. Session stored in HttpOnly cookie.
              </p>
            </div>
          </motion.div>

          {/* Back to site */}
          <motion.p
            className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/"
              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium transition-colors"
            >
              ← Back to home
            </Link>
          </motion.p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
