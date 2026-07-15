import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { journeyService, notificationService } from "../services/firestore";
import { Journey } from "../types";
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Plus, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RotateCcw,
  History,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const JourneyPage: React.FC = () => {
  const { currentUser } = useAuth();

  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [activeJourneys, setActiveJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [eta, setEta] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadJourneys = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const all = await journeyService.getJourneys(currentUser.uid);
      setJourneys(all);
      setActiveJourneys(all.filter((j) => j.status === "active"));
    } catch (err) {
      console.error("Error loading journeys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourneys();
  }, [currentUser]);

  const handleStartJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!source || !destination || !eta) {
      setError("Please complete all required fields (Source, Destination, ETA).");
      return;
    }

    setError(null);
    try {
      await journeyService.startJourney({
        userId: currentUser.uid,
        source,
        destination,
        expectedArrivalTime: eta,
        notes
      });

      // Notify
      await notificationService.addNotification({
        userId: currentUser.uid,
        title: "Journey Started",
        message: `Your journey from ${source} to ${destination} is now being monitored. Expected arrival: ${eta}.`,
        type: "journey",
        read: false
      });

      // Clear Form fields
      setSource("");
      setDestination("");
      setEta("");
      setNotes("");

      // Refresh
      loadJourneys();
    } catch (err: any) {
      setError(err.message || "Failed to initiate journey.");
    }
  };

  const handleUpdateStatus = async (id: string, status: Journey["status"]) => {
    try {
      await journeyService.updateJourneyStatus(id, status);
      
      // Notify
      if (status === "completed") {
        await notificationService.addNotification({
          userId: currentUser!.uid,
          title: "Arrived Safely!",
          message: "You checked in as safely arrived at your destination.",
          type: "journey",
          read: false
        });
      }

      loadJourneys();
    } catch (err) {
      console.error("Error updating journey status:", err);
    }
  };

  return (
    <div id="journey-page" className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
          Journey Tracker
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Securely monitor your travel and commute routes. Your selected emergency contacts are simulated-notified of your progress.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Start Journey Form */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-accent" /> Start New Journey
            </h2>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleStartJourney} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" /> Source Location
                </label>
                <input
                  id="journey-source-input"
                  type="text"
                  placeholder="E.g., Office (123 Broadway St)"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-pink-500" /> Destination
                </label>
                <input
                  id="journey-destination-input"
                  type="text"
                  placeholder="E.g., Home (456 Maple Rd)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" /> Expected Arrival Time
                </label>
                <input
                  id="journey-eta-input"
                  type="text"
                  placeholder="E.g., 8:30 PM (or 25 minutes)"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-pink-400" /> Notes (Cab details, etc)
                </label>
                <textarea
                  id="journey-notes-input"
                  placeholder="E.g., Uber Plate #ABC-123, White Camry"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-pink-100/30 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                />
              </div>

              <button
                id="journey-start-btn"
                type="submit"
                className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl shadow-md transition-all pink-glow cursor-pointer"
              >
                Track Journey Active
              </button>
            </form>
          </div>
        </div>

        {/* Right 2 Columns: Active Journeys and History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Journeys section */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Active Journeys
            </h2>

            {loading ? (
              <div className="text-center py-6 text-slate-400">Loading active journeys...</div>
            ) : activeJourneys.length === 0 ? (
              <div className="p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/20 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
                No active journeys currently tracked. Start one to begin live safety monitoring.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {activeJourneys.map((j) => (
                  <div
                    key={j.id}
                    className="p-5 bg-white dark:bg-card-dark rounded-3xl border-l-4 border-l-blue-500 border-y border-r border-pink-100/30 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-100 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          ACTIVE
                        </span>
                        <h4 className="text-xs text-slate-400 pt-1">Commencing journey</h4>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          id={`complete-journey-btn-${j.id}`}
                          onClick={() => handleUpdateStatus(j.id, "completed")}
                          className="p-1.5 bg-green-100 hover:bg-green-200 dark:bg-green-950/40 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl cursor-pointer"
                          title="Arrived Safely"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          id={`cancel-journey-btn-${j.id}`}
                          onClick={() => handleUpdateStatus(j.id, "cancelled")}
                          className="p-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-950/40 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl cursor-pointer"
                          title="Cancel Journey"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span>
                        <span className="text-slate-600 dark:text-slate-400">From:</span>
                        <span className="font-semibold text-slate-800 dark:text-white truncate">{j.source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0 animate-pulse"></span>
                        <span className="text-slate-600 dark:text-slate-400">To:</span>
                        <span className="font-semibold text-slate-800 dark:text-white truncate">{j.destination}</span>
                      </div>
                    </div>

                    {j.notes && (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-xs text-slate-500 italic">
                        Notes: {j.notes}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-pink-50/50 dark:border-slate-800/40">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> ETA:
                      </span>
                      <span className="font-bold text-slate-800 dark:text-white">{j.expectedArrivalTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Journey History section */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <History className="w-4 h-4" /> Journey Log History
            </h2>

            {loading ? (
              <div className="text-center py-6 text-slate-400">Loading history...</div>
            ) : journeys.length === 0 ? (
              <div className="p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/20 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
                No previous journey logs.
              </div>
            ) : (
              <div className="bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-pink-50/50 dark:border-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="p-4">Route</th>
                        <th className="p-4">ETA</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-50/50 dark:divide-slate-800/40">
                      {journeys.map((j) => (
                        <tr key={j.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                          <td className="p-4">
                            <div className="max-w-[200px] truncate font-medium text-slate-900 dark:text-white">
                              {j.source} ➔ {j.destination}
                            </div>
                          </td>
                          <td className="p-4 text-xs font-mono text-slate-500 dark:text-slate-400">{j.expectedArrivalTime}</td>
                          <td className="p-4 text-xs text-slate-400">
                            {new Date(j.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              j.status === "completed" 
                                ? "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400"
                                : j.status === "cancelled"
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                : "bg-blue-100 dark:bg-blue-950/40 text-blue-600"
                            }`}>
                              {j.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
