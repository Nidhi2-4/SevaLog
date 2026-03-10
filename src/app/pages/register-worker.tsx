import { useState } from "react";
import { CheckCircle } from "lucide-react";

export function RegisterWorker() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    village: "",
    workType: "",
    ngoName: "Seva Foundation",
  });
  const [submitted, setSubmitted] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a mock SevaLog ID
    const newId = `SL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedId(newId);
    setSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        phoneNumber: "",
        village: "",
        workType: "",
        ngoName: "Seva Foundation",
      });
    }, 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
              SevaLog ID Created
            </h2>
            <p className="text-4xl font-mono font-semibold text-green-600 mb-4">
              {generatedId}
            </p>
            <p className="text-green-700">
              SMS sent to {formData.phoneNumber}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8">
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
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Register Worker
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
