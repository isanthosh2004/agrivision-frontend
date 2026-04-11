import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CropPlannerPage } from "./pages/CropPlannerPage";
import { RiskScorerPage } from "./pages/RiskScorerPage";
import { XAIExplainerPage } from "./pages/XAIExplainerPage";
import { FiveSeasonPage } from "./pages/FiveSeasonPage";
import { LandMapPage } from "./pages/LandMapPage";
import { ReportsPage } from "./pages/ReportsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPage } from "./pages/AdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/planner", element: <CropPlannerPage /> },
      { path: "/risk", element: <RiskScorerPage /> },
      { path: "/xai", element: <XAIExplainerPage /> },
      { path: "/forecast", element: <FiveSeasonPage /> },
      { path: "/map", element: <LandMapPage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/profile", element: <ProfilePage /> },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        ),
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
