import { motion } from 'framer-motion';
import {
  Globe, ExternalLink, RefreshCw, CheckCircle2,
  Copy, Sparkles, AlertTriangle, Key, Terminal, Zap,
} from 'lucide-react';
import { useApiKey } from '../../context/ApiKeyContext.jsx';
import { useClipboard } from '../../hooks/useClipboard.js';

export default function ApiKeySetup() {
  const { message, checking, recheckHealth } = useApiKey();
  const { copied, copy } = useClipboard();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-50 dark:bg-surface-950">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl animate-blob animation-delay-400" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-glow mb-3"
          >
            <Globe className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-2xl font-extrabold gradient-text">ATLAS AI</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5 flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-brand-500" />
            Powered by Groq AI · India 🇮🇳
          </p>
        </div>

        <div className="rounded-3xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-card p-6 sm:p-8 space-y-5">

          {/* Info banner */}
          <div className="rounded-2xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-brand-700 dark:text-brand-400 mb-0.5">
                Groq API Key Required
              </p>
              <p className="text-xs text-brand-600 dark:text-brand-400 leading-relaxed">
                Set up takes 2 minutes and is completely free. Groq gives you fast, reliable AI with a generous free tier.
              </p>
            </div>
          </div>

          {/* Step 1 */}
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">1</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1">
                Create a FREE Groq account & get API key
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed mb-2">
            Go to Groq Console → Sign up with Google → Click <strong>&quot;API Keys&quot;</strong> in the left sidebar → Click <strong>&quot;Create API Key&quot;</strong> → Copy the key.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                  Open Groq Console
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-xs text-surface-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Key starts with <code className="font-mono bg-surface-100 dark:bg-surface-800 px-1 rounded ml-1">gsk_</code>
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-surface-100 dark:border-surface-800" />

          {/* Step 2 */}
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">2</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1">
                Add key to <code className="text-brand-600 dark:text-brand-400 font-mono text-xs">e:\Flam\.env</code>
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-2">
                Open the <code className="font-mono bg-surface-100 dark:bg-surface-800 px-1 rounded">.env</code> file in VS Code and set:
              </p>
              <div className="group relative rounded-xl bg-surface-900 dark:bg-surface-950 border border-surface-700 p-3">
                <p className="text-xs font-mono text-red-400 line-through mb-1 opacity-60">GROQ_API_KEY=your_groq_api_key_here</p>
                <p className="text-xs font-mono text-emerald-400">GROQ_API_KEY=gsk_<span className="opacity-50">xxxxxxxxxxxxxxxxxxxx</span></p>
                <button
                  onClick={() => copy('GROQ_API_KEY=gsk_YOUR_KEY_HERE')}
                  className="absolute top-2 right-2 p-1 rounded text-surface-500 hover:text-white transition-colors"
                  title="Copy"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-surface-100 dark:border-surface-800" />

          {/* Step 3 */}
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">3</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1">
                Restart the server
              </p>
              <div className="flex items-center gap-2 rounded-xl bg-surface-900 dark:bg-surface-950 border border-surface-700 px-3 py-2.5">
                <Terminal className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <code className="text-xs text-emerald-400 font-mono flex-1">npm run dev</code>
                <button onClick={() => copy('npm run dev')} className="text-surface-500 hover:text-white transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Check button */}
          <button
            onClick={recheckHealth}
            disabled={checking}
            className="btn-primary w-full"
          >
            {checking ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Checking…</>
            ) : (
              <><Sparkles className="w-4 h-4" /> I&apos;ve added my key — Check Again</>
            )}
          </button>

          {message && !checking && (
            <p className="text-center text-xs text-red-500 dark:text-red-400">{message}</p>
          )}

          <p className="text-center text-xs text-surface-400 dark:text-surface-500">
            🔒 Your key stays in <code className="font-mono">.env</code> only — never sent to any third party.
          </p>
        </div>

        {/* Groq advantages */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Ultra Fast', sub: '~3s response' },
            { label: 'Free Tier', sub: '14,400 req/day' },
            { label: 'Reliable', sub: '99.9% uptime' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-3">
              <p className="text-xs font-bold text-surface-800 dark:text-surface-200">{item.label}</p>
              <p className="text-xs text-surface-400 dark:text-surface-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
