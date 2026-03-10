export function Settings() {
  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your NGO account settings</p>
        </div>

        <div className="space-y-6">
          {/* NGO Details */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              NGO Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm">NGO Name</label>
                <input
                  type="text"
                  defaultValue="Seva Foundation"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Registration Number</label>
                <input
                  type="text"
                  defaultValue="NGO-2023-12345"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Contact Email</label>
                <input
                  type="email"
                  defaultValue="contact@sevafoundation.org"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Account Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
