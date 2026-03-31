import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, Calendar, ArrowLeft, Shield } from "lucide-react";
const logo = "/logo.png";
import { supabase } from "../../lib/supabase";

export function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [ngos, setNgos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) fetchWorkerData(id);
  }, [id]);

  const fetchWorkerData = async (sevalogId: string) => {
    setLoading(true);

    // Fetch worker
    const { data: workerData, error } = await supabase
      .from("workers")
      .select("*")
      .eq("sevalog_id", sevalogId)
      .single();

    if (error || !workerData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setWorker(workerData);

    // Fetch work logs with NGO info
    const { data: logsData } = await supabase
      .from("work_logs")
      .select("*, ngos(name)")
      .eq("worker_id", workerData.id)
      .order("date", { ascending: false });

    setLogs(logsData || []);

    // Build NGOs worked with summary
    const ngoMap: Record<string, { name: string; hours: number }> = {};
    logsData?.forEach((log) => {
      const ngoName = log.ngos?.name || "Unknown NGO";
      if (!ngoMap[ngoName]) ngoMap[ngoName] = { name: ngoName, hours: 0 };
      ngoMap[ngoName].hours += log.hours;
    });
    setNgos(Object.values(ngoMap));

    setLoading(false);
  };

  const calculateTrustScore = () => {
    if (!worker) return 0;
    const hoursScore = Math.min(worker.total_hours / 5, 60);
    const logsScore = Math.min(logs.length * 2, 30);
    const ngosScore = Math.min(ngos.length * 5, 10);
    return Math.round(hoursScore + logsScore + ngosScore);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading worker profile...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold text-foreground mb-2">Worker Not Found</p>
          <p className="text-muted-foreground mb-6">No worker found with ID: {id}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const trustScore = calculateTrustScore();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="SevaLog" className="h-12 w-auto" />
            <span className="text-xl font-semibold text-primary">SevaLog</span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Worker Info */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-semibold text-foreground mb-2">
                {worker.full_name}
              </h1>
              <p className="text-lg font-mono text-muted-foreground mb-2">
                {worker.sevalog_id}
              </p>
              <p className="text-muted-foreground mb-2">
                📍 {worker.village} · {worker.work_type}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  Member Since{" "}
                  {new Date(worker.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              {/* Trust Score */}
              <div className="text-center bg-primary/10 rounded-lg px-6 py-4 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Trust Score</p>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-4xl font-bold text-primary">{trustScore}</span>
                </div>
              </div>

              {/* Total Hours */}
              <div className="text-center bg-accent/10 rounded-lg px-6 py-4 border-2 border-accent/30">
                <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-accent" />
                  <span className="text-4xl font-bold text-accent">
                    {worker.total_hours}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NGOs Worked With */}
        {ngos.length > 0 && (
          <div className="bg-card border border-border rounded-lg mb-8">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-semibold text-foreground">NGOs Worked With</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-8 overflow-x-auto pb-4">
                {ngos.map((ngo, index) => (
                  <div key={ngo.name} className="flex items-center gap-4 min-w-fit">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
                        <span className="text-white font-semibold text-xl">
                          {ngo.name.charAt(0)}
                        </span>
                      </div>
                      <p className="font-medium text-foreground whitespace-nowrap">{ngo.name}</p>
                      <p className="text-xs text-muted-foreground">{ngo.hours}h logged</p>
                    </div>
                    {index < ngos.length - 1 && (
                      <div className="w-12 h-0.5 bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Work Logs */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-foreground">Work History</h2>
          </div>
          {logs.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No work logs yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Date</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">NGO</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Work Type</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Location</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Hours</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4 text-foreground">
                        {new Date(log.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-foreground font-medium">
                        {log.ngos?.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{log.work_type}</td>
                      <td className="px-6 py-4 text-muted-foreground">{log.location}</td>
                      <td className="px-6 py-4 text-foreground font-semibold">{log.hours}h</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Verified</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}