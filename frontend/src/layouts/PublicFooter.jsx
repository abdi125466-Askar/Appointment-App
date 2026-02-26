import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PublicHeader from "./PublicHeader";

// ✅ 4 backgrounds
import bgHome from "../assets/landing/bg-home.png";
import bgServices from "../assets/landing/bg-services.png";
import bgTrack from "../assets/landing/bg-track.png";
import bgAbout from "../assets/landing/bg-about.png";

export default function PublicLayout() {
  const { pathname } = useLocation();

  // ✅ Home keliya: scroll OFF, pages kale: scroll ON
  useEffect(() => {
    const isHome = pathname === "/";
    document.body.style.overflowY = isHome ? "hidden" : "auto"; // ✅ muhiim
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [pathname]);

  // ✅ route -> background
  const bgMap = {
    "/": bgHome,
    "/services": bgServices,
    "/track": bgTrack,
    "/about": bgAbout,
  };
  const currentBg = bgMap[pathname] || bgHome;

  // ✅ overlay (Home dark -> overlay xooggan; others -> light)
  const overlayClass =
    pathname === "/"
      ? "bg-black/45 backdrop-blur-[1px]"
      : "bg-black/20 backdrop-blur-[1px]"; // ✅ ka dhigay mugdi yar (si qoral u muuqdo)

  const isHome = pathname === "/";

  return (
    <div
      className={`
        relative min-h-screen flex flex-col
        ${isHome ? "overflow-hidden" : "overflow-x-hidden"} 
        /* ✅ Home: overflow-hidden (no scroll)
           ✅ Other pages: allow vertical scroll, only hide X overflow */
      `}
      style={{
        backgroundImage: `url(${currentBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ✅ overlay */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${overlayClass}`} />

      {/* ✅ Header */}
      <div className="relative z-10">
        <PublicHeader />
      </div>

      {/* ✅ Content */}
      <main
        className={`
          relative z-10 flex-1 min-h-0
          ${isHome ? "h-[calc(100vh-80px-64px)]" : ""}

          /* ✅ Home: h = 100vh - header(80px) - footer(64px)
             ✅ Haddii footer-kaaga ka dheer yahay 64px, beddel "64px" */
        `}
      >
        <Outlet />
      </main>

      {/* ✅ Footer
          - Home: fixed bottom (si Home hal page u noqdo)
          - Pages kale: normal footer (scroll wuu shaqaynayaa)
      */}
      <footer
        className={`
          z-10 border-t border-white/10
          ${isHome ? "fixed bottom-0 left-0 right-0" : "relative"}
        `}
      >
        <div className="bg-gradient-to-r from-slate-950 via-slate-900/95 to-emerald-950/80 backdrop-blur-xl">
          {/* ✅ waxaan ka dhigay height fixed si calc uu sax u noqdo */}
          <div className="mx-auto max-w-7xl px-6 h-16 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-300">
              © {new Date().getFullYear()} Appointify — Smart Booking System
            </p>

            <div className="flex items-center gap-2">
              {["Privacy", "Terms", "Support"].map((t) => (
                <a
                  key={t}
                  href="#"
                  className="
                    px-3 py-1.5 rounded-xl
                    text-sm font-extrabold text-slate-200
                    bg-white/5 border border-white/10
                    hover:bg-white/10 hover:border-white/20
                    hover:text-emerald-300
                    transition
                  "
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}