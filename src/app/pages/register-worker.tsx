import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

const NGO_ID = localStorage.getItem("ngo_id") || "";
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

  const generateSevalogId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `SL-${year}-${random}`;
  };

  const sendSMS = async (phone: string, workerName: string, sevalogId: string) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          phone,
          workerName,
          sevalogId,
          ngoName: localStorage.getItem("ngo_name") || "Your NGO",
        }),
      });
      const data = await response.json();
      console.log("SMS response:", data);
    } catch (err) {
      console.log("SMS error:", err);
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

    // Send SMS
    await sendSMS(formData.phoneNumber, formData.fullName, newId);

    setGeneratedId(newId);
    setSubmitted(true);
    setLoading(false);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        phoneNumber: "",
        village: "",
        workType: "",
        ngoName: NGO_NAME,
      });
    }, 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Register Worker
          </h1>
          <p className="text-muted-foreground">
            Add a new worker to the SevaLog system
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-green-900 mb-2">
              SevaLog ID Created!
            </h2>
            <p className="text-4xl font-mono font-semibold text-green-600 mb-4">
              {generatedId}
            </p>
            <p className="text-green-700">
              ✓ SMS sent to {formData.phoneNumber}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-lg p-8"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            <div className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block mb-2 text-sm">
                  Worker Full Name
                </label>
                <input
                  id="fullName"
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
                <label htmlFor="phoneNumber" className="block mb-2 text-sm">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>
              <div>
                <label htmlFor="village" className="block mb-2 text-sm">
                  Village/Area
                </label>
                <input
                  id="village"
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
                <label htmlFor="workType" className="block mb-2 text-sm">
                  Type of Work
                </label>
                <select
                  id="workType"
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
                <label htmlFor="ngoName" className="block mb-2 text-sm">
                  NGO Name
                </label>
                <input
                  id="ngoName"
                  name="ngoName"
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
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Registering & Sending SMS..." : "Register Worker"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}