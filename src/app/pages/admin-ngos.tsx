import { useEffect, useState } from "react";
import { Building2, Users, Trash2, Plus, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function AdminNGOs() {
  const [ngos, setNgos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", registration_number: "", city: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { fetchNGOs(); }, []);

  const fetchNGOs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("ngos").select("*, workers(count)").order("created_at", { ascending: false });
    setNgos(data || []);
    setLoading(false);
  };

  const handleAddNGO = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { error: dbError } = await supabase.from("ngos").insert({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      registration_number: formData.registration_number,
      city: formData.city,
      phone: formData.phone,
      status: "active",
    });

    if (dbError) {
      setError(dbError.message);
      setSubmitting(false);
      return;
    }

    setSuccess(`NGO "${formData.name}" added successfully!`);
    setFormData({ name: "", email: "", password: "", registration_number: "", city: "", phone: "" });
    setShowForm(false);
    setSubmitting(false);
    fetchNGOs();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;
    await supabase.from("ngos").delete().eq("id", id);
    fetchNGOs();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">All NGOs</h1>
          <p className="text-muted-foreground">Manage all registered NGOs on SevaLog</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add NGO
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
          <h2 className="text-lg font-bold text-foreground mb-4">Add New NGO</h2>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <form onSubmit={handleAddNGO} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm">NGO Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Seva Foundation" required />
            </div>
            <div>
              <label className="block mb-2 text-sm">Email *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="admin@ngo.org" required />
            </div>
            <div>
              <label className="block mb-2 text-sm">Password *</label>
              <input type="text" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="ngo@2026" required />
            </div>
            <div>
              <label className="block mb-2 text-sm">Registration Number</label>
              <input type="text" value={formData.registration_number} onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="NGO-2023-12345" />
            </div>
            <div>
              <label className="block mb-2 text-sm">City</label>
              <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Mumbai" />
            </div>
            <div>
              <label className="block mb-2 text-sm">Phone</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+91 XXXXX XXXXX" />
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

      {/* NGOs Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                {["NGO Name", "Email", "City", "Registration No.", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ngos.map((ngo) => (
                <tr key={ngo.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{ngo.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-foreground">{ngo.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{ngo.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{ngo.city || "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-sm">{ngo.registration_number || "—"}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      {ngo.status || "active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(ngo.id, ngo.name)}
                      className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ngos.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">No NGOs registered yet.</div>
          )}
        </div>
      )}
    </div>
  );
}