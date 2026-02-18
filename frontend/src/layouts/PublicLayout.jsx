import { Outlet } from "react-router-dom";
import PublicHeader from "./PublicHeader";

export default function PublicLayout() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 overflow-x-hidden">
      <PublicHeader />

      {/* Content area fills the remaining height */}
      <main className="flex-1 min-h-0 flex flex-col">
        <Outlet />
      </main>

      <footer className="shrink-0 border-t border-white/10">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900/95 to-emerald-950/80">
          <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-300">
              © {new Date().getFullYear()} Appointify — Smart Booking System
            </p>

            <div className="flex items-center gap-4 text-sm font-bold">
              <a className="text-slate-300 hover:text-emerald-400 transition" href="#">
                Privacy
              </a>
              <a className="text-slate-300 hover:text-emerald-400 transition" href="#">
                Terms
              </a>
              <a className="text-slate-300 hover:text-emerald-400 transition" href="#">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
