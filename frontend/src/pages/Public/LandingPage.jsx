import { Link } from "react-router-dom";
import { CalendarDays, Search } from "lucide-react";

import bg from "../../assets/landing/bg.png";
import hero from "../../assets/landing/hero.png";

export default function LandingPage() {
  return (
    // ✅ flex-1: fills the remaining height between header and footer
    <section
      className="relative flex-1 flex overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-white/35" />

      {/* ✅ container becomes full height, so background reaches footer */}
      <div className="relative mx-auto max-w-7xl w-full px-4 md:px-8 py-8 md:py-10 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
          {/* Left */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Easy scheduling ahead
              <span className="block">Your Appointment Online</span>
            </h1>

            <p className="mt-4 text-slate-600 text-base md:text-lg max-w-xl">
              Easily and securely book government services online.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                to="/book"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 text-white font-black shadow-lg shadow-emerald-500/20 hover:brightness-95 transition"
              >
                <CalendarDays size={18} />
                Book Appointment
              </Link>

              <Link
                to="/track"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/70 border border-slate-200 text-slate-800 font-black shadow-sm hover:bg-white transition"
              >
                <Search size={18} />
                Track Appointment
              </Link>
            </div>
          </div>

          {/* Right (Hero) */}
          <div className="relative flex justify-center lg:justify-end">
            <img
              src={hero}
              alt="hero"
              className="w-[420px] sm:w-[520px] md:w-[620px] lg:w-[680px] h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
