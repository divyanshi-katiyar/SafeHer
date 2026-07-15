import React from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  MapPin, 
  Users, 
  BellRing, 
  Navigation, 
  Heart, 
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Menu,
  Sun,
  Moon,
  AlertCircle,
  BookOpen
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();

  return (
    <div id="landing-container" className="min-h-screen bg-bg-light dark:bg-bg-dark text-slate-800 dark:text-slate-200 transition-colors duration-300 overflow-x-hidden">
      {/* Public Header/Navbar */}
      <nav id="landing-nav" className="sticky top-0 z-50 h-16 bg-white/70 dark:bg-bg-dark/70 backdrop-blur-md border-b border-pink-50 dark:border-slate-800/40 px-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-accent text-white pink-glow">
            <Shield className="w-5.5 h-5.5" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-accent dark:text-pink-400">
            SafeHer
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Switch */}
          <button
            id="landing-theme-toggle"
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-pink-400 rounded-xl hover:bg-pink-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {currentUser ? (
            <Link
              id="landing-go-dashboard-btn"
              to="/dashboard"
              className="flex items-center gap-1 px-4 py-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-full text-sm shadow-md transition-all pink-glow"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                id="landing-login-link"
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-accent dark:text-slate-300 dark:hover:text-pink-400 transition-colors"
              >
                Log In
              </Link>
              <Link
                id="landing-signup-link"
                to="/register"
                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-full text-sm shadow-md transition-all pink-glow"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header id="landing-hero" className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Visual background gradient accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-300/10 dark:bg-pink-900/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex-1 space-y-6 text-center lg:text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/40 text-accent dark:text-pink-400 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" /> Empowering Her Safety, Everywhere
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white"
          >
            Your Ultimate Companion for <br />
            <span className="bg-gradient-to-r from-accent to-pink-500 bg-clip-text text-transparent">
              Peace of Mind
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0"
          >
            SafeHer is a beautiful, intuitive, and modern women's safety platform. Track your journeys in real-time, alert loved ones instantly with emergency SOS, and stay informed with community safety features.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <Link
              id="hero-get-started-btn"
              to="/register"
              className="px-8 py-3.5 bg-accent hover:bg-accent/95 text-white font-bold rounded-2xl shadow-lg transition-all pink-glow flex items-center gap-2"
            >
              Get Started for Free <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              id="hero-explore-tips-btn"
              to="/login"
              className="px-6 py-3.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-pink-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl shadow-sm transition-all"
            >
              Try Demo Layout
            </Link>
          </motion.div>
        </div>

        {/* Premium Illustration / Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex-1 w-full max-w-lg lg:max-w-none"
        >
          <div className="relative p-2 rounded-[32px] bg-gradient-to-tr from-pink-200 to-accent/30 dark:from-pink-950/20 dark:to-accent/10 shadow-2xl overflow-hidden border border-white/20">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
              alt="SafeHer Safety App Hero Illustration"
              className="w-full h-[400px] object-cover rounded-[24px] shadow-inner"
            />
            {/* Overlay interactive detail card */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 dark:bg-card-dark/95 backdrop-blur-md shadow-xl border border-pink-100/30 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-500 text-white animate-pulse">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">SOS Active Tracking</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Emergency dispatch simulator running</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-red-500 bg-red-100 dark:bg-red-950/50 px-2.5 py-1 rounded-full">
                LIVE
              </span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Features Grid */}
      <section id="landing-features" className="py-20 bg-pink-50/20 dark:bg-slate-900/10 border-y border-pink-100/30 dark:border-slate-800/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-extrabold text-accent dark:text-pink-400 uppercase tracking-wider">Features</h2>
            <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">
              Designed with Ultimate Safety in Mind
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              SafeHer provides advanced, easy-to-use utility modules that ensure high safety status and continuous support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-white dark:bg-card-dark rounded-2xl border border-pink-100/50 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-950/40 text-accent dark:text-pink-400 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">One-Tap Emergency SOS</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A massive floating SOS alarm button triggers an instant alert, logs coordinates, and sends simulated notifications to all contacts instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white dark:bg-card-dark rounded-2xl border border-pink-100/50 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-950/40 text-accent dark:text-pink-400 flex items-center justify-center">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Journey Tracker</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Set source, destination, and expected arrival times. Stay monitored with safety counts and check-in reminders.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white dark:bg-card-dark rounded-2xl border border-pink-100/50 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-950/40 text-accent dark:text-pink-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Emergency Contacts</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your primary trusted network. Search, add, edit, or delete guardians who will receive real-time updates.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white dark:bg-card-dark rounded-2xl border border-pink-100/50 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-950/40 text-accent dark:text-pink-400 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Incident Reporting</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Report local community safety issues with descriptions, categories, geolocation, and secure image uploads.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-white dark:bg-card-dark rounded-2xl border border-pink-100/50 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-950/40 text-accent dark:text-pink-400 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nearby Help Finder</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Instantly track police stations, hospitals, and pharmacies near your location on an elegant interactive guide map.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-white dark:bg-card-dark rounded-2xl border border-pink-100/50 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-950/40 text-accent dark:text-pink-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Knowledge Base & Tips</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Access curated safe-defense tip modules, public travel guidelines, and critical helpline databases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="landing-testimonials" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-extrabold text-accent dark:text-pink-400 uppercase tracking-wider">Testimonials</h2>
          <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">Loved by Thousands of Women</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-card-dark rounded-2xl border border-pink-50 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex gap-1 text-accent">
              {"★".repeat(5)}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              \"SafeHer is an absolute game-changer. The floating SOS button and the beautiful dark mode make me feel safe during late-night commutes back from office. Incredible design!\"
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
                alt="Aria"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Aria Sharma</p>
                <p className="text-xs text-slate-400">Software Engineer</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-card-dark rounded-2xl border border-pink-50 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex gap-1 text-accent">
              {"★".repeat(5)}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              \"I love the Journey Tracker module. Being able to set expected times and have my guardians check on me gives me and my family total peace of mind. Highly recommend SafeHer!\"
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100"
                alt="Elena"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Elena Rostova</p>
                <p className="text-xs text-slate-400">Graduate Student</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-card-dark rounded-2xl border border-pink-50 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex gap-1 text-accent">
              {"★".repeat(5)}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              \"The UI is incredibly beautiful and fluid. It works flawlessly on both my phone and iPad. Reporting community incidents is quick, simple, and transparent.\"
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=100&h=100"
                alt="Maya"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Maya Patel</p>
                <p className="text-xs text-slate-400">Product Manager</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="landing-cta" className="py-20 relative px-6 max-w-5xl mx-auto text-center">
        <div className="absolute inset-0 bg-accent/5 dark:bg-accent/2 blur-2xl rounded-full" />
        <div className="relative z-10 p-12 bg-white dark:bg-card-dark rounded-[32px] border border-pink-100 dark:border-slate-800 shadow-xl space-y-6">
          <Heart className="w-12 h-12 text-accent mx-auto animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
            Take Control of Your Safety Today
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Join thousands of women who rely on SafeHer to stay safe, secure, and confident every day. Set up your emergency circles in seconds.
          </p>
          <div className="flex justify-center pt-2">
            <Link
              id="cta-join-now-btn"
              to="/register"
              className="px-8 py-4 bg-accent hover:bg-accent/95 text-white font-bold rounded-2xl shadow-lg transition-all pink-glow"
            >
              Get SafeHer Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="landing-footer" className="bg-white dark:bg-card-dark border-t border-pink-50 dark:border-slate-800/40 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-accent text-white">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-accent dark:text-pink-400">
              SafeHer
            </span>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} SafeHer Inc. All rights reserved. Designed with ❤️ for women safety.
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <a href="#" className="hover:text-accent">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-accent">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-accent">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
