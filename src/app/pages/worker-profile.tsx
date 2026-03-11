import { useParams, useNavigate } from "react-router";
import { CheckCircle, Clock, Calendar, ArrowLeft } from "lucide-react";
import logo from "/logo.png";

// Mock data
const workerData = {
  name: "Priya",
  fullName: "Priya Sharma",
  id: "SL-2025-12345",
  totalHours: 342,
  memberSince: "2024-01-15",
  phone: "+91 98765 43210",
  village: "Kharagpur",
};

const ngosWorkedWith = [
  { id: 1, name: "Seva Foundation", startDate: "2024-01-15", hours: 198 },
  { id: 2, name: "Rural Health Initiative", startDate: "2024-06-10", hours: 87 },
  { id: 3, name: "Community Welfare Trust", startDate: "2025-01-05", hours: 57 },
];

const workLogs = [
  {
    id: 1,
    date: "2026-03-09",
    ngoName: "Seva Foundation",
    workType: "Health Worker",
    hours: 8,
    location: "Kharagpur",
    verified: true,
  },
  {
    id: 2,
    date: "2026-03-08",
    ngoName: "Seva Foundation",
    workType: "Health Worker",
    hours: 7,
    location: "Kharagpur",
    verified: true,
  },
  {
    id: 3,
    date: "2026-03-06",
    ngoName: "Rural Health Initiative",
    workType: "Health Worker",
    hours: 8,
    location: "Bhubaneswar",
    verified: true,
  },
  {
    id: 4,
    date: "2026-03-05",
    ngoName: "Community Welfare Trust",
    workType: "Volunteer",
    hours: 6,
    location: "Cuttack",
    verified: true,
  },
  {
    id: 5,
    date: "2026-03-03",
    ngoName: "Seva Foundation",
    workType: "Health Worker",
    hours: 8,
    location: "Kharagpur",
    verified: true,
  },
  {
    id: 6,
    date: "2026-03-01",
    ngoName: "Rural Health Initiative",
    workType: "Health Worker",
    hours: 7,
    location: "Bhubaneswar",
    verified: true,
  },
];

export function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Worker Info Section */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-semibold text-foreground mb-2">
                {workerData.name}
              </h1>
              <p className="text-lg font-mono text-muted-foreground mb-4">
                {workerData.id}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  Member Since{" "}
                  {new Date(workerData.memberSince).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
            <div className="text-center bg-accent/10 rounded-lg px-8 py-6 border-2 border-accent/30">
              <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-accent" />
                <span className="text-5xl font-bold text-accent">
                  {workerData.totalHours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NGOs Worked With */}
        <div className="bg-card border border-border rounded-lg mb-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-foreground">NGOs Worked With</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-8 overflow-x-auto pb-4">
              {ngosWorkedWith.map((ngo, index) => (
                <div key={ngo.id} className="flex items-center gap-4 min-w-fit">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
                      <span className="text-white font-semibold text-xl">
                        {ngo.name.charAt(0)}
                      </span>
                    </div>
                    <p className="font-medium text-foreground whitespace-nowrap">
                      {ngo.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ngo.hours}h logged
                    </p>
                  </div>
                  {index < ngosWorkedWith.length - 1 && (
                    <div className="w-12 h-0.5 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Work Logs Table */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-foreground">Work History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                    NGO Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                    Work Type
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                    Hours
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {workLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4 text-foreground">
                      {new Date(log.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-foreground font-medium">
                      {log.ngoName}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{log.workType}</td>
                    <td className="px-6 py-4 text-muted-foreground">{log.location}</td>
                    <td className="px-6 py-4 text-foreground font-semibold">
                      {log.hours}h
                    </td>
                    <td className="px-6 py-4">
                      {log.verified && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Verified</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}