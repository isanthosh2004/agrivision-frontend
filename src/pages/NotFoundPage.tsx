import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-agri-bg text-white">
      <h1 className="text-2xl font-semibold">404</h1>
      <Link className="text-agri-primary" to="/dashboard">
        Go home
      </Link>
    </div>
  );
}
