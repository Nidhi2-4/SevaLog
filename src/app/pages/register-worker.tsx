import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";


const NGO_NAME = localStorage.getItem("ngo_name") || "Your NGO";
const SUPABASE_URL = "https://iibpqavahozriwjtqsne.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpYnBxYXZhaG96cml3anRxc25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MjY2NzAsImV4cCI6MjA5MDUwMjY3MH0.ka50ktaH7LA7uxcHlbaAlEbfFUQrS3qdTCcTwyfEsfQ";

export function RegisterWorker() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    village: "",
    workType: "",
    ngoName: localStorage.getItem("ngo_name") || "Your NGO",
  });
  const [submitted, setSubmitted] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const NGO_ID = localStorage.getItem("ngo_id") || "";

  const generateSevalogId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `SL-${year}-${random}`;
  };

  const sendNotification = async (phone: string, workerName: string, sevalogId: string) => {
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/send-otp-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          phone,
          workerName,
          sevalogId,
          ngoName: NGO_NAME,
          type: "notify",
        }),
      });
    } catch (err) {
      console.log("SMS notification failed:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

    // Send SMS notification (works for verified numbers)
    await sendNotification(formData.phoneNumber, formData.fullName, newId);

    setGeneratedId(newId);
    setSubmitted(true);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: "",
      phoneNumber: "",
      village: "",
      workType: "",
      ngoName: localStorage.getItem("ngo_name") || "Your NGO",
    });
    setGeneratedId("");
    setError("");
  };

  if (submitted) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Worker Registered!</h2>
            <p className="text-4xl font-mono font-bold text-green-600 mb-6">{generatedId}</p>
            <div className="space-y-2 mb-8 text-left bg-white rounded-xl p-4 border border-green-100">
              <p className="text-green-700 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Worker profile created in database
              </p>
              <p className="text-green-700 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> SevaLog ID assigned: {generatedId}
              </p>
              <p className="text-green-700 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> SMS notification sent to {formData.phoneNumber}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium"
            >
              Register Another Worker
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Register Worker</h1>
          <p className="text-muted-foreground">Add a new worker to the SevaLog system</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Worker Full Name</label>
              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Phone Number</label>
              <input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+91 XXXXX XXXXX"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Worker will receive their SevaLog ID on this number
              </p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Village/Area</label>
              <input
                name="village"
                type="text"
                value={formData.village}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter village or area"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Type of Work</label>
              <select
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
              {loading ? "Registering..." : "Register Worker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}