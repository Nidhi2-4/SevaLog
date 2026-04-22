import { useState, useEffect } from "react";
import { Users, Clock, ClipboardList, ExternalLink, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";


export function NGODashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalWorkers: 0, totalHours: 0, logsThisMonth: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ngoName = localStorage.getItem("ngo_name") || "Your NGO";
  const NGO_ID = localStorage.getItem("ngo_id") || "";

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    const { count: workerCount } = await supabase
      .from("workers").select("*", { count: "exact", head: true }).eq("ngo_id", NGO_ID);

    const { data: hoursData } = await supabase
      .from("workers").select("total_hours").eq("ngo_id", NGO_ID);

    const totalHours = hoursData?.reduce((sum, w) => sum + (w.total_hours || 0), 0) || 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: logsCount } = await supabase
      .from("work_logs").select("*", { count: "exact", head: true })
      .eq("ngo_id", NGO_ID).gte("created_at", startOfMonth.toISOString());

    const { data: recentLogs } = await supabase
      .from("work_logs").select("*, workers(full_name, sevalog_id)")
      .eq("ngo_id", NGO_ID).order("created_at", { ascending: false }).limit(5);

    setStats({ totalWorkers: workerCount || 0, totalHours, logsThisMonth: logsCount || 0 });
    setRecentActivity(recentLogs || []);
    setLoading(false);
  };

  const statCards = [
    { label: "Total Workers", value: stats.totalWorkers, icon: Users, color: "bg-primary/10", iconColor: "text-primary", suffix: "" },
    { label: "Total Hours Logged", value: stats.totalHours, icon: Clock, color: "bg-accent/10", iconColor: "text-accent", suffix: "h" },
    { label: "Logs This Month", value: stats.logsThisMonth, icon: ClipboardList, color: "bg-green-100", iconColor: "text-green-600", suffix: "" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-accent" />
          <span className="text-sm text-accent font-medium">{ngoName}</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your workers and recent activity</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {statCards.map((card) => (
              <div key={card.label} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                <p className="text-4xl font-bold text-foreground">
                  {card.value.toLocaleString()}{card.suffix}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
              <button
                onClick={() => navigate("/ngo/workers")}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                View all workers <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {recentActivity.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium mb-2">No activity yet</p>
                <p className="text-muted-foreground text-sm">Start by registering workers and logging their work hours</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      {["Worker", "SevaLog ID", "Date", "Work Type", "Hours", "Action"].map((h) => (
                        <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentActivity.map((activity) => (
                      <tr key={activity.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{activity.workers?.full_name}</td>
                        <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{activity.workers?.sevalog_id}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                            {activity.work_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-foreground">{activity.hours}h</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => navigate(`/worker/${activity.workers?.sevalog_id}`)}
                            className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}