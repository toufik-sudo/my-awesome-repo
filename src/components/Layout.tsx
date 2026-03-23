import { Outlet, NavLink } from "react-router-dom";
import { Wrench, Car, MessageCircle, History, Moon, Sun, LogOut } from "lucide-react";
import { useStore } from "../store";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

export default function Layout() {
  const { theme, toggleTheme } = useStore();
  const { signOut } = useAuth();

  const navItems = [
    { to: "/garage", icon: Car, label: "Garage" },
    { to: "/diagnose", icon: MessageCircle, label: "Diagnose" },
    { to: "/history", icon: History, label: "History" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 border-b flex items-center px-4 justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-lg">MechDiag</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={signOut}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 border-t glass safe-bottom flex items-center justify-around z-50">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    />
                  )}
                </div>
                <span className="text-xs font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
