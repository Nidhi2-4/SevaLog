import { useState } from "react";
import { useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { X } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "ngo" | "verifier" | "admin";
}

export function LoginModal({ open, onClose, defaultTab = "ngo" }: LoginModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => { setEmail(""); setPassword(""); setError(""); };

  const handleNGOLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error: dbError } = await supabase
      .from("ngos").select("*").eq("email", email).eq("password", password).single();
    if (dbError || !data) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    localStorage.setItem("ngo_id", data.id);
    localStorage.setItem("ngo_name", data.name);
    localStorage.setItem("ngo_email", data.email);
    setLoading(false);
    resetForm();
    navigate("/ngo/dashboard");
    onClose();
  };

  const handleVerifierLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (email === "verify@bank.com" && password === "verify@2026") {
      localStorage.setItem("verifier_email", email);
      setLoading(false);
      resetForm();
      navigate("/verifier");
      onClose();
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error: dbError } = await supabase
      .from("admins").select("*").eq("email", email).eq("password", password).single();
    if (dbError || !data) {
      setError("Invalid admin credentials.");
      setLoading(false);
      return;
    }
    localStorage.setItem("admin_id", data.id);
    localStorage.setItem("admin_name", data.name);
    localStorage.setItem("admin_email", data.email);
    setLoading(false);
    resetForm();
    navigate("/admin/dashboard");
    onClose();
  };

  if (!open) return null;

  const inputClass = "w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const btnClass = "w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-1">Login</h2>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary rounded-lg p-1">
              <TabsTrigger value="ngo" className="rounded-md px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                NGO
              </TabsTrigger>
              <TabsTrigger value="verifier" className="rounded-md px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                Verifier
              </TabsTrigger>
              <TabsTrigger value="admin" className="rounded-md px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                Admin
              </TabsTrigger>
            </TabsList>

            {/* NGO Tab */}
            <TabsContent value="ngo">
              <form onSubmit={handleNGOLogin} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@ngo.org" required />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required />
                </div>
                <button type="submit" disabled={loading} className={btnClass}>
                  {loading ? "Logging in..." : "Login as NGO"}
                </button>
              </form>
            </TabsContent>

            {/* Verifier Tab */}
            <TabsContent value="verifier">
              <form onSubmit={handleVerifierLogin} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@bank.com" required />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required />
                </div>
                <button type="submit" disabled={loading} className={btnClass}>
                  {loading ? "Logging in..." : "Login as Verifier"}
                </button>
              </form>
            </TabsContent>

            {/* Admin Tab */}
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">Admin Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="sevalog.official@gmail.com" required />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required />
                </div>
                <button type="submit" disabled={loading} className={btnClass}>
                  {loading ? "Logging in..." : "Login as Admin"}
                </button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}