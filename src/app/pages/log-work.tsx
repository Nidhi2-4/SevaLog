import { useState } from "react";
import { Search } from "lucide-react";

export function LogWork() {
  const [searchQuery, setSearchQuery] = useState("");
  const [workerFound, setWorkerFound] = useState(false);
  const [workerData, setWorkerData] = useState({
    name: "",
    id: "",
    totalHours: 0,
  });
  const [formData, setFormData] = useState({
    workType: "",
    date: new Date().toISOString().split("T")[0],
    hours: "",
    location: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock search - in real app would query database
    if (searchQuery) {
      setWorkerData({
        name: "Priya S.",
        id: searchQuery.startsWith("SL-") ? searchQuery : "SL-2025-12345",
        totalHours: 342,
      });
      setWorkerFound(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTotalHours = workerData.totalHours + parseInt(formData.hours);
    setWorkerData({ ...workerData, totalHours: newTotalHours });
    setSubmitted(true);
    
    // Reset submission state after 3 seconds
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </div>
        </form>

        {/* Work Log Form */}
        {workerFound && (
          <>
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Worker Found</p>
                  <p className="font-semibold text-foreground">{workerData.name}</p>
                  <p className="text-sm font-mono text-muted-foreground">{workerData.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-3xl font-semibold text-accent">
                    {workerData.totalHours}
                  </p>
                </div>
              </div>
            </div>

            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
                <p className="text-green-700 font-medium">
                  ✓ Work logged successfully!
                </p>
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
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Submit Log
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
