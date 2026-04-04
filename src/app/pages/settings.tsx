import { useState, useEffect } from "react";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function Settings() {
  const [ngoData, setNgoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [form, setForm] = useState({
    name: "",
    registration_number: "",
    email: "",
    city: "",
    phone: "",
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const ngoId = localStorage.getItem("ngo_id");

  useEffect(() => {
    fetchNGO();
  }, []);

  const fetchNGO = async () => {
    if (!ngoId) return;
    setLoading(true);
    const { data } = await supabase
      .from("ngos")
      .select("*")
      .eq("id", ngoId)
      .single();
    if (data) {
      setNgoData(data);
      setForm({
        name: data.name || "",
        registration_number: data.registration_number || "",
        email: data.email || "",
        city: data.city || "",
        phone: data.phone || "",
      });
    }
    setLoading(false);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const { error: dbError } = await supabase
      .from("ngos")
      .update({
        name: form.name,
        registration_number: form.registration_number,
        city: form.city,
        phone: form.phone,
      })
      .eq("id", ngoId);

    if (dbError) {
      setError(dbError.message);
    } else {
      localStorage.setItem("ngo_name", form.name);
      setSuccess("NGO details updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setSaving(true);

    // Verify current password
    const { data, error: checkError } = await supabase
      .from("ngos")
      .select("id")
      .eq("id", ngoId)
      .eq("password", pwForm.currentPassword)
      .single();

    if (checkError || !data) {
      setError("Current password is incorrect.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("ngos")
      .update({ password: pwForm.newPassword })
      .eq("id", ngoId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Password changed successfully!");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(""), 3000);
    }
    setSaving(false);
  };

  const inputClass =
    "w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your NGO account settings</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* NGO Details */}
          <form onSubmit={handleSaveDetails} className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">NGO Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm">NGO Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Registration Number</label>
                <input
                  type="text"
                  value={form.registration_number}
                  onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
                  className={inputClass}
                  placeholder="NGO-2023-XXXXX"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Contact Email</label>
                <input
                  type="email"
                  value={form.email}
                  className={`${inputClass} cursor-not-allowed opacity-60`}
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed. Contact SevaLog admin.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={inputClass}
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Details"}
              </button>
            </div>
          </form>

          {/* Change Password */}
          <form onSubmit={handleChangePassword} className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Change Password</h2>
            <div className="space-y-4">
              {[
                { label: "Current Password", key: "currentPassword", show: showCurrentPw, toggle: () => setShowCurrentPw(!showCurrentPw) },
                { label: "New Password", key: "newPassword", show: showNewPw, toggle: () => setShowNewPw(!showNewPw) },
                { label: "Confirm New Password", key: "confirmPassword", show: showConfirmPw, toggle: () => setShowConfirmPw(!showConfirmPw) },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block mb-2 text-sm">{field.label}</label>
                  <div className="relative">
                    <input
                      type={field.show ? "text" : "password"}
                      value={pwForm[field.key as keyof typeof pwForm]}
                      onChange={(e) => setPwForm({ ...pwForm, [field.key]: e.target.value })}
                      className={`${inputClass} pr-12`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={field.toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {field.show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>

          {/* NGO Info Card */}
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Account Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">NGO ID</span>
                <span className="font-mono text-xs text-foreground">{ngoId?.slice(0, 16)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-foreground">
                  {ngoData?.created_at
                    ? new Date(ngoData.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long" })
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}