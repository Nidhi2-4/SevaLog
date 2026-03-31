import { useState, useEffect } from "react";
import { Users, Clock, ClipboardList, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";

const NGO_ID = "97ca7934-5e2f-4939-97f4-4c6c4c9ab3a8";

export function NGODashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalHours: 0,
    logsThisMonth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    // Total workers
    const { count: workerCount } = await supabase
      .from("workers")
      .select("*", { count: "exact", head: true })
      .eq("ngo_id", NGO_ID);

    // Total hours
    const { data: hoursData } = await supabase
      .from("workers")
      .select("total_hours")
      .eq("ngo_id", NGO_ID);

    const totalHours = hoursData?.reduce(
      (sum, w) => sum + (w.total_hours || 0), 0
    ) || 0;

    // Logs this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: logsCount } = await supabase
      .from("work_logs")
      .select("*", { count: "exact", head: true })
      .eq("ngo_id", NGO_ID)
      .gte("created_at", startOfMonth.toISOString());

    // Recent activity - last 5 logs
    const { data: recentLogs } = await supabase
      .from("work_logs")
      .select("*, workers(full_name, sevalog_id)")
      .eq("ngo_id", NGO_ID)
      .order("created_at", { ascending: false })
      .limit(5);

    setStats({
      totalWorkers: workerCount || 0,
      totalHours,
      logsThisMonth: logsCount || 0,
    });

    setRecentActivity(recentLogs || []);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your registered workers and recent activity
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-sm text-muted-foreground mb-1">Total Workers</h3>
              <p className="text-3xl font-semibold text-foreground">{stats.totalWorkers}</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
              </div>
              <h3 className="text-sm text-muted-foreground mb-1">Total Hours Logged</h3>
              <p className="text-3xl font-semibold text-foreground">
                {stats.totalHours.toLocaleString()}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-sm text-muted-foreground mb-1">Logs This Month</h3>
              <p className="text-3xl font-semibold text-foreground">{stats.logsThisMonth}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
            </div>

            {recentActivity.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                No activity yet. Start logging work!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">Worker</th>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">SevaLog ID</th>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">Date</th>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">Work Type</th>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">Hours</th>
                      <th className="text-left px-6 py-4 text-sm text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((activity) => (
                      <tr key={activity.id} className="border-b border-border last:border-0">
                        <td className="px-6 py-4 text-foreground">
                          {activity.workers?.full_name}
                        </td>
                        <td className="px-6 py-4 text-foreground font-mono text-sm">
                          {activity.workers?.sevalog_id}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {activity.work_type}
                        </td>
                        <td className="px-6 py-4 text-foreground">{activity.hours}h</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => navigate(`/worker/${activity.workers?.sevalog_id}`)}
                            className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                          >
                            View Profile
                            <ExternalLink className="w-4 h-4" />
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