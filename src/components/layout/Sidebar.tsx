import { NavLink } from "react-router-dom";
import { Leaf, LineChart, Map, Shield, Sparkles, Sprout, FileText, User } from "lucide-react";

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
  mobile?: boolean;
};

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
    isActive ? "bg-agri-card text-agri-primary" : "text-white/80 hover:bg-agri-surface"
  }`;

export function Sidebar({ className = "", onNavigate, mobile = false }: SidebarProps) {
  const visibilityClass = mobile ? "flex md:hidden" : "hidden md:flex";

  return (
    <aside className={`${visibilityClass} w-60 flex-col border-r border-agri-border bg-agri-surface ${className}`}>
      <div className="border-b border-agri-border px-4 py-4 text-lg font-semibold text-agri-primary">
        AgriVision XAI
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        <NavLink className={linkClass} to="/dashboard" onClick={onNavigate}>
          <Sprout size={18} /> Dashboard
        </NavLink>
        <NavLink className={linkClass} to="/planner" onClick={onNavigate}>
          <Leaf size={18} /> Crop Planner
        </NavLink>
        <NavLink className={linkClass} to="/risk" onClick={onNavigate}>
          <Shield size={18} /> Risk Scorer
        </NavLink>
        <NavLink className={linkClass} to="/xai" onClick={onNavigate}>
          <Sparkles size={18} /> XAI Explainer
        </NavLink>
        <NavLink className={linkClass} to="/forecast" onClick={onNavigate}>
          <LineChart size={18} /> 5-Season Forecast
        </NavLink>
        <NavLink className={linkClass} to="/map" onClick={onNavigate}>
          <Map size={18} /> Land Map
        </NavLink>
        <NavLink className={linkClass} to="/reports" onClick={onNavigate}>
          <FileText size={18} /> Reports
        </NavLink>
        <NavLink className={linkClass} to="/profile" onClick={onNavigate}>
          <User size={18} /> Profile
        </NavLink>
        <NavLink className={linkClass} to="/admin" onClick={onNavigate}>
          <Shield size={18} /> Admin
        </NavLink>
      </nav>
    </aside>
  );
}
