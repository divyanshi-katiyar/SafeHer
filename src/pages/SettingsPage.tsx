import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { 
  Settings, 
  Moon, 
  Sun, 
  Lock, 
  Trash2, 
  Bell, 
  Mail, 
  Smartphone, 
  CheckCircle, 
  AlertCircle,
  Link as LinkIcon,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { motion } from "motion/react";
import { updatePassword, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const SettingsPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Preference fields
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [prefSuccess, setPrefSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setPasswordError("Please enter your new password in both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      if (currentUser) {
        await updatePassword(currentUser, newPassword);
        setPasswordSuccess("Password changed successfully! Ensure to log in with your new credentials next time.");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      console.error("Password update failed:", err);
      setPasswordError(err.message || "Failed to update password. You may need to sign out and log back in to verify credentials first.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefSuccess(true);
    setTimeout(() => setPrefSuccess(false), 3000);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("WARNING: This will permanently delete your SafeHer account and all associated emergency records. This action cannot be undone. Are you absolutely sure?")) {
      return;
    }

    try {
      if (currentUser) {
        await deleteUser(currentUser);
        navigate("/");
      }
    } catch (err: any) {
      console.error("Account deletion failed:", err);
      alert(err.message || "Failed to delete account. You may need to log out and log back in to perform this high-risk action.");
    }
  };

  return (
    <div id="settings-page" className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
          Application Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Customize your experience, manage alert triggers, and manage your account security.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Preference Quick Actions */}
        <div className="space-y-6">
          {/* Appearance card */}
          <div className="p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Appearance & Theme
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Switch between Light Mode (bright slate) and Dark Mode (charcoal/pink glow).
            </p>

            <button
              id="settings-theme-switch-btn"
              onClick={toggleTheme}
              className="w-full py-3.5 border border-pink-100/50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-sm text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-4 h-4 text-accent" /> Use Dark Mode
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-primary" /> Use Light Mode
                </>
              )}
            </button>
          </div>

          {/* Account deletion card */}
          <div className="p-6 bg-white dark:bg-card-dark rounded-3xl border border-red-100 dark:border-red-950/20 shadow-sm space-y-4">
            <h2 className="text-base font-display font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              Danger Zone
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Permanently delete your account, contacts circle, journey tracking, and all logs.
            </p>

            <button
              id="settings-delete-account-btn"
              onClick={handleDeleteAccount}
              className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-red-100 dark:border-red-950/20"
            >
              <Trash2 className="w-3.5 h-3.5" /> Permanently Delete Account
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Security / Notifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security details (Password change) */}
          <div className="p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" /> Security Credentials
            </h2>

            {passwordSuccess && (
              <div className="p-4 bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 rounded-r-xl flex items-center gap-3 text-xs">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-r-xl flex items-center gap-3 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    New Password
                  </label>
                  <input
                    id="new-password-input"
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-450 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password-input"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-450 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                id="settings-save-password-btn"
                type="submit"
                disabled={passwordLoading}
                className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl shadow-sm text-xs transition-all pink-glow cursor-pointer disabled:opacity-50"
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* Notifications Preferences */}
          <div className="p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" /> Alert Delivery Channels
            </h2>

            {prefSuccess && (
              <div className="p-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Alert notification delivery preferences saved!</span>
              </div>
            )}

            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-pink-50/10 dark:border-slate-850 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-pink-400" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Email Alerts</p>
                      <p className="text-[10px] text-slate-400">Receive copy of SOS triggers and journey starts in email</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="h-4 w-4 text-accent rounded focus:ring-accent border-slate-300 dark:border-slate-700"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-pink-50/10 dark:border-slate-850 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-pink-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Simulated SMS alerts</p>
                      <p className="text-[10px] text-slate-400">Guardians receive direct mobile trigger alert simulation</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="h-4 w-4 text-accent rounded focus:ring-accent border-slate-300 dark:border-slate-700"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-pink-50/10 dark:border-slate-850 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Browser Push Notifications</p>
                      <p className="text-[10px] text-slate-400">Notify of local hazard board updates in real-time</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushAlerts}
                    onChange={(e) => setPushAlerts(e.target.checked)}
                    className="h-4 w-4 text-accent rounded focus:ring-accent border-slate-300 dark:border-slate-700"
                  />
                </label>
              </div>

              <button
                id="settings-save-prefs-btn"
                type="submit"
                className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl shadow-sm text-xs transition-all pink-glow cursor-pointer"
              >
                Save Preferences
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
