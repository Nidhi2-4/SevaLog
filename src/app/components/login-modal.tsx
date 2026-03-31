import { useState } from "react";
import { useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { X } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "ngo" | "verifier";
}

export function LoginModal({ open, onClose, defaultTab = "ngo" }: LoginModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNGOLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: dbError } = await supabase
      .from("ngos")
      .select("*")
      .eq("email", email)
      .single();

    if (dbError || !data) {
      setError("Invalid email or NGO not found.");
      setLoading(false);
      return;
    }

    // Store NGO info in localStorage for session
    localStorage.setItem("ngo_id", data.id);
    localStorage.setItem("ngo_name", data.name);
    localStorage.setItem("ngo_email", data.email);

    setLoading(false);
    navigate("/ngo/dashboard");
    onClose();
  };

  const handleVerifierLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // For verifiers, any valid email format works for now
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    localStorage.setItem("verifier_email", email);
    setLoading(false);
    navigate("/verifier");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
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
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary rounded-lg p-1">
              <TabsTrigger
                value="ngo"
                className="rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                NGO Login
              </TabsTrigger>
              <TabsTrigger
                value="verifier"
                className="rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Verifier Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ngo">
              <form onSubmit={handleNGOLogin} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="you@ngo.org"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  Demo credentials:{" "}
                  <span className="text-primary font-mono">admin@sevafoundation.org</span>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="verifier">
              <form onSubmit={handleVerifierLogin} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="you@bank.com"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}