import { Outlet, useLocation } from "react-router-dom";
import PublicHeader from "./PublicHeader";

import bgHomeVideo from "../assets/landing/bg-home.mp4";
import bgServicesVideo from "../assets/landing/bg-services.mp4";
import bgTrackVideo from "../assets/landing/bg-track.mp4";
import bgAboutVideo from "../assets/landing/bg-about.mp4";
import bgMainVideo from "../assets/landing/bg-main.mp4";

export default function PublicLayout() {
  const { pathname } = useLocation();

  const videoMap = {
    "/": bgHomeVideo,
    "/services": bgServicesVideo,
    "/track": bgTrackVideo,
    "/about": bgAboutVideo,
    "/privacy": bgMainVideo,
    "/terms": bgMainVideo,
    "/support": bgMainVideo,
    "/book": bgMainVideo,
  };

  const currentVideo = videoMap[pathname] || bgMainVideo;

  const overlayClass =
    pathname === "/"
      ? "bg-slate-950/55 backdrop-blur-[1px]"
      : "bg-black/35 backdrop-blur-[1px]";

  // ✅ HOME: no-scroll, pages kale: scroll normal
  const isHome = pathname === "/";

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src={currentVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className={`absolute inset-0 pointer-events-none z-[1] ${overlayClass}`} />

      <div className="relative z-10">
        <PublicHeader />
      </div>

      {/* ✅ MAIN */}
      <main
        className={[
          "relative z-10 flex-1 w-full",
          isHome ? "overflow-hidden" : "overflow-auto",
        ].join(" ")}
      >
        <div className="w-full mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ✅ Footer: HOME ka qari si scroll uusan u imaan (pages kale ha muuqdo) */}
      {!isHome && (
        <footer className="relative z-10 border-t border-white/10">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900/95 to-emerald-950/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-300">
                © {new Date().getFullYear()} Appointify — Smart Booking System
              </p>

              <div className="flex items-center gap-2">
                {["Privacy", "Terms", "Support"].map((t) => (
                  <a
                    key={t}
                    href={`/${t.toLowerCase()}`}
                    className="px-3 py-1.5 rounded-xl text-sm font-extrabold text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-emerald-300 transition"
                  >
                    {t}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
