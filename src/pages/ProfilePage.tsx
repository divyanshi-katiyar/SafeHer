import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  User, 
  Phone, 
  Mail, 
  Heart, 
  MapPin, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Camera,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";

export const ProfilePage: React.FC = () => {
  const { userProfile, updateProfileData } = useAuth();

  const [name, setName] = useState(userProfile?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || "");
  const [bloodGroup, setBloodGroup] = useState(userProfile?.bloodGroup || "");
  const [emergencyInfo, setEmergencyInfo] = useState(userProfile?.emergencyInfo || "");
  const [address, setAddress] = useState(userProfile?.address || "");
  const [medicalNotes, setMedicalNotes] = useState(userProfile?.medicalNotes || "");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150&h=150",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  ];

  const handleUpdateAvatar = async (url: string) => {
    try {
      await updateProfileData({ photoURL: url });
      setMessage("Profile avatar updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update photo.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await updateProfileData({
        name,
        phoneNumber,
        bloodGroup,
        emergencyInfo,
        address,
        medicalNotes
      });
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      console.error("Profile save failed:", err);
      setError(err.message || "Failed to update profile details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="profile-page" className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
          My Safety Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Set up critical health details and medical notes. First responders can access this in case of emergency.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar selection */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-sm text-center space-y-6">
            <h2 className="text-base font-display font-bold text-slate-900 dark:text-white">
              Profile Avatar
            </h2>

            <div className="relative inline-block">
              <img
                src={userProfile?.photoURL || avatars[0]}
                alt="Profile Avatar"
                className="w-32 h-32 rounded-3xl object-cover mx-auto border-4 border-pink-100"
              />
              <div className="absolute -bottom-1 -right-1 p-2 bg-accent text-white rounded-xl shadow-md pink-glow">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Choose Avatar Preset</p>
              <div className="flex justify-center gap-3">
                {avatars.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUpdateAvatar(url)}
                    className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      userProfile?.photoURL === url ? "border-accent scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-pink-50/50 dark:border-slate-800/40 text-left space-y-2 text-xs text-slate-500">
              <p className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Account Verified
              </p>
              <p>Email: <strong className="font-mono">{userProfile?.email}</strong></p>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Edit Profile Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-sm">
            <form onSubmit={handleSave} className="space-y-6">
              {message && (
                <div className="p-4 bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 rounded-r-xl flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-r-xl flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-pink-400" /> Full Name
                  </label>
                  <input
                    id="profile-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-pink-400" /> Phone Number
                  </label>
                  <input
                    id="profile-phone-input"
                    type="tel"
                    placeholder="E.g., +1 (555) 012-3456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-pink-400" /> Blood Group
                  </label>
                  <select
                    id="profile-blood-input"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-pink-400" /> Address Location
                  </label>
                  <input
                    id="profile-address-input"
                    type="text"
                    placeholder="E.g., 100 Main St, Apt 4"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-pink-400" /> Emergency Instructions (Allergies, Family contacts)
                </label>
                <textarea
                  id="profile-emergency-input"
                  placeholder="Allergies, asthma triggers, family phone numbers..."
                  value={emergencyInfo}
                  onChange={(e) => setEmergencyInfo(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-pink-400" /> Medical Notes / Conditions
                </label>
                <textarea
                  id="profile-medical-input"
                  placeholder="E.g., Asthmatic, carries inhaler. Penicillin allergy."
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none focus:outline-none"
                />
              </div>

              <button
                id="profile-save-btn"
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl shadow-md transition-all pink-glow cursor-pointer disabled:opacity-50"
              >
                {saving ? "Saving changes..." : "Save Safety Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
