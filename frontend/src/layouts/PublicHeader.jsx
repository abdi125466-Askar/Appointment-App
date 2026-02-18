import { NavLink, Link } from "react-router-dom";
import { Bell } from "lucide-react";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-bold transition ${
    isActive ? "text-emerald-400" : "text-slate-200 hover:text-white"
  }`;

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900/95 to-emerald-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          {/* ✅ Logo only (text removed) */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Appointify"
              className="
                h-28 md:h-45 w-auto object-contain
              "

             
            />
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/services" className={navClass}>
              Services
            </NavLink>
            <NavLink to="/track" className={navClass}>
              Track
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
              <Bell className="text-slate-200" size={20} />
            </button>

            <Link
              to="/login"
              className="
                px-5 py-2 rounded-xl font-bold text-white
                bg-gradient-to-r from-blue-600 to-emerald-600
                shadow-lg shadow-emerald-600/15
                hover:brightness-110 transition
              "
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
