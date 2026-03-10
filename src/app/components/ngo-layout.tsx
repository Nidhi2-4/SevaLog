import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  UserPlus,
  ClipboardList,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";
import logo from "figma:asset/85248772586b99de15e77f83e48a42b2a67f744d.png";

export function NGOLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/ngo/dashboard" },
    { icon: UserPlus, label: "Register Worker", path: "/ngo/register-worker" },
    { icon: ClipboardList, label: "Log Work", path: "/ngo/log-work" },
    { icon: Users, label: "My Workers", path: "/ngo/workers" },
    { icon: SettingsIcon, label: "Settings", path: "/ngo/settings" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SevaLog" className="h-10 w-auto" />
            <span className="text-xl font-semibold">SevaLog</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}