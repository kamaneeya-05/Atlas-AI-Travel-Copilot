import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  LayoutDashboard,
  Plus,
  History,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme.js';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trip/new', label: 'New Trip', icon: Plus },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function Navbar({ variant = 'app' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const isActive = (to) => location.pathname === to;

  const ThemeIcon = themeOptions.find((t) => t.value === theme)?.icon || Monitor;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || variant === 'app'
          ? 'bg-white/90 dark:bg-surface-950/90 backdrop-blur-lg border-b border-surface-200/60 dark:border-surface-800/60 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="gradient-text">ATLAS</span>
              <span className="text-surface-700 dark:text-surface-300 font-medium ml-1">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {variant === 'landing' ? (
              <>
                <a href="#features" className="btn-ghost text-sm">Features</a>
                <a href="#how-it-works" className="btn-ghost text-sm">How it works</a>
                <a href="#faq" className="btn-ghost text-sm">FAQ</a>
              </>
            ) : (
              navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme picker */}
            <div className="relative">
              <button
                onClick={() => setThemeOpen(!themeOpen)}
                className="btn-ghost p-2 rounded-lg"
                aria-label="Toggle theme"
              >
                <ThemeIcon className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {themeOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-36 glass-card p-1 shadow-card z-50"
                    onMouseLeave={() => setThemeOpen(false)}
                  >
                    {themeOptions.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => { setTheme(value); setThemeOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                          theme === value
                            ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-medium'
                            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {variant === 'landing' ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary hidden md:inline-flex"
              >
                Get Started
              </button>
            ) : (
              <button
                onClick={() => navigate('/trip/new')}
                className="btn-primary hidden md:inline-flex"
              >
                <Plus className="w-4 h-4" />
                New Trip
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden btn-ghost p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 overflow-hidden"
          >
            <div className="page-container py-4 flex flex-col gap-1">
              {variant === 'landing' ? (
                <>
                  <a href="#features" className="btn-ghost justify-start">Features</a>
                  <a href="#how-it-works" className="btn-ghost justify-start">How it works</a>
                  <a href="#faq" className="btn-ghost justify-start">FAQ</a>
                  <button onClick={() => navigate('/dashboard')} className="btn-primary mt-2">
                    Get Started
                  </button>
                </>
              ) : (
                <>
                  {navLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive(to)
                          ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                          : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  ))}
                  <button onClick={() => navigate('/trip/new')} className="btn-primary mt-2">
                    <Plus className="w-4 h-4" /> New Trip
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
