import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  contactService, 
  journeyService, 
  incidentService, 
  sosService 
} from "../services/firestore";
import { EmergencyContact, Journey, Incident, SOSEvent } from "../types";
import { 
  ShieldAlert, 
  Navigation, 
  Users, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  Calendar,
  Sparkles,
  MapPin,
  Heart
} from "lucide-react";
import { motion } from "motion/react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  BarChart,
  Bar
} from "recharts";

export const DashboardPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [activeJourneys, setActiveJourneys] = useState<Journey[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [sosLogs, setSosLogs] = useState<SOSEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!currentUser) return;
    try {
      const [allContacts, journeys, allIncidents, sosEvents] = await Promise.all([
        contactService.getContacts(currentUser.uid),
        journeyService.getActiveJourneys(currentUser.uid),
        incidentService.getIncidents(),
        sosService.getSOSHistory(currentUser.uid)
      ]);
      setContacts(allContacts);
      setActiveJourneys(journeys);
      // Limit to 3 recent incidents
      setIncidents(allIncidents.slice(0, 3));
      setSosLogs(sosEvents);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  const handleCompleteJourney = async (id: string) => {
    try {
      await journeyService.updateJourneyStatus(id, "completed");
      setActiveJourneys(prev => prev.filter(j => j.id !== id));
      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to complete journey:", err);
    }
  };

  const getSafetyStatus = () => {
    const activeSOS = sosLogs.some(s => s.status === "active");
    if (activeSOS) return { label: "SOS TRIGGERED", color: "text-red-500 bg-red-100 dark:bg-red-950/40 border-red-200 dark:border-red-900", glow: "shadow-red-500/30" };
    if (activeJourneys.length > 0) return { label: "IN TRANSIT", color: "text-blue-500 bg-blue-100 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900", glow: "shadow-blue-500/30" };
    return { label: "SECURE", color: "text-green-600 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-950", glow: "shadow-green-500/10" };
  };

  const status = getSafetyStatus();

  // Mock analytics data for the Recharts
  const chartData = [
    { name: "Mon", journeys: 2, sos: 0, incidents: 1 },
    { name: "Tue", journeys: 4, sos: 1, incidents: 0 },
    { name: "Wed", journeys: 3, sos: 0, incidents: 2 },
    { name: "Thu", journeys: 5, sos: 0, incidents: 1 },
    { name: "Fri", journeys: 6, sos: 1, incidents: 0 },
    { name: "Sat", journeys: 4, sos: 2, incidents: 3 },
    { name: "Sun", journeys: 3, sos: 0, incidents: 1 },
  ];

  return (
    <div id="dashboard-page" className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[32px] bg-gradient-to-tr from-pink-500/10 via-accent/5 to-transparent border border-pink-100/40 dark:border-slate-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-300/10 dark:bg-pink-900/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-xs font-bold text-accent dark:text-pink-400 uppercase tracking-widest">
              SafeHer Security Center
            </span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
            Hello, {userProfile?.name || "User"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-pink-400" />
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Global Safety State badge */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Your Status
          </span>
          <div className={`px-4 py-2 rounded-2xl border font-bold text-sm flex items-center gap-2 shadow-xs ${status.color}`}>
            <span className="h-2 w-2 rounded-full bg-current animate-ping"></span>
            {status.label}
          </div>
        </div>
      </div>

      {/* Grid of Key Analytics Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="p-5 bg-white dark:bg-card-dark rounded-2xl border border-pink-100/30 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-50 dark:bg-pink-950/20 text-accent rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Guardians</p>
            <p className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{contacts.length}</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-card-dark rounded-2xl border border-pink-100/30 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-50 dark:bg-pink-950/20 text-blue-500 rounded-xl">
            <Navigation className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Active Journeys</p>
            <p className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{activeJourneys.length}</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-card-dark rounded-2xl border border-pink-100/30 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-50 dark:bg-pink-950/20 text-red-500 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">SOS Logs</p>
            <p className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{sosLogs.length}</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-card-dark rounded-2xl border border-pink-100/30 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-50 dark:bg-pink-950/20 text-amber-500 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Reports Active</p>
            <p className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{incidents.length}</p>
          </div>
        </div>
      </div>

      {/* Quick Action buttons */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            id="qa-start-journey"
            to="/journey"
            className="p-4 bg-white dark:bg-card-dark hover:bg-pink-50/30 dark:hover:bg-slate-800/40 rounded-2xl border border-pink-100/30 dark:border-slate-800 text-center font-bold text-sm text-slate-700 dark:text-slate-200 shadow-xs transition-all flex flex-col items-center gap-2 hover:scale-[1.02]"
          >
            <Navigation className="w-5 h-5 text-accent" />
            <span>Track Journey</span>
          </Link>
          <Link
            id="qa-report-incident"
            to="/incidents"
            className="p-4 bg-white dark:bg-card-dark hover:bg-pink-50/30 dark:hover:bg-slate-800/40 rounded-2xl border border-pink-100/30 dark:border-slate-800 text-center font-bold text-sm text-slate-700 dark:text-slate-200 shadow-xs transition-all flex flex-col items-center gap-2 hover:scale-[1.02]"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Report Incident</span>
          </Link>
          <Link
            id="qa-helplines"
            to="/tips"
            className="p-4 bg-white dark:bg-card-dark hover:bg-pink-50/30 dark:hover:bg-slate-800/40 rounded-2xl border border-pink-100/30 dark:border-slate-800 text-center font-bold text-sm text-slate-700 dark:text-slate-200 shadow-xs transition-all flex flex-col items-center gap-2 hover:scale-[1.02]"
          >
            <Heart className="w-5 h-5 text-red-500" />
            <span>Safety Tips & Helplines</span>
          </Link>
          <Link
            id="qa-contacts"
            to="/contacts"
            className="p-4 bg-white dark:bg-card-dark hover:bg-pink-50/30 dark:hover:bg-slate-800/40 rounded-2xl border border-pink-100/30 dark:border-slate-800 text-center font-bold text-sm text-slate-700 dark:text-slate-200 shadow-xs transition-all flex flex-col items-center gap-2 hover:scale-[1.02]"
          >
            <Users className="w-5 h-5 text-blue-500" />
            <span>Manage Contacts</span>
          </Link>
        </div>
      </div>

      {/* Active Journey Widget */}
      {activeJourneys.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping"></span> Active Journey Trackers
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {activeJourneys.map((j) => (
              <div 
                key={j.id} 
                className="p-6 bg-white dark:bg-card-dark rounded-2xl border-l-4 border-l-blue-500 border-y border-r border-pink-100/40 dark:border-slate-800 shadow-md space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">In Transit</h4>
                      <p className="text-xs text-slate-400">Journey started {new Date(j.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                  <button
                    id={`complete-journey-${j.id}`}
                    onClick={() => handleCompleteJourney(j.id)}
                    className="px-3.5 py-1.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Arrived Safely
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400">From</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{j.source}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">To</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{j.destination}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Expected ETA:
                  </span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {j.expectedArrivalTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Analytics & Incidents */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Analytics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">Activity Metrics</h3>
                <p className="text-xs text-slate-400">Weekly journeys & safety alerts visual tracker</p>
              </div>
              <span className="text-xs text-accent bg-pink-50 dark:bg-pink-950/30 px-2.5 py-1 rounded-full font-bold">
                7 Days
              </span>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorJourneys" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E91E63" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#E91E63" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.95)", 
                      borderRadius: "16px", 
                      border: "1px solid #F8BBD0",
                      fontSize: "12px",
                      color: "#333"
                    }} 
                  />
                  <Area type="monotone" dataKey="journeys" stroke="#E91E63" strokeWidth={2} fillOpacity={1} fill="url(#colorJourneys)" name="Journeys" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Recent Community Incidents */}
        <div className="space-y-4">
          <div className="p-6 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">Recent Reports</h3>
                <Link id="view-all-incidents-link" to="/incidents" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3.5">
                {loading ? (
                  <div className="text-center py-8 text-xs text-slate-400">Loading incidents...</div>
                ) : incidents.length === 0 ? (
                  <div className="text-center py-8 text-sm text-slate-400 dark:text-slate-500">
                    No community incidents reported.
                  </div>
                ) : (
                  incidents.map((i) => (
                    <div 
                      key={i.id} 
                      className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-pink-50/20 dark:border-slate-850 flex items-start gap-3"
                    >
                      <div className="p-2 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl mt-0.5">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{i.title}</h4>
                        <p className="text-[10px] font-semibold text-accent uppercase tracking-wider mt-0.5">{i.category}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">{i.description}</p>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mt-1">
                          <MapPin className="w-3 h-3 text-pink-400" />
                          <span>{i.location.address || "Last Location Recorded"}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
