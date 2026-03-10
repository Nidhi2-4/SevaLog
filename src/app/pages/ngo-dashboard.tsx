import { Users, Clock, ClipboardList, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";

// Mock data
const stats = {
  totalWorkers: 243,
  totalHours: 18567,
  logsThisMonth: 89,
};

const recentActivity = [
  {
    id: 1,
    workerName: "Priya S.",
    sevalogId: "SL-2025-12345",
    lastLogDate: "2026-03-09",
    hours: 8,
    workerId: "SL-2025-12345",
  },
  {
    id: 2,
    workerName: "Ramesh K.",
    sevalogId: "SL-2025-12346",
    lastLogDate: "2026-03-09",
    hours: 6,
    workerId: "SL-2025-12346",
  },
  {
    id: 3,
    workerName: "Anjali M.",
    sevalogId: "SL-2025-12347",
    lastLogDate: "2026-03-08",
    hours: 7,
    workerId: "SL-2025-12347",
  },
  {
    id: 4,
    workerName: "Suresh P.",
    sevalogId: "SL-2025-12348",
    lastLogDate: "2026-03-08",
    hours: 8,
    workerId: "SL-2025-12348",
  },
  {
    id: 5,
    workerName: "Lakshmi R.",
    sevalogId: "SL-2025-12349",
    lastLogDate: "2026-03-07",
    hours: 5,
    workerId: "SL-2025-12349",
  },
];

export function NGODashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your registered workers and recent activity
        </p>
      </div>

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

      {/* Recent Activity Table */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                  Worker Name
                </th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                  SevaLog ID
                </th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                  Last Log Date
                </th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                  Hours
                </th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-foreground">{activity.workerName}</td>
                  <td className="px-6 py-4 text-foreground font-mono text-sm">
                    {activity.sevalogId}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(activity.lastLogDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-foreground">{activity.hours}h</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/worker/${activity.workerId}`)}
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
      </div>
    </div>
  );
}
