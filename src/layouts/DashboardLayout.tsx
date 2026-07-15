import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { NotificationCenter } from "../components/NotificationCenter";
import { FloatingSOSButton } from "../components/FloatingSOSButton";
import { useTheme } from "../context/ThemeContext";
import { Menu, Sun, Moon, ShieldCheck, User } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { userProfile } = useAuth();

  return (
    <div id="dashboard-layout" className="min-h-screen bg-bg-light dark:bg-bg-dark text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
      {/* Sidebar Component */}
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />

      {/* Main Content Area */}
      <div 
        id="main-content-area"
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* Top bar Header */}
        <header id="dashboard-header" className="sticky top-0 z-30 h-16 bg-white/70 dark:bg-bg-dark/70 backdrop-blur-md border-b border-pink-50 dark:border-slate-800/40 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-sidebar-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 md:hidden">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span className="font-display font-extrabold text-lg text-accent">SafeHer</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Light / Dark Mode Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2.5 text-slate-600 hover:text-accent dark:text-slate-300 dark:hover:text-primary rounded-xl hover:bg-pink-50 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Notification Center */}
            <NotificationCenter />

            {/* Simple Profile Link Card */}
            <Link
              id="header-profile-link"
              to="/profile"
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800"
            >
              <img
                src={userProfile?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-pink-100"
              />
            </Link>
          </div>
        </header>

        {/* Dashboard Pages Content Outlet wrapper */}
        <main id="dashboard-main-content" className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Floating emergency SOS button across all authenticated routes */}
      <FloatingSOSButton />
    </div>
  );
};
