import { useState } from "react";
import { CheckCircle, Phone } from "lucide-react";
import { supabase } from "../../lib/supabase";

const NGO_ID = "97ca7934-5e2f-4939-97f4-4c6c4c9ab3a8";
const NGO_NAME = "Seva Foundation";
const SUPABASE_URL = "https://iibpqavahozriwjtqsne.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpYnBxYXZhaG96cml3anRxc25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MjY2NzAsImV4cCI6MjA5MDUwMjY3MH0.ka50ktaH7LA7uxcHlbaAlEbfFUQrS3qdTCcTwyfEsfQ";

export function RegisterWorker() {
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    village: "",
    workType: "",
    ngoName: NGO_NAME,
  });
  const [otp, setOtp] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSevalogId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `SL-${year}-${random}`;
  };

  const callEdgeFunction = async (payload: object) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-otp-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Send OTP to worker's phone
    const otpResult = await callEdgeFunction({
      phone: formData.phoneNumber,
      type: "send-otp",
    });

    console.log("OTP result:", otpResult);

    if (!otpResult.success) {
      setError("Failed to send OTP. Please check the phone number.");
      setLoading(false);
      return;
    }

    setStep("otp");
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Verify OTP
    const verifyResult = await callEdgeFunction({
      phone: formData.phoneNumber,
      code: otp,
      type: "verify-otp",
    });

    console.log("Verify result:", verifyResult);

    if (!verifyResult.success) {
      setError("Invalid OTP. Please try again.");
      setLoading(false);
      return;
    }

    // OTP verified — now save to database
    const newId = generateSevalogId();

    const { error: dbError } = await supabase.from("workers").insert({
      sevalog_id: newId,
      full_name: formData.fullName,
      phone: formData.phoneNumber,
      village: formData.village,
      work_type: formData.workType,
      ngo_id: NGO_ID,
      total_hours: 0,
    }).select();

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    // Send notification SMS with SevaLog ID
    await callEdgeFunction({
      phone: formData.phoneNumber,
      workerName: formData.fullName,
      sevalogId: newId,
      ngoName: NGO_NAME,
      type: "notify",
    });

    setGeneratedId(newId);
    setStep("success");
    setLoading(false);
  };

  const handleReset = () => {
    setStep("form");
    setFormData({ fullName: "", phoneNumber: "", village: "", workType: "", ngoName: NGO_NAME });
    setOtp("");
    setGeneratedId("");
    setError("");
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Register Worker</h1>
          <p className="text-muted-foreground">Add a new worker to the SevaLog system</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-3 mb-8">
          {["Worker Details", "Verify Phone", "Done"].map((label, i) => {
            const stepIndex = ["form", "otp", "success"].indexOf(step);
            const isActive = i === stepIndex;
            const isDone = i < stepIndex;
            return (
              <div key={label} className="flex items-center gap-3">
                <div className={`flex items-center gap-2`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    isDone ? "bg-green-500 text-white" :
                    isActive ? "bg-primary text-white" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {isDone ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </div>
                {i < 2 && <div className={`w-8 h-0.5 ${i < stepIndex ? "bg-green-500" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        {/* Step 1 — Form */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8">
            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"><p className="text-red-700 text-sm">{error}</p></div>}
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">Worker Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">Worker will receive an OTP on this number</p>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Village/Area</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter village or area"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Type of Work</label>
                <select
                  value={formData.workType}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
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
                <label className="block mb-2 text-sm font-medium">NGO Name</label>
                <input
                  type="text"
                  value={formData.ngoName}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">Auto-filled</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
              >
                {loading ? "Sending OTP..." : "Send OTP to Worker →"}
              </button>
            </div>
          </form>
        )}

        {/* Step 2 — OTP */}
        {step === "otp" && (
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Verify Worker's Phone</h2>
              <p className="text-muted-foreground text-sm">
                An OTP has been sent to <span className="font-medium text-foreground">{formData.phoneNumber}</span>
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Ask the worker to share the OTP they received
              </p>
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"><p className="text-red-700 text-sm">{error}</p></div>}

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-center">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-4 bg-input-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
              >
                {loading ? "Verifying..." : "Verify & Register Worker"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("form"); setError(""); }}
                className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Go back and change number
              </button>
            </form>
          </div>
        )}

        {/* Step 3 — Success */}
        {step === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Worker Registered!</h2>
            <p className="text-4xl font-mono font-bold text-green-600 mb-4">{generatedId}</p>
            <div className="space-y-2 mb-8">
              <p className="text-green-700 text-sm">✓ Phone number verified via OTP</p>
              <p className="text-green-700 text-sm">✓ Worker profile created in database</p>
              <p className="text-green-700 text-sm">✓ SMS sent to {formData.phoneNumber} with SevaLog ID</p>
            </div>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium"
            >
              Register Another Worker
            </button>
          </div>
        )}
      </div>
    </div>
  );
}