import { useAuthStore } from "../store/authStore";

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="mt-4 rounded-md border border-agri-border bg-agri-card p-4 text-sm text-white/80">
        <div>Name: {user?.fullName}</div>
        <div>Email: {user?.email}</div>
        <div>Role: {user?.role}</div>
      </div>
    </div>
  );
}
