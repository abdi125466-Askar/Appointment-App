import { NavLink, Link } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-bold transition ${
    isActive ? "text-emerald-400" : "text-slate-200 hover:text-white"
  }`;

export default function PublicHeader() {
  const [open, setOpen] = useState(false);

  // close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900/95 to-emerald-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img
              src="/logo.png"
              alt="Appointify"
              className="h-16 sm:h-45 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
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

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
              <Bell className="text-slate-200" size={20} />
            </button>

            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 sm:px-5 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-600 shadow-lg shadow-emerald-600/15 hover:brightness-110 transition"
            >
              Admin Login
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="text-slate-200" size={22} /> : <Menu className="text-slate-200" size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-white/10">
            <div className="px-4 py-3 flex flex-col gap-2">
              <NavLink to="/" className={navClass} onClick={() => setOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/services" className={navClass} onClick={() => setOpen(false)}>
                Services
              </NavLink>
              <NavLink to="/track" className={navClass} onClick={() => setOpen(false)}>
                Track
              </NavLink>
              <NavLink to="/about" className={navClass} onClick={() => setOpen(false)}>
                About
              </NavLink>

              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-600 shadow-lg shadow-emerald-600/15 hover:brightness-110 transition"
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}