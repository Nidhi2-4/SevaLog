import { Outlet, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, Building2, Users, LogOut } from "lucide-react";

const logo = "/logo.png";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = localStorage.getItem("admin_name") || "Admin";

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Building2, label: "All NGOs", path: "/admin/ngos" },
    { icon: Users, label: "All Workers", path: "/admin/workers" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_id");
    localStorage.removeItem("admin_name");
    localStorage.removeItem("admin_email");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SevaLog" className="h-9 w-auto" />
            <div>
              <p className="font-bold text-sidebar-foreground leading-none">SevaLog</p>
              <p className="text-xs text-red-400 mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50">Logged in as</p>
          <p className="text-sm font-medium text-sidebar-foreground truncate">{adminName}</p>
        </div>

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

      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}