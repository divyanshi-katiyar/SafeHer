import React, { useState, useEffect } from "react";
import { Bell, ShieldAlert, Navigation, Info, Trash2, Check, CheckCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { notificationService } from "../services/firestore";
import { SafeNotification } from "../types";
import { motion, AnimatePresence } from "motion/react";

export const NotificationCenter: React.FC = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<SafeNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(currentUser.uid);
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      // Poll every 10 seconds for real-time updates safely without complex subscription
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const handleMarkAllRead = async () => {
    if (!currentUser) return;
    try {
      await notificationService.markAllAsRead(currentUser.uid);
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: SafeNotification["type"]) => {
    switch (type) {
      case "sos":
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case "journey":
        return <Navigation className="w-4 h-4 text-blue-500" />;
      case "incident":
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-pink-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon Trigger */}
      <button
        id="notification-bell-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-600 hover:text-accent dark:text-slate-300 dark:hover:text-primary rounded-xl hover:bg-pink-50 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click-away backdrop */}
            <div
              id="notification-backdrop"
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              id="notification-panel"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="absolute right-0 mt-2 z-40 w-80 md:w-96 rounded-2xl bg-white dark:bg-card-dark border border-pink-100 dark:border-slate-800 shadow-xl overflow-hidden"
            >
              <div className="p-4 border-b border-pink-50 dark:border-slate-800 flex items-center justify-between bg-pink-50/40 dark:bg-slate-900/40">
                <h3 className="font-display font-bold text-slate-800 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    id="mark-all-read-btn"
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-xs text-accent dark:text-primary hover:underline font-semibold cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[350px] overflow-y-auto divide-y divide-pink-50/50 dark:divide-slate-800">
                {loading && notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    Loading alerts...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-400 dark:text-slate-500">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        !n.read ? "bg-pink-50/20 dark:bg-pink-950/10" : ""
                      }`}
                    >
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm text-slate-800 dark:text-slate-200 ${!n.read ? "font-semibold" : ""}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!n.read && (
                        <button
                          id={`mark-read-btn-${n.id}`}
                          onClick={() => handleMarkRead(n.id)}
                          className="p-1 text-slate-400 hover:text-green-500 rounded transition-colors cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
