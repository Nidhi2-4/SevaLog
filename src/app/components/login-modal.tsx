import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { X } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "ngo" | "verifier";
}

export function LoginModal({ open, onClose, defaultTab = "ngo" }: LoginModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNGOLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app would validate credentials
    navigate("/ngo/dashboard");
    onClose();
  };

  const handleVerifierLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app would validate credentials
    navigate("/verifier");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      {/* Modal */}
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
                  <label htmlFor="ngo-email" className="block mb-2 text-sm">
                    Email
                  </label>
                  <input
                    id="ngo-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="you@ngo.org"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="ngo-password" className="block mb-2 text-sm">
                    Password
                  </label>
                  <input
                    id="ngo-password"
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
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Login
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  New NGO?{" "}
                  <a href="#" className="text-primary hover:underline">
                    Register here
                  </a>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="verifier">
              <form onSubmit={handleVerifierLogin} className="space-y-4">
                <div>
                  <label htmlFor="verifier-email" className="block mb-2 text-sm">
                    Email
                  </label>
                  <input
                    id="verifier-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="you@bank.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="verifier-password" className="block mb-2 text-sm">
                    Password
                  </label>
                  <input
                    id="verifier-password"
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
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Login
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  New Verifier?{" "}
                  <a href="#" className="text-primary hover:underline">
                    Register here
                  </a>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
