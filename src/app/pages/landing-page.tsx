import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { LoginModal } from "../components/login-modal";
import { CheckCircle, Shield, Users, ArrowRight, TrendingUp, Award, MapPin } from "lucide-react";

const logo = "/logo.png";

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function LandingPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginTab, setLoginTab] = useState<"ngo" | "verifier">("ngo");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openNGOLogin = () => { setLoginTab("ngo"); setLoginModalOpen(true); };
  const openVerifierLogin = () => { setLoginTab("verifier"); setLoginModalOpen(true); };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SevaLog" className="h-10 w-auto" />
            <span className="text-xl font-semibold text-primary">SevaLog</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openVerifierLogin} className="px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors">
              Verify a Worker
            </button>
            <button onClick={openNGOLogin} className="px-5 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity">
              NGO Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-amber-50/20" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

        {/* Floating cards */}
        <div className="absolute top-32 right-12 hidden lg:block animate-bounce" style={{ animationDuration: "3s" }}>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-border w-52">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs font-medium text-foreground">Work Logged!</span>
            </div>
            <p className="text-xs text-muted-foreground">Priya S. — 8 hrs</p>
            <p className="text-xs text-muted-foreground">Health Worker · Pune</p>
          </div>
        </div>

        <div className="absolute bottom-40 right-20 hidden lg:block animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-border w-48">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">Trust Score</span>
            </div>
            <p className="text-2xl font-bold text-primary">87</p>
            <p className="text-xs text-muted-foreground">342 hrs verified</p>
          </div>
        </div>

        <div className="absolute top-48 left-12 hidden lg:block animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-border w-44">
            <p className="text-xs text-muted-foreground mb-1">SMS Sent ✓</p>
            <p className="text-xs font-medium text-foreground">SevaLog ID:</p>
            <p className="text-xs font-mono text-primary">SL-2026-48291</p>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-8 border border-primary/20">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Building Digital Identity for India's Invisible Workforce
          </div>

          <h1 className="text-7xl font-bold text-primary mb-6 leading-tight tracking-tight">
            Proof of Work,
            <br />
            <span className="text-accent">Finally.</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
            450 million informal workers in India do years of community service with zero verifiable record.
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            SevaLog changes that — one verified log at a time.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={openNGOLogin}
              className="group flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all text-lg font-medium shadow-lg shadow-primary/25"
            >
              NGO Login
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={openVerifierLogin}
              className="px-8 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all text-lg font-medium"
            >
              Verify a Worker
            </button>
          </div>

          <button
            onClick={() => document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-12 flex flex-col items-center gap-2 mx-auto text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-sm">See the impact</span>
            <div className="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-1">
              <div className="w-1.5 h-3 bg-current rounded-full animate-bounce" />
            </div>
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-accent mb-2">
                <CountUp end={450} />M+
              </p>
              <p className="text-white/70">Informal workers in India</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-accent mb-2">
                ₹<CountUp end={0} />
              </p>
              <p className="text-white/70">Cost to workers</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-accent mb-2">
                <CountUp end={100} />%
              </p>
              <p className="text-white/70">Tamper-proof records</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-accent mb-2">
                <CountUp end={3} />
              </p>
              <p className="text-white/70">Clicks to verify anyone</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">How SevaLog Works</h2>
            <p className="text-muted-foreground text-lg">Three actors. One system. Zero paperwork.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Users,
                title: "NGO Logs Work",
                desc: "Supervisor enters worker's phone number, work type, hours and location. Takes 30 seconds.",
                color: "bg-blue-50 border-blue-100",
                iconColor: "text-primary",
              },
              {
                step: "02",
                icon: CheckCircle,
                title: "Worker Gets Record",
                desc: "Worker receives instant WhatsApp confirmation with their SevaLog ID. No smartphone needed.",
                color: "bg-amber-50 border-amber-100",
                iconColor: "text-accent",
              },
              {
                step: "03",
                icon: Shield,
                title: "Anyone Can Verify",
                desc: "Banks, employers, govt schemes — anyone can verify a worker's full history with their SevaLog ID.",
                color: "bg-green-50 border-green-100",
                iconColor: "text-green-600",
              },
            ].map((item) => (
              <div key={item.step} className={`relative rounded-2xl border-2 p-8 ${item.color} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                <span className="text-6xl font-black text-black/5 absolute top-4 right-6">{item.step}</span>
                <div className={`w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm`}>
                  <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SevaLog */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary mb-6">
                Every system built for ASHA workers was built to watch them.
              </h2>
              <p className="text-xl text-accent font-semibold mb-6">
                SevaLog is the first one built for them to be seen.
              </p>
              <div className="space-y-4">
                {[
                  "Workers own their record — not the government, not the NGO",
                  "Portable across employers, banks, and government schemes",
                  "Works on any phone — just a number is enough",
                  "Tamper-proof hash chain — no one can alter past records",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-border">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Worker Profile</p>
                  <p className="text-xl font-bold text-foreground">Priya Sharma</p>
                  <p className="text-sm font-mono text-muted-foreground">SL-2026-48291</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Trust Score</p>
                  <p className="text-4xl font-black text-primary">87</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Total Hours", value: "342" },
                  { label: "NGOs", value: "3" },
                  { label: "Verified Logs", value: "45" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center bg-secondary rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {["Health Worker · Seva Foundation · 8h", "Anganwadi · Rural Health · 6h", "Volunteer · Community Trust · 7h"].map((log) => (
                  <div key={log} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-medium px-4 py-2 rounded-full mb-8">
              <Award className="w-4 h-4" />
              About SevaLog
            </div>
            <h2 className="text-4xl font-bold text-primary mb-6">
              Built for the people who built India
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              SevaLog was born from a simple observation — ASHA workers, anganwadi workers, and daily wage volunteers do years of verified, life-saving community work, yet when they walk into a bank or apply for a government scheme, they are invisible to every system.
            </p>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              We are a team of students building infrastructure for financial inclusion — starting with the most basic layer: proof that you showed up, did the work, and made a difference.
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">Based in India</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm">Social Impact · Fintech · Digital Identity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to make your workers visible?
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Join SevaLog and start building verified work records today.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={openNGOLogin}
              className="px-10 py-4 bg-accent text-white rounded-xl hover:opacity-90 transition-opacity text-lg font-medium shadow-lg"
            >
              Register Your NGO
            </button>
            <button
              onClick={openVerifierLogin}
              className="px-10 py-4 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-colors text-lg"
            >
              Verify a Worker
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/95 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SevaLog" className="h-8 w-auto brightness-0 invert" />
            <span className="text-white font-semibold">SevaLog</span>
          </div>
          <p className="text-white/50 text-sm">
            © 2026 SevaLog. Building dignity through digital identity.
          </p>
          <p className="text-white/50 text-sm">Made with ❤️ for India's invisible workforce</p>
        </div>
      </footer>

      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultTab={loginTab}
      />
    </div>
  );
}