import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { sosService } from "../services/firestore";
import { SOSEvent } from "../types";
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertOctagon, 
  RotateCcw,
  ExternalLink
} from "lucide-react";
import { motion } from "motion/react";

export const SOSHistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [sosLogs, setSosLogs] = useState<SOSEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSOSLogs = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await sosService.getSOSHistory(currentUser.uid);
      setSosLogs(data);
    } catch (err) {
      console.error("Error loading SOS history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSOSLogs();
  }, [currentUser]);

  const handleResolve = async (id: string) => {
    if (!window.confirm("Are you sure you want to mark this SOS alert as resolved?")) return;
    try {
      await sosService.resolveSOS(id);
      setSosLogs(prev => prev.map(s => s.id === id ? { ...s, status: "resolved" } : s));
    } catch (err) {
      console.error("Error resolving SOS alert:", err);
    }
  };

  return (
    <div id="sos-history-page" className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
          Emergency SOS History
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Historical log of emergency alerts triggered on your account.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading SOS log...</div>
      ) : sosLogs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/20 dark:border-slate-800 p-8">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 animate-pulse" />
          <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg">No Emergencies Triggered</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mt-1">
            Excellent! Your account has not registered any active SOS distress alerts.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sosLogs.map((log) => (
            <motion.div
              layout
              key={log.id}
              className={`p-5 bg-white dark:bg-card-dark rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                log.status === "active" 
                  ? "border-l-4 border-l-red-500 border-y border-r border-red-100 dark:border-red-950/40" 
                  : "border-l-4 border-l-slate-300 border-y border-r border-pink-50/40 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${
                  log.status === "active" 
                    ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 animate-pulse" 
                    : "bg-slate-100 text-slate-500 dark:bg-slate-900"
                }`}>
                  <AlertOctagon className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-extrabold text-slate-900 dark:text-white text-base">
                      SOS Emergency Beacon
                    </h3>
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                      log.status === "active" 
                        ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400" 
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-pink-400" />
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-pink-400" />
                      Lat: {log.location.lat.toFixed(5)}, Lng: {log.location.lng.toFixed(5)}
                    </span>
                  </div>

                  {log.location.accuracy && (
                    <p className="text-[10px] text-slate-400 font-medium">
                      GPS Accuracy Radius: ~{log.location.accuracy.toFixed(0)} meters
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                {/* External map helper */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${log.location.lat},${log.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all border border-pink-50/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View on Google Maps
                </a>

                {log.status === "active" && (
                  <button
                    id={`resolve-sos-btn-${log.id}`}
                    onClick={() => handleResolve(log.id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm cursor-pointer transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Resolve Safety
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
