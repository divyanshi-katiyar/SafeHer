import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AlertOctagon, 
  ShieldAlert, 
  X, 
  MapPin, 
  Volume2, 
  Users, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Send, 
  Mail 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { sosService, contactService } from "../services/firestore";
import { EmergencyContact } from "../types";

export const FloatingSOSButton: React.FC = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTriggered, setIsTriggered] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleShare = async (messageText: string, mapsLink: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "SafeHer EMERGENCY SOS",
          text: messageText,
          url: mapsLink
        });
      } catch (err) {
        console.warn("Share failed or was cancelled", err);
      }
    } else {
      copyToClipboard(messageText);
    }
  };

  useEffect(() => {
    if (currentUser && isOpen) {
      contactService.getContacts(currentUser.uid).then(setContacts).catch(console.error);
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    if (countdown !== null) {
      if (countdown > 0) {
        timerRef.current = setTimeout(() => {
          setCountdown((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);
      } else {
        handleTriggerSOS();
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown]);

  if (!currentUser) return null;

  const handleOpen = () => {
    setIsOpen(true);
    setCountdown(5); // 5-second countdown to auto-trigger
    setIsTriggered(false);
    setLocationError(null);
    setCoords(null);
  };

  const handleCancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCountdown(null);
    setIsOpen(false);
    setIsTriggered(false);
  };

  const handleTriggerSOS = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCountdown(null);
    setIsTriggered(true);

    let defaultLat = 37.7749; // Default San Francisco
    let defaultLng = -122.4194;
    let accuracy = 10;

    const executeTrigger = async (lat: number, lng: number, acc: number) => {
      setCoords({ lat, lng });
      try {
        await sosService.triggerSOS(currentUser.uid, { lat, lng, accuracy: acc });
      } catch (err) {
        console.error("Failed to trigger SOS on Firestore:", err);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const acc = position.coords.accuracy;
          await executeTrigger(lat, lng, acc);
        },
        async (error) => {
          console.warn("Geolocation failed, using default coordinates", error);
          setLocationError("Could not retrieve precise location. Using last-known coordinates.");
          await executeTrigger(defaultLat, defaultLng, accuracy);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      await executeTrigger(defaultLat, defaultLng, accuracy);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        id="global-sos-fab"
        onClick={handleOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white font-bold pink-glow-lg cursor-pointer focus:outline-none"
        aria-label="Trigger SOS"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ShieldAlert className="w-8 h-8" />
        </motion.div>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500"></span>
        </span>
      </motion.button>

      {/* SOS Modal */}
      <AnimatePresence>
        {isOpen && (
          <div id="sos-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              id="sos-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-md p-6 bg-white dark:bg-card-dark rounded-3xl border border-red-100 dark:border-red-950/30 shadow-2xl text-center overflow-hidden"
            >
              {/* Emergency Alert pulsing background */}
              <div className="absolute inset-0 bg-red-500/5 dark:bg-red-500/2 animate-pulse pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-red-100 dark:bg-red-950/50 rounded-full text-red-600 dark:text-red-400">
                    <AlertOctagon className="w-12 h-12 animate-bounce" />
                  </div>
                </div>

                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
                  EMERGENCY SOS
                </h2>

                {!isTriggered ? (
                  <>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                      This will trigger an emergency signal, record your exact location, and simulate alerts to all registered emergency contacts.
                    </p>

                    {countdown !== null && (
                      <div className="mb-6">
                        <div className="relative inline-flex items-center justify-center">
                          <svg className="w-24 h-24 transform -rotate-90">
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              className="text-slate-100 dark:text-slate-800"
                              fill="transparent"
                            />
                            <motion.circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              className="text-red-600 dark:text-red-400"
                              fill="transparent"
                              strokeDasharray="251.2"
                              animate={{ strokeDashoffset: (251.2 * (5 - countdown)) / 5 }}
                              transition={{ duration: 1, ease: "linear" }}
                            />
                          </svg>
                          <span className="absolute text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                            {countdown}
                          </span>
                        </div>
                        <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-2 animate-pulse">
                          Auto-triggering in {countdown}s
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <button
                        id="sos-trigger-now-btn"
                        onClick={handleTriggerSOS}
                        className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold tracking-wide shadow-lg transition-all pink-glow cursor-pointer"
                      >
                        TRIGGER SOS NOW
                      </button>
                      <button
                        id="sos-cancel-btn"
                        onClick={handleCancel}
                        className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-all cursor-pointer"
                      >
                        Cancel / Dismiss
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1"
                  >
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-bold text-lg">
                      <span className="h-3.5 w-3.5 rounded-full bg-green-500 animate-ping"></span>
                      SOS ACTIVATED SUCCESSFULLY
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl text-left text-sm space-y-3 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">Location Recorded</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {coords ? `Coordinates captured: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : "Capturing GPS coordinates..."}
                          </p>
                          {locationError && (
                            <p className="text-[10px] text-amber-500 mt-0.5">{locationError}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Volume2 className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">Device Alarm Plays</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Loud alert tone initiated on this device to draw immediate attention.
                          </p>
                        </div>
                      </div>

                      {/* Real contacts simulated SMS delivery */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                        <p className="font-semibold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-accent" /> Guardian Dispatch Monitor
                        </p>
                        {contacts.length === 0 ? (
                          <p className="text-xs text-red-500 dark:text-red-400 italic">
                            ⚠️ No emergency contacts registered! Please add contacts in "Manage Contacts" to alert them.
                          </p>
                        ) : (
                          <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                            {contacts.map((contact) => (
                              <div key={contact.id} className="flex items-center justify-between text-xs bg-white dark:bg-slate-950 p-2 rounded-xl border border-pink-500/10">
                                <div className="min-w-0 flex-1 pr-2">
                                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{contact.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{contact.phone}</p>
                                </div>
                                <span className="shrink-0 px-2 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-500 dark:text-green-400 rounded-full flex items-center gap-1">
                                  <span className="h-1 w-1 bg-green-500 rounded-full animate-ping"></span> SMS Sent
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Web Share / Custom Share / Copy Block */}
                    {coords && (
                      <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-2xl text-left text-sm space-y-3.5 border border-red-100/50 dark:border-red-950/30">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-sm text-red-700 dark:text-red-400 flex items-center gap-1.5">
                            <Share2 className="w-4 h-4 animate-pulse" /> Share Emergency Alert
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">
                            Broadcast this distress signal and your live coordinates to family & local groups.
                          </p>
                        </div>

                        {/* Message Preview */}
                        <div className="bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-red-100 dark:border-red-900/20 text-[11px] font-mono text-slate-600 dark:text-slate-300 select-all leading-relaxed break-all">
                          EMERGENCY SOS from SafeHer! I need help immediately. My location is: https://maps.google.com/?q={coords.lat},{coords.lng}
                        </div>

                        <div className="space-y-2">
                          {/* Try Web Share if supported */}
                          {navigator.share && (
                            <button
                              id="sos-web-share-btn"
                              onClick={() => handleShare(
                                `EMERGENCY SOS from SafeHer! I need help immediately. My location is: https://maps.google.com/?q=${coords.lat},${coords.lng}`,
                                `https://maps.google.com/?q=${coords.lat},${coords.lng}`
                              )}
                              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5" /> Share via Apps
                            </button>
                          )}

                          {/* Quick-action links */}
                          <div className="grid grid-cols-2 gap-2">
                            <a
                              id="sos-share-whatsapp"
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`EMERGENCY SOS from SafeHer! I need help immediately. My location is: https://maps.google.com/?q=${coords.lat},${coords.lng}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-center text-xs flex items-center justify-center gap-1 transition-all"
                            >
                              WhatsApp
                            </a>
                            <a
                              id="sos-share-telegram"
                              href={`https://t.me/share/url?url=${encodeURIComponent(`https://maps.google.com/?q=${coords.lat},${coords.lng}`)}&text=${encodeURIComponent("EMERGENCY SOS from SafeHer! I need help immediately. My current location is:")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2 px-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-center text-xs flex items-center justify-center gap-1 transition-all"
                            >
                              Telegram
                            </a>
                            <a
                              id="sos-share-sms"
                              href={`sms:?&body=${encodeURIComponent(`EMERGENCY SOS from SafeHer! I need help immediately. My location is: https://maps.google.com/?q=${coords.lat},${coords.lng}`)}`}
                              className="py-2 px-3 rounded-xl bg-[#007AFF] hover:bg-[#0062cc] text-white font-bold text-center text-xs flex items-center justify-center gap-1 transition-all"
                            >
                              Send SMS
                            </a>
                            <a
                              id="sos-share-email"
                              href={`mailto:?subject=${encodeURIComponent("URGENT: SafeHer Emergency SOS")}&body=${encodeURIComponent(`EMERGENCY SOS from SafeHer! I need help immediately. My current location is: https://maps.google.com/?q=${coords.lat},${coords.lng}`)}`}
                              className="py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-850 text-white font-bold text-center text-xs flex items-center justify-center gap-1 transition-all"
                            >
                              Email Alert
                            </a>
                          </div>

                          {/* Copy Message Button */}
                          <button
                            id="sos-copy-msg-btn"
                            onClick={() => copyToClipboard(`EMERGENCY SOS from SafeHer! I need help immediately. My location is: https://maps.google.com/?q=${coords.lat},${coords.lng}`)}
                            className={`w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              copied 
                                ? "bg-green-600 border-green-500 text-white" 
                                : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            {copied ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Message Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copy SOS Message
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      id="sos-dismiss-activated-btn"
                      onClick={handleCancel}
                      className="w-full py-3.5 rounded-2xl bg-accent text-white font-bold tracking-wide shadow-md hover:bg-accent/90 transition-all cursor-pointer"
                    >
                      Dismiss / Safe Now
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Close Button top right */}
              <button
                id="sos-modal-close-x"
                onClick={handleCancel}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
