import { useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/navbar";
import { LoginModal } from "../components/login-modal";
import { CheckCircle, Shield, Users } from "lucide-react";

export function LandingPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginTab, setLoginTab] = useState<"ngo" | "verifier">("ngo");
  const navigate = useNavigate();

  const openNGOLogin = () => {
    setLoginTab("ngo");
    setLoginModalOpen(true);
  };

  const openVerifierLogin = () => {
    setLoginTab("verifier");
    setLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-semibold text-primary mb-6">
            Proof of Work, Finally.
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            A verified work record system for India's informal community workforce
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={openNGOLogin}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              NGO Login
            </button>
            <button
              onClick={openVerifierLogin}
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Verify a Worker
            </button>
            <button
              onClick={() => {
                document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="learn-more" className="bg-secondary py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center text-primary mb-16">
            Building Trust, One Log at a Time
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">
                Verified Records
              </h3>
              <p className="text-muted-foreground">
                Every work hour is logged and verified by trusted NGOs, creating
                an immutable record of community service.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">
                Instant Verification
              </h3>
              <p className="text-muted-foreground">
                Banks and employers can instantly verify a worker's experience
                using their unique SevaLog ID.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">
                Empowering Workers
              </h3>
              <p className="text-muted-foreground">
                Informal sector workers can finally prove their experience and
                access better opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-semibold text-primary mb-6">
          Ready to get started?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join the network of NGOs building verified work records.
        </p>
        <button
          onClick={openNGOLogin}
          className="px-10 py-4 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity text-lg"
        >
          Register Your NGO
        </button>
      </section>

      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultTab={loginTab}
      />
    </div>
  );
}
