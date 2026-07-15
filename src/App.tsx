import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Layouts
import { DashboardLayout } from "./layouts/DashboardLayout";

// Public Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";

// Protected Pages
import { DashboardPage } from "./pages/DashboardPage";
import { JourneyPage } from "./pages/JourneyPage";
import { SOSHistoryPage } from "./pages/SOSHistoryPage";
import { ContactsPage } from "./pages/ContactsPage";
import { IncidentPage } from "./pages/IncidentPage";
import { NearbyPage } from "./pages/NearbyPage";
import { SafetyTipsPage } from "./pages/SafetyTipsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { LoadingSpinner } from "./components/LoadingSpinner";

// Protected Route Guard Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div id="route-guard-loading" className="min-h-screen bg-[#FFF9FB] dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm font-semibold text-accent animate-pulse uppercase tracking-widest">
            Securing Connection...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Core App Routes wrapped in DashboardLayout */}
            <Route 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/journey" element={<JourneyPage />} />
              <Route path="/sos-logs" element={<SOSHistoryPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/incidents" element={<IncidentPage />} />
              <Route path="/nearby" element={<NearbyPage />} />
              <Route path="/tips" element={<SafetyTipsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
