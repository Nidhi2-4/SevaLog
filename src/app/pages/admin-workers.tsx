import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search, ExternalLink, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function AdminWorkers() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchWorkers(); }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("workers")
      .select("*, ngos(name)")
      .order("created_at", { ascending: false });
    setWorkers(data || []);
    setLoading(false);
  };

  const handleDelete = async (workerId: string, workerName: string) => {
    if (!confirm(`Delete ${workerName}? This will also delete all their work logs.`)) return;
    await supabase.from("work_logs").delete().eq("worker_id", workerId);
    await supabase.from("workers").delete().eq("id", workerId);
    fetchWorkers();
  };

  const filtered = workers.filter((w) =>
    w.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.sevalog_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.phone.includes(searchQuery) ||
    w.ngos?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">All Workers</h1>
        <p className="text-muted-foreground">Every worker registered across all NGOs on SevaLog</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search by name, ID, phone, or NGO..."
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                {["Name", "SevaLog ID", "Phone", "Village", "Work Type", "NGO", "Hours", "Action"].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((worker) => (
                <tr key={worker.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{worker.full_name}</td>
                  <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{worker.sevalog_id}</td>
                  <td className="px-6 py-4 text-muted-foreground">{worker.phone}</td>
                  <td className="px-6 py-4 text-muted-foreground">{worker.village}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{worker.work_type}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{worker.ngos?.name}</td>
                  <td className="px-6 py-4 font-bold text-foreground">{worker.total_hours}h</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/worker/${worker.sevalog_id}`)}
                        className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(worker.id, worker.full_name)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">No workers found.</div>
          )}
        </div>
      )}
    </div>
  );
}