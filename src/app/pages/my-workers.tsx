import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, ExternalLink } from "lucide-react";
import { supabase } from "../../lib/supabase";

const NGO_ID = "97ca7934-5e2f-4939-97f4-4c6c4c9ab3a8";

export function MyWorkers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .eq("ngo_id", NGO_ID)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setWorkers(data);
    }
    setLoading(false);
  };

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.sevalog_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.phone.includes(searchQuery)
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">My Workers</h1>
        <p className="text-muted-foreground">
          Manage all workers registered under your NGO
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search by name, ID, or phone..."
          />
        </div>
      </div>

      {/* Workers Table */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading workers...
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Name</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">SevaLog ID</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Phone</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Village</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Work Type</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Total Hours</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4 text-foreground font-medium">{worker.full_name}</td>
                    <td className="px-6 py-4 text-foreground font-mono text-sm">{worker.sevalog_id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{worker.phone}</td>
                    <td className="px-6 py-4 text-muted-foreground">{worker.village}</td>
                    <td className="px-6 py-4 text-muted-foreground">{worker.work_type}</td>
                    <td className="px-6 py-4 text-foreground font-semibold">{worker.total_hours}h</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/worker/${worker.sevalog_id}`)}
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

          {filteredWorkers.length === 0 && !loading && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No workers found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}