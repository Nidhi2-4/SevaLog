import { useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "../../lib/supabase";

const NGO_ID = localStorage.getItem("ngo_id") || "";
export function LogWork() {
  const [searchQuery, setSearchQuery] = useState("");
  const [workerFound, setWorkerFound] = useState(false);
  const [workerData, setWorkerData] = useState<any>(null);
  const [formData, setFormData] = useState({
    workType: "",
    date: new Date().toISOString().split("T")[0],
    hours: "",
    location: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");

  const generateHash = (workerId: string, ngoId: string, date: string, workType: string, hours: string) => {
    const str = `${workerId}-${ngoId}-${date}-${workType}-${hours}-${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setSearchError("");
    setWorkerFound(false);

    const query = searchQuery.trim();

    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .or(`phone.eq.${query},sevalog_id.eq.${query}`)
      .single();

    if (error || !data) {
      setSearchError("No worker found with that phone number or SevaLog ID.");
      setSearching(false);
      return;
    }

    setWorkerData(data);
    setWorkerFound(true);
    setSearching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const hash = generateHash(
      workerData.id,
      NGO_ID,
      formData.date,
      formData.workType,
      formData.hours
    );

    const { error: logError } = await supabase.from("work_logs").insert({
      worker_id: workerData.id,
      ngo_id: NGO_ID,
      work_type: formData.workType,
      date: formData.date,
      hours: parseFloat(formData.hours),
      location: formData.location,
      notes: formData.notes,
      log_hash: hash,
    });

    if (logError) {
      setError(logError.message);
      setLoading(false);
      return;
    }

    // Update total hours
    const newTotalHours = (workerData.total_hours || 0) + parseFloat(formData.hours);
    await supabase
      .from("workers")
      .update({ total_hours: newTotalHours })
      .eq("id", workerData.id);

    setWorkerData({ ...workerData, total_hours: newTotalHours });
    setSubmitted(true);
    setLoading(false);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        workType: "",
        date: new Date().toISOString().split("T")[0],
        hours: "",
        location: "",
        notes: "",
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Log Work</h1>
          <p className="text-muted-foreground">
            Record work hours for a registered worker
          </p>
        </div>

        {/* Search Worker */}
        <form onSubmit={handleSearch} className="bg-card border border-border rounded-lg p-6 mb-6">
          <label htmlFor="search" className="block mb-3 text-sm font-medium">
            Search Worker by Phone or SevaLog ID
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter phone number or SevaLog ID"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
          {searchError && (
            <p className="text-red-600 text-sm mt-3">{searchError}</p>
          )}
        </form>

        {/* Worker Found Card */}
        {workerFound && workerData && (
          <>
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Worker Found</p>
                  <p className="font-semibold text-foreground">{workerData.full_name}</p>
                  <p className="text-sm font-mono text-muted-foreground">{workerData.sevalog_id}</p>
                  <p className="text-sm text-muted-foreground">{workerData.village} · {workerData.work_type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-3xl font-semibold text-accent">
                    {workerData.total_hours}
                  </p>
                </div>
              </div>
            </div>

            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
                <p className="text-green-700 font-medium">
                  ✓ Work logged successfully! SMS sent to worker.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="workType" className="block mb-2 text-sm">
                    Work Type
                  </label>
                  <select
                    id="workType"
                    name="workType"
                    value={formData.workType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select work type</option>
                    <option value="Health Worker">Health Worker</option>
                    <option value="Anganwadi">Anganwadi</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block mb-2 text-sm">
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="hours" className="block mb-2 text-sm">
                    Hours
                  </label>
                  <input
                    id="hours"
                    name="hours"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.hours}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="8"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block mb-2 text-sm">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Village/Area"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block mb-2 text-sm">
                    Notes <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Additional notes about the work..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Log"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}