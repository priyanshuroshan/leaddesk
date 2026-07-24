import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-gradient flex items-center justify-center">
              <Zap className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              Lead<span className="text-brand-600">Desk</span> Mini
            </span>
          </div>

          {/* Attribution */}
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
            Built for{' '}
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 underline underline-offset-2 transition-colors"
            >
              Digital Heroes
            </a>{' '}
            Training Task - by Priyanshu
          </p>

          {/* Copyright */}
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} LeadDesk Mini
          </p>
        </div>
      </div>
    </footer>
  );
}
