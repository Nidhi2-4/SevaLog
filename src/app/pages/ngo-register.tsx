import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";

const logo = "/logo.png";

export function NGORegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    registration_number: "",
    city: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    // Check if email already exists
    const { data: existing } = await supabase
      .from("ngos")
      .select("id")
      .eq("email", form.email)
      .single();

    if (existing) {
      setError("An NGO with this email already exists.");
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase.from("ngos").insert({
  name: form.name,
  email: form.email,
  password: form.password,
  registration_number: form.registration_number,
  city: form.city,
  phone: form.phone,
  status: "pending",
});

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    setStep("success");
    setLoading(false);
  };

  const inputClass =
    "w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

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
            <span className="text-xl font-bold text-primary">SevaLog</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {step === "success" ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-green-900 mb-3">
              NGO Registered Successfully!
            </h2>
            <p className="text-green-700 mb-2 text-lg font-medium">{form.name}</p>
            <p className="text-green-600 mb-8">
  Your application is under review. You'll be able to log in once approved by the SevaLog admin. This usually takes 24 hours.
</p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity text-lg font-medium"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Register Your NGO</h1>
              <p className="text-muted-foreground">
                Join SevaLog and start building verified work records for your workers.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium">NGO Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder="Seva Foundation"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Official Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder="admin@yourngo.org"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">This will be your login email.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Password *</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className={`${inputClass} pr-12`}
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className={`${inputClass} pr-12`}
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showConfirmPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Registration Number</label>
                <input
                  type="text"
                  value={form.registration_number}
                  onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
                  className={inputClass}
                  placeholder="NGO-2023-XXXXX"
                />
                <p className="text-xs text-muted-foreground mt-1">Optional — add if you have one.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={inputClass}
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-lg font-medium"
                >
                  {loading ? "Registering..." : "Register NGO"}
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-primary hover:underline font-medium"
                >
                  Login here
                </button>
              </p>
            </form>
          </>
        )}
      </main>
    </div>
  );
}