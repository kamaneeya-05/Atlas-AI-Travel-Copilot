import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Calendar, IndianRupee, CheckSquare,
  UtensilsCrossed, Shield, ArrowRight, Star, ChevronDown,
  Globe, Zap, Brain, Users, Quote,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Button from '../components/common/Button.jsx';

// ─── Animation Variants ────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Data ──────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain, color: 'brand', title: 'AI-Powered Planning',
    desc: 'Describe your dream trip in plain language. Atlas AI understands context, preferences, and budget to craft a perfect itinerary.',
  },
  {
    icon: Calendar, color: 'emerald', title: 'Day-by-Day Itinerary',
    desc: 'Get a detailed timeline for every day of your trip, with times, locations, costs, and tips for each activity.',
  },
  {
    icon: IndianRupee, color: 'amber', title: 'Smart Budget Breakdown',
    desc: 'Transparent cost estimates for accommodation, food, transport, and activities with money-saving tips built in.',
  },
  {
    icon: UtensilsCrossed, color: 'orange', title: 'Restaurant Picks',
    desc: 'AI-curated local dining recommendations from hidden gems to must-try classics, filtered by your budget and taste.',
  },
  {
    icon: CheckSquare, color: 'accent', title: 'Packing Checklist',
    desc: 'Never forget essentials again. Auto-generated packing lists tailored to your destination, duration, and activities.',
  },
  {
    icon: Shield, color: 'red', title: 'Travel Warnings',
    desc: 'Stay informed with real-time safety notices, local advisories, and practical warnings specific to your destination.',
  },
];

const steps = [
  { step: '01', title: 'Describe Your Trip', desc: 'Type your dream trip in natural language — destination, duration, vibe, budget. As little or as much detail as you want.' },
  { step: '02', title: 'AI Crafts Your Plan', desc: 'Atlas AI analyzes your request and generates a complete, personalized itinerary in seconds using Gemini AI.' },
  { step: '03', title: 'Explore & Customize', desc: 'Browse your day-by-day plan, budget breakdown, restaurant picks, and packing list. Export or share with travel companions.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Solo Traveler, Mumbai', avatar: 'PS', rating: 5, text: 'Atlas AI planned my entire Rajasthan trip in under a minute — Jaipur, Jodhpur, Udaipur with the perfect budget breakdown in rupees. Saved me hours of research!' },
  { name: 'Rahul & Sneha', role: 'Couple, Bangalore', avatar: 'RS', rating: 5, text: 'Used it for our Goa anniversary trip. It suggested hidden beach shacks, gave us a day-by-day plan, and even the packing checklist. Absolutely loved it!' },
  { name: 'Amit Verma', role: 'Family Traveler, Delhi', avatar: 'AV', rating: 5, text: 'Planned our Kerala backwater trip for 4 people with kids. The AI gave us realistic INR estimates and kid-friendly restaurant picks. Brilliant tool!' },
];

const faqs = [
  { q: 'How does Atlas AI generate itineraries?', a: 'Atlas AI uses Google\'s Gemini AI model to understand your travel request and generate a structured, detailed itinerary including timeline, budget, restaurants, packing checklist, and travel warnings.' },
  { q: 'Is my data saved?', a: 'Your trips are saved locally in your browser\'s storage. No account needed. You can access, duplicate, or delete your trips any time from the History page.' },
  { q: 'Can I customize the generated itinerary?', a: 'Yes. After generation you can add notes, reorder days, mark checklist items, and export the full plan to PDF or copy it to clipboard.' },
  { q: 'How accurate is the AI-generated content?', a: 'Atlas AI provides well-researched suggestions based on general travel knowledge. We recommend verifying opening hours, prices, and safety advisories with official sources before travel.' },
  { q: 'Is Atlas AI free to use?', a: 'Atlas AI is free to use. You just need to provide your own Gemini API key in the configuration. See the README for setup instructions.' },
];

const colorMap = {
  brand: { bg: 'bg-brand-100 dark:bg-brand-950/60', icon: 'text-brand-600 dark:text-brand-400' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-950/60', icon: 'text-emerald-600 dark:text-emerald-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-950/60', icon: 'text-amber-600 dark:text-amber-400' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-950/60', icon: 'text-orange-600 dark:text-orange-400' },
  accent: { bg: 'bg-accent-100 dark:bg-accent-950/60', icon: 'text-accent-600 dark:text-accent-400' },
  red: { bg: 'bg-red-100 dark:bg-red-950/60', icon: 'text-red-600 dark:text-red-400' },
};

// ─── Sections ──────────────────────────────────────────────────────────────

function HeroSection({ onGetStarted }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-12 px-4">
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-400/20 dark:bg-brand-600/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-accent-400/20 dark:bg-accent-600/10 rounded-full blur-3xl animate-blob animation-delay-200" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[40rem] h-64 bg-brand-300/10 dark:bg-brand-700/10 rounded-full blur-3xl animate-blob animation-delay-400" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">Powered by Grok AI</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-surface-900 dark:text-white mb-6 leading-[1.08]"
        >
          Plan your perfect trip{' '}
          <span className="gradient-text">with AI</span>
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="text-lg sm:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Describe your dream vacation and get a complete itinerary, budget breakdown, restaurant picks, and packing list in seconds.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <Button variant="primary" size="xl" onClick={onGetStarted} className="shadow-glow hover:shadow-glow-lg">
            <Sparkles className="w-5 h-5" /> Start Planning for Free
          </Button>
          <Button variant="secondary" size="xl" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
            See how it works <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="flex items-center justify-center gap-6 text-sm text-surface-500 dark:text-surface-400"
        >
          <span className="flex items-center gap-1.5">
            <span className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
            </span>
            4.9/5 rating
          </span>
          <span className="w-px h-4 bg-surface-200 dark:bg-surface-700" />
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> 10k+ trips planned
          </span>
          <span className="w-px h-4 bg-surface-200 dark:bg-surface-700" />
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-brand-500" /> Ready in seconds
          </span>
        </motion.div>
      </div>

      {/* Hero prompt demo card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl mx-auto mt-14 px-4"
      >
        <div className="glass-card p-6 shadow-glow-lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 bg-surface-50 dark:bg-surface-800/60 rounded-xl px-4 py-3 text-sm text-surface-500 dark:text-surface-400 italic border border-surface-200 dark:border-surface-700">
            &quot;5 days in Goa for a couple. We love beaches, seafood, and sunsets. Mid-range budget around ₹40,000.&quot;
            </div>
          </div>
          <div className="space-y-2 pl-11">
            {['✅ Day-by-day itinerary generated', '💰 Budget breakdown: ~₹40,000 total', '🍽️ 10 restaurant recommendations', '🎒 Packing checklist created'].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.15 }}
                className="text-sm text-surface-700 dark:text-surface-300 flex items-center gap-2"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-surface-300 dark:text-surface-600"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="section-spacing bg-surface-50/60 dark:bg-surface-900/40">
      <div className="page-container">
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14"
        >
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-3">
            <Zap className="w-3.5 h-3.5" /> Features
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            Everything you need to plan{' '}
            <span className="gradient-text">any trip</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-surface-500 dark:text-surface-400 max-w-xl mx-auto">
            From spontaneous weekend getaways to meticulously planned world tours, Atlas AI handles every detail.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => {
            const scheme = colorMap[f.color];
            return (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl ${scheme.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${scheme.icon}`} />
                </div>
                <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100 mb-2">{f.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-spacing">
      <div className="page-container">
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14"
        >
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">
            <Brain className="w-3.5 h-3.5" /> How It Works
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            From idea to itinerary in{' '}
            <span className="gradient-text">3 steps</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-surface-500 dark:text-surface-400 max-w-xl mx-auto">
            No sign-up required. Just describe your trip and let Atlas AI do the heavy lifting.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-gradient-to-r from-brand-300 to-transparent dark:from-brand-700" />
              )}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg text-white text-2xl font-black mb-5 shadow-glow">
                {s.step}
              </div>
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 mb-2">{s.title}</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="section-spacing bg-surface-50/60 dark:bg-surface-900/40">
      <div className="page-container">
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14"
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            Loved by travelers{' '}
            <span className="gradient-text">worldwide</span>
          </motion.h2>
        </motion.div>
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-soft"
            >
              <Quote className="w-6 h-6 text-brand-300 dark:text-brand-700 mb-3" />
              <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{t.name}</p>
                  <p className="text-xs text-surface-400 dark:text-surface-500">{t.role}</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="section-spacing">
      <div className="page-container max-w-3xl">
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14"
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            Frequently asked{' '}
            <span className="gradient-text">questions</span>
          </motion.h2>
        </motion.div>
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <motion.details
              key={i}
              variants={fadeUp}
              className="group rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none font-semibold text-sm text-surface-800 dark:text-surface-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors select-none">
                {faq.q}
                <ChevronDown className="w-4 h-4 text-surface-400 group-open:rotate-180 transition-transform duration-200 shrink-0" />
              </summary>
              <div className="px-5 pb-4 text-sm text-surface-500 dark:text-surface-400 leading-relaxed border-t border-surface-100 dark:border-surface-800 pt-3">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection({ onGetStarted }) {
  return (
    <section className="section-spacing">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl gradient-bg p-12 text-center overflow-hidden shadow-glow-lg"
        >
          {/* Background blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-400/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 mb-5">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Your next adventure starts here
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto text-base">
              Join thousands of travelers who plan smarter with Atlas AI. Free, fast, and incredibly detailed.
            </p>
            <Button
              variant="outline"
              size="xl"
              onClick={onGetStarted}
              className="bg-white text-brand-600 border-white hover:bg-brand-50 hover:border-white font-bold shadow-lg"
            >
              <Sparkles className="w-5 h-5" /> Plan My Trip Now
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/trip/new');

  return (
    <div className="min-h-screen">
      <Navbar variant="landing" />
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
}
