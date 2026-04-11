import { NavLink } from "react-router-dom";
import { Leaf, LineChart, Map, Shield, Sparkles, Sprout, FileText, User } from "lucide-react";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
    isActive ? "bg-agri-card text-agri-primary" : "text-white/80 hover:bg-agri-surface"
  }`;

export function Sidebar() {
  return (
    <aside className="hidden w-60 flex-col border-r border-agri-border bg-agri-surface md:flex">
      <div className="border-b border-agri-border px-4 py-4 text-lg font-semibold text-agri-primary">
        AgriVision XAI
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        <NavLink className={linkClass} to="/dashboard">
          <Sprout size={18} /> Dashboard
        </NavLink>
        <NavLink className={linkClass} to="/planner">
          <Leaf size={18} /> Crop Planner
        </NavLink>
        <NavLink className={linkClass} to="/risk">
          <Shield size={18} /> Risk Scorer
        </NavLink>
        <NavLink className={linkClass} to="/xai">
          <Sparkles size={18} /> XAI Explainer
        </NavLink>
        <NavLink className={linkClass} to="/forecast">
          <LineChart size={18} /> 5-Season Forecast
        </NavLink>
        <NavLink className={linkClass} to="/map">
          <Map size={18} /> Land Map
        </NavLink>
        <NavLink className={linkClass} to="/reports">
          <FileText size={18} /> Reports
        </NavLink>
        <NavLink className={linkClass} to="/profile">
          <User size={18} /> Profile
        </NavLink>
        <NavLink className={linkClass} to="/admin">
          <Shield size={18} /> Admin
        </NavLink>
      </nav>
    </aside>
  );
}
