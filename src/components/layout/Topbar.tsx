import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { logout as logoutApi } from "../../api/auth.api";

export function Topbar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex h-16 items-center justify-between border-b border-agri-border bg-agri-surface px-6">
      <div className="text-sm text-white/70">Jacob AI · Explainable Agronomy</div>
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
