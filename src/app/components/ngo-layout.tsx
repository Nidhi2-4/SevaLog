import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, UserPlus, ClipboardList, Users, Settings as SettingsIcon, LogOut,
} from "lucide-react";

const logo = "/logo.png";

export function NGOLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const ngoName = localStorage.getItem("ngo_name") || "NGO Portal";

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/ngo/dashboard" },
    { icon: UserPlus, label: "Register Worker", path: "/ngo/register-worker" },
    { icon: ClipboardList, label: "Log Work", path: "/ngo/log-work" },
    { icon: Users, label: "My Workers", path: "/ngo/workers" },
    { icon: SettingsIcon, label: "Settings", path: "/ngo/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("ngo_id");
    localStorage.removeItem("ngo_name");
    localStorage.removeItem("ngo_email");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SevaLog" className="h-9 w-auto" />
            <div>
              <p className="font-bold text-sidebar-foreground leading-none">SevaLog</p>
              <p className="text-xs text-sidebar-foreground/50 mt-0.5 truncate max-w-32">{ngoName}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-accent rounded-full" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-sidebar-foreground/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}