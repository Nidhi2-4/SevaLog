import { useNavigate } from "react-router";
import logo from "figma:asset/85248772586b99de15e77f83e48a42b2a67f744d.png";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="SevaLog" className="h-12 w-auto" />
          <span className="text-xl font-semibold text-primary">SevaLog</span>
        </button>
      </div>
    </nav>
  );
}