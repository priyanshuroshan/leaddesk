import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  BarChart3,
  Shield,
  Users,
  TrendingUp,
  MessageSquare,
  Star,
  CheckCircle2,
  Sparkles,
  Globe,
  Lock,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { toast } from '../hooks/useToast';
import api from '../services/api';

// ─── Zod Schema ─────────────────────────────────────────────────────────────
const leadSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  budget: z.enum(['Under $1k', '$1k–$5k', '$5k–$10k', '$10k+'], {
    errorMap: () => ({ message: 'Please select a budget range' }),
  }),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long'),
});

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

// ─── Feature data ────────────────────────────────────────────────────────────
const features = [
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    desc: 'Track your leads pipeline with live dashboards and insightful metrics that actually matter.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'JWT authentication, bcrypt hashing, and HttpOnly cookies keep your data fortress-level secure.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: Users,
    title: 'Lead Management',
    desc: 'Capture, organise, and track every lead from first contact to closed deal in one place.',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: TrendingUp,
    title: 'Smart Filtering',
    desc: 'Search, filter by status, and sort your leads instantly — no lag, no friction.',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: MessageSquare,
    title: 'Instant Notifications',
    desc: 'Beautiful toast notifications keep you informed of every action and update in real time.',
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
  },
  {
    icon: Globe,
    title: 'Fully Responsive',
    desc: 'Pixel-perfect on every device — from desktop dashboards to mobile lead capture forms.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
  },
];

const whyItems = [
  'Built on the battle-tested MERN stack',
  'Real MongoDB Atlas integration',
  'Production-ready code architecture',
  'JWT + bcrypt security from day one',
  'Duplicate submission prevention',
  'Mobile-first responsive design',
  'Dark & light mode built in',
  'Smooth Framer Motion animations',
];

const stats = [
  { value: '10k+', label: 'Leads Captured' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '< 200ms', label: 'API Response' },
  { value: '100%', label: 'Open Source' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function Landing() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(leadSchema) });

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const { data } = await api.post('/leads', formData);
      if (data.success) {
        toast.success(data.message || 'Message sent! We\'ll be in touch.');
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-400/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-cyan-300/5 blur-3xl" />
        </div>

        <div className="container-max relative">
          <motion.div
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {/* Pill badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Premium Lead Management CRM
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.08] mb-6"
            >
              Capture Leads.{' '}
              <span className="gradient-text">Close Deals.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-10"
            >
              LeadDesk Mini is the premium, full-stack CRM designed for modern teams. 
              Capture, manage, and convert your leads — beautifully.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
              <a href="#contact">
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="#features">
                <Button variant="secondary" size="lg">
                  See Features
                </Button>
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-zinc-400 dark:text-zinc-500"
            >
              {['No credit card required', 'Open source', 'MERN stack'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden mt-20 border border-zinc-200 dark:border-zinc-800"
          >
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white dark:bg-zinc-900 px-6 py-8 flex flex-col items-center text-center"
              >
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{value}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="section-pad bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container-max">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 mb-4">
              Features
            </span>
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Everything you need to{' '}
              <span className="gradient-text">grow faster</span>
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              A carefully crafted toolkit to capture, manage, and convert leads without the enterprise complexity.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={title}
                className="card group hover:scale-[1.02]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <section id="why-us" className="section-pad">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-6">
                <Star className="w-3 h-3 fill-current" />
                Why choose LeadDesk Mini
              </span>
              <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
                Built for modern teams who{' '}
                <span className="gradient-text">move fast</span>
              </h2>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                We've taken the complexity out of lead management. LeadDesk Mini is production-ready, 
                beautiful by default, and packed with the features that actually move the needle.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {whyItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Visual card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-brand-gradient rounded-3xl opacity-10 blur-2xl" />
              <div className="relative card p-0 overflow-hidden">
                {/* Mini dashboard preview */}
                <div className="bg-zinc-50 dark:bg-zinc-800 px-6 py-4 border-b border-zinc-100 dark:border-zinc-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-4 text-xs text-zinc-400 font-mono">leaddesk.dashboard</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Total', value: '248', color: 'text-zinc-900 dark:text-white' },
                      { label: 'New', value: '84', color: 'text-blue-600' },
                      { label: 'Closed', value: '112', color: 'text-emerald-600' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 text-center">
                        <p className={`text-xl font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Sarah Johnson', email: 'sarah@company.com', status: 'New', statusColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
                      { name: 'Mike Chen', email: 'mike@startup.io', status: 'Contacted', statusColor: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
                      { name: 'Emma Davis', email: 'emma@agency.co', status: 'Closed', statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
                    ].map(({ name, email, status, statusColor }) => (
                      <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {name[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{name}</p>
                            <p className="text-xs text-zinc-400 truncate">{email}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor}`}>{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="section-pad bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container-max">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-brand-gradient p-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white blur-3xl" />
            </div>
            <div className="relative">
              <Lock className="w-8 h-8 text-white/80 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to supercharge your lead game?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join forward-thinking teams using LeadDesk Mini to convert more leads, faster.
              </p>
              <a href="#contact">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-zinc-50 active:scale-[0.98] transition-all shadow-lg">
                  Start Free Today
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LEAD FORM ─────────────────────────────────────────────────────── */}
      <section id="contact" className="section-pad">
        <div className="container-max">
          <div className="max-w-2xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 mb-4">
                <MessageSquare className="w-3 h-3" />
                Get in Touch
              </span>
              <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                Let's start a conversation
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Tell us about your project and we'll get back to you within 24 hours.
              </p>
            </motion.div>

            <motion.div
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Message sent!</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-center text-sm">
                    Thank you for reaching out. We'll be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      placeholder="Jane Appleseed"
                      required
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="jane@company.com"
                      required
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <Input
                    as="select"
                    label="Budget Range"
                    required
                    error={errors.budget?.message}
                    {...register('budget')}
                    defaultValue=""
                  >
                    <option value="" disabled>Select your budget range…</option>
                    <option value="Under $1k">Under $1k</option>
                    <option value="$1k–$5k">$1k–$5k</option>
                    <option value="$5k–$10k">$5k–$10k</option>
                    <option value="$10k+">$10k+</option>
                  </Input>

                  <Input
                    as="textarea"
                    label="Message"
                    placeholder="Tell us about your project, goals, and timeline…"
                    required
                    error={errors.message?.message}
                    {...register('message')}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={submitting}
                  >
                    {submitting ? 'Sending…' : 'Send Message'}
                    {!submitting && <ArrowRight className="w-4 h-4" />}
                  </Button>

                  <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Your information is secure and will never be shared.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
