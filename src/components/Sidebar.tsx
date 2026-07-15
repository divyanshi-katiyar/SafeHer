import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Navigation, 
  ShieldAlert, 
  Contact, 
  AlertCircle, 
  MapPin, 
  BookOpen, 
  Settings, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  setCollapsed, 
  mobileOpen, 
  setMobileOpen 
}) => {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Journey Tracker", path: "/journey", icon: Navigation },
    { name: "SOS Logs", path: "/sos-logs", icon: ShieldAlert },
    { name: "Contacts", path: "/contacts", icon: Contact },
    { name: "Incidents", path: "/incidents", icon: AlertCircle },
    { name: "Nearby Help", path: "/nearby", icon: MapPin },
    { name: "Safety Tips", path: "/tips", icon: BookOpen },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const sidebarClass = `
    fixed top-0 bottom-0 left-0 z-40 
    flex flex-col justify-between 
    bg-white dark:bg-card-dark 
    border-r border-pink-100/50 dark:border-slate-800/60
    transition-all duration-300 ease-in-out
    ${collapsed ? "w-20" : "w-64"}
    ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          id="sidebar-overlay"
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside id="main-sidebar" className={sidebarClass}>
        {/* Sidebar Header */}
        <div className="p-5 flex items-center justify-between border-b border-pink-50 dark:border-slate-800/40">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 rounded-xl bg-accent text-white pink-glow">
              <ShieldCheck className="w-6 h-6 shrink-0" />
            </div>
            {!collapsed && (
              <span className="font-display font-extrabold text-xl tracking-tight text-accent dark:text-pink-400">
                SafeHer
              </span>
            )}
          </div>
          {/* Collapse toggle button for desktop */}
          <button
            id="sidebar-collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-pink-50 dark:hover:bg-slate-800 text-slate-400 hover:text-accent cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              id={`nav-link-${item.name.toLowerCase().replace(" ", "-")}`}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-200
                ${isActive 
                  ? "bg-accent/10 dark:bg-pink-500/10 text-accent dark:text-pink-400 font-semibold" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-pink-50/50 dark:hover:bg-slate-800/40 hover:text-accent dark:hover:text-pink-400"}
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Info / Logout Footer */}
        <div className="p-4 border-t border-pink-50 dark:border-slate-800/40 space-y-3">
          {!collapsed && userProfile && (
            <div className="flex items-center gap-3 px-1.5 py-1">
              <img
                src={userProfile.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"}
                alt="User Profile"
                className="w-9 h-9 rounded-xl object-cover border-2 border-pink-100"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate text-slate-800 dark:text-white leading-tight">
                  {userProfile.name}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                  {userProfile.email}
                </p>
              </div>
            </div>
          )}

          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 font-medium text-sm transition-all cursor-pointer
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
