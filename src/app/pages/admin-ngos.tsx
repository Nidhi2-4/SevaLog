import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2, Plus, Clock, Building2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Tab = "active" | "pending" | "rejected";

export function AdminNGOs() {
  const [ngos, setNgos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", registration_number: "", city: "", phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { fetchNGOs(); }, []);

  const fetchNGOs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("ngos")
      .select("*")
      .order("created_at", { ascending: false });
    setNgos(data || []);
    setLoading(false);
  };

  const handleApprove = async (id: string, name: string) => {
    await supabase.from("ngos").update({ status: "active" }).eq("id", id);
    setSuccess(`${name} approved successfully!`);
    setTimeout(() => setSuccess(""), 3000);
    fetchNGOs();
  };

  const handleReject = async (id: string, name: string) => {
    if (!confirm(`Reject ${name}?`)) return;
    await supabase.from("ngos").update({ status: "rejected" }).eq("id", id);
    fetchNGOs();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete ${name}?`)) return;
    await supabase.from("ngos").delete().eq("id", id);
    fetchNGOs();
  };

  const handleAddNGO = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { data: existing } = await supabase
      .from("ngos").select("id").eq("email", formData.email).single();

    if (existing) {
      setError("An NGO with this email already exists.");
      setSubmitting(false);
      return;
    }

    const { error: dbError } = await supabase.from("ngos").insert({
      ...formData,
      status: "active",
    });

    if (dbError) {
      setError(dbError.message);
      setSubmitting(false);
      return;
    }

    setSuccess(`NGO "${formData.name}" added and activated!`);
    setFormData({ name: "", email: "", password: "", registration_number: "", city: "", phone: "" });
    setShowForm(false);
    setSubmitting(false);
    fetchNGOs();
    setTimeout(() => setSuccess(""), 3000);
  };

  const filtered = ngos.filter((n) => (n.status || "active") === activeTab);
  const pendingCount = ngos.filter((n) => n.status === "pending").length;

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "pending", label: "Pending Approval", icon: Clock },
    { key: "active", label: "Active NGOs", icon: CheckCircle },
    { key: "rejected", label: "Rejected", icon: XCircle },
  ];

  const inputClass = "w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">NGO Management</h1>
          <p className="text-muted-foreground">Review and manage all NGOs on SevaLog</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add NGO Directly
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Add NGO Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Add NGO Directly (Auto-Approved)</h2>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <form onSubmit={handleAddNGO} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm">NGO Name *</label>
              <input type="text" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass} placeholder="Seva Foundation" required />
            </div>
            <div>
              <label className="block mb-2 text-sm">Email *</label>
              <input type="email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass} placeholder="admin@ngo.org" required />
            </div>
            <div>
              <label className="block mb-2 text-sm">Password *</label>
              <input type="text" value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClass} placeholder="ngo@2026" required />
            </div>
            <div>
              <label className="block mb-2 text-sm">Registration Number</label>
              <input type="text" value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                className={inputClass} placeholder="NGO-2023-12345" />
            </div>
            <div>
              <label className="block mb-2 text-sm">City</label>
              <input type="text" value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={inputClass} placeholder="Mumbai" />
            </div>
            <div>
              <label className="block mb-2 text-sm">Phone</label>
              <input type="text" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClass} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50">
                {submitting ? "Adding..." : "Add NGO"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-border rounded-lg hover:bg-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = ngos.filter((n) => (n.status || "active") === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : tab.key === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* NGOs Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-16 text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">
            {activeTab === "pending" ? "No pending applications 🎉" : `No ${activeTab} NGOs`}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                {["NGO Name", "Email", "City", "Reg. No.", "Applied On", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((ngo) => (
                <tr key={ngo.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">{ngo.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-foreground">{ngo.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">{ngo.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{ngo.city || "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{ngo.registration_number || "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    {new Date(ngo.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {activeTab === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(ngo.id, ngo.name)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(ngo.id, ngo.name)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </>
                      )}
                      {activeTab === "active" && (
                        <button
                          onClick={() => handleReject(ngo.id, ngo.name)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Suspend
                        </button>
                      )}
                      {activeTab === "rejected" && (
                        <button
                          onClick={() => handleApprove(ngo.id, ngo.name)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Re-approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(ngo.id, ngo.name)}
                        className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}