import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Mail, AlertCircle, ArrowLeft, CheckCircle, Sun, Moon } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please specify your email.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await resetPassword(email);
      setSuccess("If that account exists, a password reset link has been sent to your email!");
    } catch (err: any) {
      console.error("Reset error:", err);
      setError(err.message || "Could not process password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="forgot-password-page" className="min-h-screen bg-bg-light dark:bg-bg-dark text-slate-800 dark:text-slate-200 flex flex-col justify-center items-center p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative gradient rings */}
      <div className="absolute top-[-100px] right-[-100px] w-80 h-80 rounded-full bg-pink-100/50 dark:bg-pink-950/10 blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 rounded-full bg-accent/5 dark:bg-accent/2 blur-3xl" />

      {/* Top Controls */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2.5 text-slate-600 hover:text-accent dark:text-slate-300 dark:hover:text-pink-400 rounded-xl hover:bg-white dark:hover:bg-slate-800 shadow-sm border border-pink-50/50 dark:border-slate-800 transition-all cursor-pointer"
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <div className="w-full max-w-md z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/login" className="inline-flex items-center gap-2 text-accent hover:underline mb-4 font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Log In
          </Link>
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-accent text-white pink-glow shadow-md">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-4">
            Reset Password
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Enter your email to receive a secure recovery code link
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-card-dark/80 backdrop-blur-md p-8 rounded-3xl border border-pink-100/40 dark:border-slate-800 shadow-xl space-y-6"
        >
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-r-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 rounded-r-xl flex items-start gap-3 text-sm">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="forgot-email-input"
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  required
                />
              </div>
            </div>

            <button
              id="forgot-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-accent hover:bg-accent/95 text-white font-bold rounded-2xl shadow-md transition-all pink-glow cursor-pointer disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
