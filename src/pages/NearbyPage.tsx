import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Shield, 
  Heart, 
  Search, 
  Navigation, 
  CheckCircle, 
  Map, 
  ExternalLink,
  Locate
} from "lucide-react";
import { motion } from "motion/react";

interface HelpLocation {
  id: string;
  name: string;
  type: "police" | "hospital" | "pharmacy";
  address: string;
  phone: string;
  hours: string;
  latOffset: number; // For distance simulation
  lngOffset: number;
}

export const NearbyPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "police" | "hospital" | "pharmacy">("all");
  const [locationName, setLocationName] = useState("Your Area");

  // Base list of premium emergency locations to compute distances from
  const helpLocations: HelpLocation[] = [
    {
      id: "police-1",
      name: "Central Police Station (Precinct 1)",
      type: "police",
      address: "150 Justice Way, Safe City",
      phone: "+1 (555) 911-0101",
      hours: "Open 24/7",
      latOffset: 0.004,
      lngOffset: -0.003
    },
    {
      id: "police-2",
      name: "North Safety Outpost",
      type: "police",
      address: "88 Northern Blvd, Safe City",
      phone: "+1 (555) 911-0105",
      hours: "Open 24/7",
      latOffset: -0.008,
      lngOffset: 0.009
    },
    {
      id: "hospital-1",
      name: "Grace General Hospital & Emergency",
      type: "hospital",
      address: "500 Healing St, Safe City",
      phone: "+1 (555) 302-9000",
      hours: "Emergency 24/7",
      latOffset: -0.002,
      lngOffset: 0.006
    },
    {
      id: "hospital-2",
      name: "City Health Care Clinic",
      type: "hospital",
      address: "12 Wellness Lane, Safe City",
      phone: "+1 (555) 302-8800",
      hours: "8:00 AM - 10:00 PM",
      latOffset: 0.012,
      lngOffset: -0.01
    },
    {
      id: "pharmacy-1",
      name: "SafeCare Pharmacy & Wellness",
      type: "pharmacy",
      address: "244 Remedy Ave, Safe City",
      phone: "+1 (555) 700-1122",
      hours: "Open 24/7",
      latOffset: 0.001,
      lngOffset: 0.002
    },
    {
      id: "pharmacy-2",
      name: "MediPlus Wellness Store",
      type: "pharmacy",
      address: "30 Market Road, Safe City",
      phone: "+1 (555) 700-4499",
      hours: "7:00 AM - Midnight",
      latOffset: -0.005,
      lngOffset: -0.004
    }
  ];

  const getBrowserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationName("Your Current Location");
          setLoading(false);
        },
        (error) => {
          console.warn("Geolocation denied, using mock location", error);
          // Default to premium coordinates
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
          setLocationName("Downtown SafeHer (Demo HQ)");
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
      setLocationName("Downtown SafeHer (Demo HQ)");
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrowserLocation();
  }, []);

  // Compute mock absolute coordinates and distance in km
  const getCalculatedLocations = () => {
    const baseLat = userLocation?.lat || 37.7749;
    const baseLng = userLocation?.lng || -122.4194;

    return helpLocations
      .map((loc) => {
        const finalLat = baseLat + loc.latOffset;
        const finalLng = baseLng + loc.lngOffset;
        // Simple distance calculation (Haversine-approximate)
        const dLat = loc.latOffset * 111; // 1 degree lat ~ 111km
        const dLng = loc.lngOffset * 111 * Math.cos(baseLat * (Math.PI / 180));
        const distance = Math.sqrt(dLat * dLat + dLng * dLng);

        return {
          ...loc,
          lat: finalLat,
          lng: finalLng,
          distance: parseFloat(distance.toFixed(2))
        };
      })
      .filter((loc) => filter === "all" || loc.type === filter)
      .sort((a, b) => a.distance - b.distance);
  };

  const activeLocations = getCalculatedLocations();

  const getBadgeStyle = (type: HelpLocation["type"]) => {
    switch (type) {
      case "police":
        return "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50";
      case "hospital":
        return "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200/50";
      default:
        return "bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400 border border-green-200/50";
    }
  };

  const getIcon = (type: HelpLocation["type"]) => {
    switch (type) {
      case "police":
        return <Shield className="w-5 h-5" />;
      case "hospital":
        return <Heart className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div id="nearby-page" className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
            Nearby Emergency Help
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Find active police precincts, trauma hospitals, and 24-hour pharmacies closest to you.
          </p>
        </div>

        <button
          id="re-locate-btn"
          onClick={getBrowserLocation}
          className="px-5 py-3 bg-white dark:bg-card-dark hover:bg-pink-50/20 dark:hover:bg-slate-800 border border-pink-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Locate className="w-5 h-5 text-accent" /> Refresh Geolocation
        </button>
      </div>

      {/* Geolocation Status Card */}
      <div className="p-4 bg-pink-50/30 dark:bg-slate-900/40 rounded-2xl flex items-center justify-between border border-pink-100/20 dark:border-slate-800 text-sm">
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
          <MapPin className="w-5 h-5 text-accent animate-bounce" />
          <span>
            Current Focus: <strong>{locationName}</strong>
            {userLocation && (
              <span className="font-mono text-xs text-slate-400 ml-1">
                ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
              </span>
            )}
          </span>
        </div>
        <span className="h-2 w-2 rounded-full bg-green-500 shadow-sm" title="GPS active" />
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left 3 Columns: Map Preview and Filters */}
        <div className="lg:col-span-3 space-y-6">
          {/* Custom Stylized Map Component */}
          <div className="h-[450px] w-full rounded-[32px] bg-slate-100 dark:bg-slate-900 border border-pink-100/30 dark:border-slate-800 relative overflow-hidden shadow-sm flex items-center justify-center">
            {/* Elegant SVG schematic blueprint of a city grid with location markers */}
            <svg className="absolute inset-0 w-full h-full text-pink-200/20 dark:text-pink-900/10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Streets */}
              <line x1="0" y1="100" x2="100%" y2="100" stroke="currentColor" strokeWidth="12" />
              <line x1="0" y1="280" x2="100%" y2="280" stroke="currentColor" strokeWidth="18" />
              <line x1="220" y1="0" x2="220" y2="100%" stroke="currentColor" strokeWidth="15" />
              <line x1="480" y1="0" x2="480" y2="100%" stroke="currentColor" strokeWidth="10" />
            </svg>

            {/* Simulated Radar Ring pulsing on current user position */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-pink-400/20 dark:bg-pink-500/10"></span>
              <span className="animate-pulse absolute inline-flex h-10 w-10 rounded-full bg-pink-400/40 dark:bg-pink-500/20"></span>
              <div className="relative p-2.5 bg-accent text-white rounded-full shadow-lg pink-glow-lg border-2 border-white">
                <MapPin className="w-5 h-5 shrink-0" />
              </div>
            </div>

            {/* Overlay indicators representing hospitals, police stations on map */}
            {activeLocations.map((loc, idx) => {
              // Convert offset range to layout percentage
              const topVal = 50 + (loc.latOffset * 3000);
              const leftVal = 50 + (loc.lngOffset * 3000);

              return (
                <motion.div
                  key={loc.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="absolute p-2 rounded-xl bg-white dark:bg-card-dark border border-slate-200/50 shadow-md text-xs font-semibold flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform"
                  style={{ top: `${topVal}%`, left: `${leftVal}%` }}
                >
                  <span className={`p-1 rounded-md shrink-0 ${
                    loc.type === "police" ? "text-blue-500" : loc.type === "hospital" ? "text-red-500" : "text-green-500"
                  }`}>
                    {getIcon(loc.type)}
                  </span>
                  <span className="text-[10px] text-slate-800 dark:text-white whitespace-nowrap hidden sm:inline">{loc.name.split(" ")[0]}</span>
                </motion.div>
              );
            })}

            {/* Bottom Map Card HUD */}
            <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 dark:bg-card-dark/95 backdrop-blur-md shadow-lg border border-pink-100/30 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Range Sensor</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Scanning {activeLocations.length} proximity responders</p>
              </div>
              <span className="text-xs font-semibold bg-accent/10 text-accent px-3 py-1 rounded-full">
                RADAR ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Directory Filters and Detail Cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Type Filters */}
          <div className="flex flex-wrap gap-2">
            {(["all", "police", "hospital", "pharmacy"] as const).map((t) => (
              <button
                key={t}
                id={`filter-${t}-btn`}
                onClick={() => setFilter(t)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer border ${
                  filter === t 
                    ? "bg-accent border-accent text-white pink-glow" 
                    : "bg-white dark:bg-card-dark border-pink-50 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-pink-50/30 dark:hover:bg-slate-800"
                }`}
              >
                {t === "all" ? "Show All" : t + "s"}
              </button>
            ))}
          </div>

          {/* Directory Listings */}
          <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
            {activeLocations.map((loc) => (
              <div
                key={loc.id}
                className="p-4 bg-white dark:bg-card-dark rounded-2xl border border-pink-100/20 dark:border-slate-800 shadow-xs hover:border-accent/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getBadgeStyle(loc.type)}`}>
                      {loc.type}
                    </span>
                    <h3 className="font-display font-extrabold text-slate-950 dark:text-white text-base">
                      {loc.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-accent shrink-0 mt-0.5 bg-pink-50 dark:bg-pink-950/20 px-2 py-0.5 rounded-md">
                    {loc.distance} km
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-pink-400 shrink-0" />
                    <span className="font-mono">{loc.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>{loc.hours}</span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-1.5">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Navigate Map
                  </a>
                  <a
                    href={`tel:${loc.phone.replace(/[^0-9+]/g, "")}`}
                    className="px-4 py-2 bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-900/30 text-accent dark:text-pink-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Agency
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
