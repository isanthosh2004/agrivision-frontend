import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { logout as logoutApi } from "../../api/auth.api";

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex h-16 items-center justify-between border-b border-agri-border bg-agri-surface px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          className="rounded-md border border-agri-border p-2 hover:bg-agri-card md:hidden"
          onClick={onMenuClick}
        >
          <Menu size={18} />
        </button>
        <div className="text-sm text-white/70">Jacob AI · Explainable Agronomy</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-white/80">{user?.fullName}</div>
        <button
          className="inline-flex items-center gap-2 rounded-md border border-agri-border px-3 py-1 text-sm hover:bg-agri-card"
          type="button"
          onClick={async () => {
            try {
              await logoutApi();
            } finally {
              useAuthStore.getState().logout();
              navigate("/login");
            }
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
}
