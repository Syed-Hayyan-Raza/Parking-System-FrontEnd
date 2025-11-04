import { useState, useEffect } from "react";
import { HomePage } from "./components/HomePage";
import { LoginSignup } from "./components/LoginSignup";
import { Dashboard } from "./components/Dashboard";
import { AdminPanel } from "./components/AdminPanel";

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    // Check if there's a stored user session on initial load
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      // Return the appropriate page based on user role
      return user.role === "admin" ? "admin" : "dashboard";
    }
    return "home";
  });

  const handleNavigation = (page: string, role?: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigation} />;
      case "login":
        return <LoginSignup onNavigate={handleNavigation} />;
      case "dashboard":
        return <Dashboard onNavigate={handleNavigation} />;
      case "admin":
        return <AdminPanel onNavigate={handleNavigation} />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return <div className="min-h-screen">{renderPage()}</div>;
}