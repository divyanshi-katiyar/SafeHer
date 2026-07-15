import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Mail, Lock, AlertCircle, ArrowLeft, Sun, Moon } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failure:", err);
      setError(err.message || "Invalid credentials or login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Google login failure:", err);
      setError(err.message || "Google Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-page" className="min-h-screen bg-bg-light dark:bg-bg-dark text-slate-800 dark:text-slate-200 flex flex-col justify-center items-center p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative gradient rings */}
      <div className="absolute top-[-100px] right-[-100px] w-80 h-80 rounded-full bg-pink-100/50 dark:bg-pink-950/10 blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 rounded-full bg-accent/5 dark:bg-accent/2 blur-3xl" />

      {/* Top right control buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 text-slate-600 hover:text-accent dark:text-slate-300 dark:hover:text-pink-400 rounded-xl hover:bg-white dark:hover:bg-slate-800 shadow-sm border border-pink-50/50 dark:border-slate-800 transition-all cursor-pointer"
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <div className="w-full max-w-md z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-accent hover:underline mb-4 font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-accent text-white pink-glow shadow-md">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-4">
            Welcome to SafeHer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Log in to manage your safety dashboard and protect loved ones
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="login-email-input"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Password
                </label>
                <Link
                  id="forgot-password-link"
                  to="/forgot-password"
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="login-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  required
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-accent hover:bg-accent/95 text-white font-bold rounded-2xl shadow-md transition-all pink-glow cursor-pointer disabled:opacity-50"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Or Connect With
            </span>
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
          </div>

          <button
            id="login-google-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 border border-pink-100/50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-2xl flex items-center justify-center gap-3 font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.72 14.93 1 12 1 7.37 1 3.4 3.65 1.48 7.5l3.77 2.92C6.15 6.8 8.85 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.88 3.39-8.5z"
              />
              <path
                fill="#FBBC05"
                d="M5.25 14.58c-.24-.71-.37-1.47-.37-2.58s.13-1.87.37-2.58L1.48 6.5C.54 8.38 0 10.49 0 12.72s.54 4.34 1.48 6.22l3.77-2.92z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.66-2.84c-1.1.74-2.51 1.18-4.3 1.18-3.15 0-5.85-1.76-6.81-4.46L1.41 16.9C3.33 20.74 7.3 23.01 12 23z"
              />
            </svg>
            Continue with Google
          </button>
        </motion.div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          New to SafeHer?{" "}
          <Link id="login-register-link" to="/register" className="font-bold text-accent hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};
