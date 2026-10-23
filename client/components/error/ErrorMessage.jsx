import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, WifiOff, Clock } from 'lucide-react';
import Button from '../common/Button.jsx';

function getErrorMeta(message) {
  const lower = (message || '').toLowerCase();

  if (!navigator.onLine) {
    return {
      icon: WifiOff,
      title: 'No internet connection',
      description: 'Please check your connection and try again.',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
    };
  }

  if (lower.includes('rate limit') || lower.includes('quota') || lower.includes('429') || lower.includes('too many') || lower.includes('⏳')) {
    return {
      icon: Clock,
      title: 'Rate limit reached',
      description: 'Free tier allows 15 requests/minute. Please wait 1–2 minutes and try again.',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
    };
  }

  if (lower.includes('timed out') || lower.includes('timeout')) {
    return {
      icon: Clock,
      title: 'Request timed out',
      description: 'The AI took too long to respond. Please try again.',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
    };
  }

  if (lower.includes('api key') || lower.includes('401') || lower.includes('403')) {
    return {
      icon: AlertTriangle,
      title: 'API key issue',
      description: 'Check your GEMINI_API_KEY in .env and restart the server.',
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-800',
    };
  }

  return {
    icon: AlertTriangle,
    title: 'Generation failed',
    description: null, // show raw message for other errors
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
  };
}

export default function ErrorMessage({ message, onRetry, className = '' }) {
  const meta = getErrorMeta(message);
  const Icon = meta.icon;

  // Clean up emoji/symbols from message for display
  const cleanMessage = (message || '')
    .replace(/^(?:⏳|⚠️|❌|✅|🌍|📡|🔑)\s*/u, '')
    .trim();

  const displayText = meta.description || cleanMessage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border ${meta.bg} ${meta.border} p-5 flex flex-col items-center text-center gap-3 ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-surface-900 flex items-center justify-center shadow-sm">
        <Icon className={`w-5 h-5 ${meta.color}`} />
      </div>

      <div>
        <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1">
          {meta.title}
        </p>
        <p className="text-xs text-surface-500 dark:text-surface-400 max-w-xs leading-relaxed">
          {displayText}
        </p>
      </div>

      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5" /> Try again
        </Button>
      )}
    </motion.div>
  );
}
