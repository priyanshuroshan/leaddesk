import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  DollarSign,
  MessageSquare,
  Calendar,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Badge from './Badge';

/**
 * Full-screen slide-over panel to view complete lead details
 * @param {{
 *   lead: object|null,
 *   onClose: Function,
 *   onStatusChange: Function,
 * }} props
 */
export default function LeadDetailPanel({ lead, onClose, onStatusChange }) {
  const STATUS_CYCLE = { New: 'Contacted', Contacted: 'Closed', Closed: 'New' };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (lead) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lead, onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = lead ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lead]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <AnimatePresence>
      {lead && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slide-over panel */}
          <motion.div
            className="relative ml-auto w-full max-w-lg h-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {lead.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-white leading-tight">
                    {lead.name}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">{lead.email}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Status + Advance button */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700">
                <div>
                  <p className="text-xs font-medium text-zinc-400 mb-1.5">Current Status</p>
                  <Badge status={lead.status} />
                </div>
                {STATUS_CYCLE[lead.status] && (
                  <button
                    onClick={() => onStatusChange(lead, STATUS_CYCLE[lead.status])}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all"
                  >
                    Move to {STATUS_CYCLE[lead.status]}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 gap-4">
                {/* Name */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-400 mb-0.5">Full Name</p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{lead.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-violet-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-400 mb-0.5">Email Address</p>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      {lead.email}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-400 mb-0.5">Budget Range</p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{lead.budget}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-400 mb-0.5">Submitted</p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {formatDate(lead.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Message — full, untruncated */}
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-pink-500" />
                    </div>
                    <p className="text-xs font-medium text-zinc-400">Message</p>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-700">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                      {lead.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
                Lead ID: <span className="font-mono">{lead._id}</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
