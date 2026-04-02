import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Building2, Users, Clock, ClipboardList } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalNGOs: 0, totalWorkers: 0, totalHours: 0, totalLogs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);

    const { count: ngoCount } = await supabase
      .from("ngos").select("*", { count: "exact", head: true });

    const { count: workerCount } = await supabase
      .from("workers").select("*", { count: "exact", head: true });

    const { data: hoursData } = await supabase
      .from("workers").select("total_hours");

    const totalHours = hoursData?.reduce((sum, w) => sum + (w.total_hours || 0), 0) || 0;

    const { count: logsCount } = await supabase
      .from("work_logs").select("*", { count: "exact", head: true });

    setStats({
      totalNGOs: ngoCount || 0,
      totalWorkers: workerCount || 0,
      totalHours,
      totalLogs: logsCount || 0,
    });
    setLoading(false);
  };

  const statCards = [
    { label: "Total NGOs", value: stats.totalNGOs, icon: Building2, color: "bg-primary/10", iconColor: "text-primary", path: "/admin/ngos" },
    { label: "Total Workers", value: stats.totalWorkers, icon: Users, color: "bg-accent/10", iconColor: "text-accent", path: "/admin/workers" },
    { label: "Total Hours", value: stats.totalHours, icon: Clock, color: "bg-green-100", iconColor: "text-green-600", path: null },
    { label: "Total Logs", value: stats.totalLogs, icon: ClipboardList, color: "bg-purple-100", iconColor: "text-purple-600", path: null },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full mb-2">
          Admin Access
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-1">SevaLog Admin</h1>
        <p className="text-muted-foreground">Complete overview of the entire SevaLog network</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              onClick={() => card.path && navigate(card.path)}
              className={`bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all ${card.path ? "cursor-pointer hover:-translate-y-0.5" : ""}`}
            >
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
              <p className="text-4xl font-bold text-foreground">{card.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}