import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { incidentService, notificationService } from "../services/firestore";
import { Incident } from "../types";
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Clock, 
  Plus, 
  X, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const IncidentPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Report State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Harassment");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [selectedImage, setSelectedImage] = useState("https://images.unsplash.com/photo-1504151932400-72d425550d2d?auto=format&fit=crop&q=80&w=300"); // Default safety/caution image
  const [customAddress, setCustomAddress] = useState("");

  const categories = [
    "Harassment",
    "Poor Lighting",
    "Suspicious Activity",
    "Robbery/Theft",
    "Stalking",
    "Physical Danger",
    "Other"
  ];

  const presets = [
    { title: "Caution Area", url: "https://images.unsplash.com/photo-1504151932400-72d425550d2d?auto=format&fit=crop&q=80&w=300" },
    { title: "Poor Lighting Street", url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=300" },
    { title: "Crowded Subway", url: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&q=80&w=300" },
    { title: "General Safety Alert", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300" }
  ];

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await incidentService.getIncidents();
      setIncidents(data);
    } catch (err) {
      console.error("Error loading incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleOpenReportModal = () => {
    setTitle("");
    setCategory("Harassment");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setTime(new Date().toTimeString().slice(0, 5));
    setCustomAddress("");
    setSelectedImage(presets[0].url);
    setError(null);
    setIsModalOpen(true);
  };

  const handleReportIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!title || !description || !date || !time) {
      setError("Please complete all required fields.");
      return;
    }

    setError(null);
    let lat = 37.7749;
    let lng = -122.4194;
    let finalAddress = customAddress || "Current Captured Location";

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          await saveIncident(lat, lng, finalAddress);
        },
        async () => {
          await saveIncident(lat, lng, finalAddress);
        }
      );
    } else {
      await saveIncident(lat, lng, finalAddress);
    }
  };

  const saveIncident = async (lat: number, lng: number, address: string) => {
    try {
      await incidentService.reportIncident({
        userId: currentUser!.uid,
        title,
        category,
        description,
        date,
        time,
        imageURL: selectedImage,
        location: { lat, lng, address }
      });

      // Add Notification
      await notificationService.addNotification({
        userId: currentUser!.uid,
        title: "Community Alert Reported",
        message: `Your report on '${title}' has been logged. Thank you for contributing to community safety!`,
        type: "incident",
        read: false
      });

      setIsModalOpen(false);
      loadIncidents();
    } catch (err: any) {
      setError(err.message || "Failed to save incident report.");
    }
  };

  return (
    <div id="incident-page" className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
            Community Incident Board
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Report local safety hazards or dangerous zones to warn the community and raise active awareness.
          </p>
        </div>

        <button
          id="report-incident-modal-trigger"
          onClick={handleOpenReportModal}
          className="px-5 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl shadow-md transition-all pink-glow flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-5 h-5" /> Report Incident
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading incidents...</div>
      ) : incidents.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/20 dark:border-slate-800 p-8">
          <HelpCircle className="w-12 h-12 text-pink-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg">No Incidents Reported</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mt-1">
            Be the first to report local issues, poorly lit streets, or suspicious presence.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full">
                  <img
                    src={incident.imageURL || presets[0].url}
                    alt={incident.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-card-dark/90 backdrop-blur-md rounded-full text-[10px] font-bold text-accent uppercase tracking-wider shadow-sm">
                    {incident.category}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-display font-extrabold text-slate-950 dark:text-white text-lg truncate">
                    {incident.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                    {incident.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-2.5">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <span>{incident.date} at {incident.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-pink-500" />
                    <span className="truncate">{incident.location.address || "Captured Area"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Dialog Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div id="incident-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              id="incident-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-2xl space-y-5 my-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-accent animate-bounce" /> Report Safe Alert
                </h2>
                <button
                  id="close-incident-modal-btn"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleReportIncident} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Incident Title
                  </label>
                  <input
                    id="incident-title-input"
                    type="text"
                    placeholder="E.g., Poor lighting near Central Station"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Category
                    </label>
                    <select
                      id="incident-category-input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Location / Landmark
                    </label>
                    <input
                      id="incident-address-input"
                      type="text"
                      placeholder="E.g., 5th Ave Subway"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-pink-400" /> Date
                    </label>
                    <input
                      id="incident-date-input"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-pink-400" /> Time
                    </label>
                    <input
                      id="incident-time-input"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    id="incident-desc-input"
                    placeholder="Provide safety hazard details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                    required
                  />
                </div>

                {/* Cover Image Preset Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-pink-400" /> Select Cover Alert Photo
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {presets.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(p.url)}
                        className={`relative h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedImage === p.url ? "border-accent scale-95 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        title={p.title}
                      >
                        <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    id="incident-submit-btn"
                    type="submit"
                    className="flex-1 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl shadow-md transition-all pink-glow cursor-pointer"
                  >
                    Submit Alert Report
                  </button>
                  <button
                    id="incident-cancel-btn"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
