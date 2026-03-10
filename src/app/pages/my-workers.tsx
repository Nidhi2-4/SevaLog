import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ExternalLink } from "lucide-react";

const workers = [
  {
    id: "SL-2025-12345",
    name: "Priya Sharma",
    phone: "+91 98765 43210",
    village: "Kharagpur",
    workType: "Health Worker",
    totalHours: 342,
    joinedDate: "2024-01-15",
  },
  {
    id: "SL-2025-12346",
    name: "Ramesh Kumar",
    phone: "+91 98765 43211",
    village: "Bhubaneswar",
    workType: "Volunteer",
    totalHours: 276,
    joinedDate: "2024-02-20",
  },
  {
    id: "SL-2025-12347",
    name: "Anjali Mehta",
    phone: "+91 98765 43212",
    village: "Cuttack",
    workType: "Anganwadi",
    totalHours: 412,
    joinedDate: "2023-11-10",
  },
  {
    id: "SL-2025-12348",
    name: "Suresh Patel",
    phone: "+91 98765 43213",
    village: "Rourkela",
    workType: "Health Worker",
    totalHours: 189,
    joinedDate: "2024-05-08",
  },
  {
    id: "SL-2025-12349",
    name: "Lakshmi Reddy",
    phone: "+91 98765 43214",
    village: "Puri",
    workType: "Volunteer",
    totalHours: 298,
    joinedDate: "2024-03-22",
  },
];

export function MyWorkers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                  SevaLog ID
                </th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                  Phone
                </th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                  Village
                </th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                  Work Type
                </th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                  Total Hours
                </th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-foreground font-medium">
                    {worker.name}
                  </td>
                  <td className="px-6 py-4 text-foreground font-mono text-sm">
                    {worker.id}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{worker.phone}</td>
                  <td className="px-6 py-4 text-muted-foreground">{worker.village}</td>
                  <td className="px-6 py-4 text-muted-foreground">{worker.workType}</td>
                  <td className="px-6 py-4 text-foreground font-semibold">
                    {worker.totalHours}h
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/worker/${worker.id}`)}
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

        {filteredWorkers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No workers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
