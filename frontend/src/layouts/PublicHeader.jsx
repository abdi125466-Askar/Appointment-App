import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ease-out ${
    isActive
      ? "text-[#3B82F6] bg-[#2563EB]/10 border border-[#2563EB]/20"
      : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 border border-transparent"
  }`;

export default function PublicHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-white/10">
      <div className="h-20 bg-[#0F172A]/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img
              src="/logo.png"
              alt="Appointify"
              className="h-45 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
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

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center h-10 px-5 rounded-2xl font-semibold text-white
                         bg-[#2563EB] hover:bg-[#1D4ED8]
                         shadow-xl shadow-[#2563EB]/20
                         transition-all duration-300 ease-out hover:scale-[1.03]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
            >
              Login
            </Link>

            <button
              type="button"
              className="md:hidden p-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? (
                <X className="text-[#F8FAFC]" size={22} />
              ) : (
                <Menu className="text-[#F8FAFC]" size={22} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-white/10">
            <div className="px-6 py-4 flex flex-col gap-2">
              <NavLink to="/" className={navClass} onClick={() => setOpen(false)}>
                Home
              </NavLink>
              <NavLink
                to="/services"
                className={navClass}
                onClick={() => setOpen(false)}
              >
                Services
              </NavLink>
              <NavLink
                to="/track"
                className={navClass}
                onClick={() => setOpen(false)}
              >
                Track
              </NavLink>
              <NavLink
                to="/about"
                className={navClass}
                onClick={() => setOpen(false)}
              >
                About
              </NavLink>

              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center justify-center h-11 px-4 rounded-2xl font-semibold text-white
                           bg-[#2563EB] hover:bg-[#1D4ED8] shadow-xl shadow-[#2563EB]/20
                           transition-all duration-300 ease-out hover:scale-[1.03]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
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