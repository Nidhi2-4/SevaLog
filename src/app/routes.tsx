import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { NGODashboard } from "./pages/ngo-dashboard";
import { RegisterWorker } from "./pages/register-worker";
import { LogWork } from "./pages/log-work";
import { MyWorkers } from "./pages/my-workers";
import { Settings } from "./pages/settings";
import { VerifierPage } from "./pages/verifier-page";
import { WorkerProfile } from "./pages/worker-profile";
import { NGOLayout } from "./components/ngo-layout";
import { AdminLayout } from "./components/admin-layout";
import { AdminDashboard } from "./pages/admin-dashboard";
import { AdminNGOs } from "./pages/admin-ngos";
import { AdminWorkers } from "./pages/admin-workers";
import { NGORegister } from "./pages/ngo-register";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  {
    path: "/ngo",
    Component: NGOLayout,
    children: [
      { path: "dashboard", Component: NGODashboard },
      { path: "register-worker", Component: RegisterWorker },
      { path: "log-work", Component: LogWork },
      { path: "workers", Component: MyWorkers },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { path: "dashboard", Component: AdminDashboard },
      { path: "ngos", Component: AdminNGOs },
      { path: "workers", Component: AdminWorkers },
    ],
  },
  { path: "/ngo-register", Component: NGORegister },
  { path: "/verifier", Component: VerifierPage },
  { path: "/worker/:id", Component: WorkerProfile },
]);