import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, CheckCircle, Shield } from "lucide-react";
import { supabase } from "../../lib/supabase";

const logo = "/logo.png";

export function VerifierPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setSearchResult(null);

    const query = searchQuery.trim();

    const { data: workerData, error } = await supabase
      .from("workers")
      .select("*")
      .or(`phone.eq.${query},sevalog_id.eq.${query}`)
      .single();

    if (error || !workerData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Get logs
    const { data: logsData } = await supabase
      .from("work_logs")
      .select("*, ngos(name)")
      .eq("worker_id", workerData.id);

    // Count unique NGOs
    const uniqueNgos = new Set(logsData?.map((l) => l.ngo_id)).size;

    // Calculate trust score
    const hoursScore = Math.min((workerData.total_hours || 0) / 5, 60);
    const logsScore = Math.min((logsData?.length || 0) * 2, 30);
    const ngosScore = Math.min(uniqueNgos * 5, 10);
    const trustScore = Math.round(hoursScore + logsScore + ngosScore);

    setSearchResult({
      ...workerData,
      trustScore,
      ngosWorkedWith: uniqueNgos,
      verifiedLogs: logsData?.length || 0,
    });

    setLoading(false);
  };

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
          <span className="text-sm text-muted-foreground">Verifier Portal</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-4">
            Verify Worker Records
          </h1>
          <p className="text-lg text-muted-foreground">
            Instantly verify work history and credentials
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                placeholder="Enter SevaLog ID or Phone Number"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-lg disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {notFound && (
            <p className="text-red-600 text-sm mt-3 text-center">
              No worker found with that ID or phone number.
            </p>
          )}
        </form>

        {/* Search Result */}
        {searchResult && (
          <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
            {/* Header with Trust Score */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold mb-1">{searchResult.full_name}</h2>
                  <p className="text-white/80 font-mono">{searchResult.sevalog_id}</p>
                  <p className="text-white/70 text-sm mt-1">
                    {searchResult.village} · {searchResult.work_type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80 mb-1">Trust Score</p>
                  <div className="flex items-center gap-2">
                    <div className="text-5xl font-bold text-accent">
                      {searchResult.trustScore}
                    </div>
                    <Shield className="w-8 h-8 text-accent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 p-6 border-b border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
                <p className="text-3xl font-semibold text-foreground">
                  {searchResult.total_hours}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">NGOs Worked With</p>
                <p className="text-3xl font-semibold text-foreground">
                  {searchResult.ngosWorkedWith}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Verified Logs</p>
                <p className="text-3xl font-semibold text-foreground">
                  {searchResult.verifiedLogs}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-muted-foreground">
                  Member Since:{" "}
                  <span className="text-foreground font-medium">
                    {new Date(searchResult.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-muted-foreground">
                  Phone:{" "}
                  <span className="text-foreground font-medium">
                    {searchResult.phone}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-muted-foreground">
                  All records verified by registered NGOs
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-secondary flex gap-4">
              <button
                onClick={() => navigate(`/worker/${searchResult.sevalog_id}`)}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                View Full Profile
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}