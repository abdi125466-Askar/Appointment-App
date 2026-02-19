import { Link } from "react-router-dom";
import { CalendarDays, Search } from "lucide-react";
import hero from "../../assets/landing/hero.png";

export default function LandingPage() {
  return (
    <section className="relative h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-hidden">

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-800/40 to-emerald-900/30 pointer-events-none" />

      {/* Center Wrapper */}
      <div className="relative w-full max-w-7xl px-6 translate-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* LEFT BOX */}
          <div className="rounded-[32px] bg-gradient-to-br from-sky-500 via-blue-600 to-emerald-500
                          border border-white/20 backdrop-blur-2xl 
                          shadow-2xl p-8 md:p-10 h-[430px] flex flex-col justify-center">

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              Ballan Casri ah
            </h1>

            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white/90">
              Adeegyada Dowladda
            </h2>

            {/* Sub Text */}
            <p className="mt-5 text-white font-semibold text-base border border-black/30 
                          bg-black/20 rounded-xl px-4 py-2 backdrop-blur-md">
              Si ammaan ah u qabso ballan — la soco codsigaaga Tracking ID.
            </p>

            {/* FEATURE CHIPS */}
            <div className="mt-5 flex flex-wrap gap-3">

              {/* Ballan */}
              <span className="px-4 py-2 rounded-xl bg-sky-500/20 border border-sky-300/30 
                               text-sky-100 font-bold text-sm backdrop-blur-xl shadow-md">
                ● Ballan
              </span>

              {/* Degdeg */}
              <span className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-300/30 
                               text-amber-200 font-bold text-sm backdrop-blur-xl shadow-md">
                ● Degdeg
              </span>

              {/* Ammaan */}
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-300/30 
                               text-emerald-200 font-bold text-sm backdrop-blur-xl shadow-md">
                ● Ammaan
              </span>

              {/* La socod */}
              <span className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-300/30 
                               text-indigo-200 font-bold text-sm backdrop-blur-xl shadow-md">
                ● La socod
              </span>

            </div>

            {/* BUTTONS */}
            <div className="mt-7 flex gap-4">

              {/* Book */}
              <Link
                to="/book"
                className="flex items-center gap-2 px-6 py-3 rounded-xl 
                           bg-blue-700 hover:bg-blue-600
                           border border-black/40
                           text-white font-bold shadow-lg transition"
              >
                <CalendarDays size={18} />
                Book Appointment
              </Link>

              {/* Track */}
              <Link
                to="/track"
                className="flex items-center gap-2 px-6 py-3 rounded-xl 
                           bg-emerald-700 hover:bg-emerald-600
                           border border-black/40
                           text-white font-bold shadow-lg transition"
              >
                <Search size={18} />
                Track Appointment
              </Link>

            </div>
          </div>

          {/* RIGHT BOX */}
          <div className="rounded-[32px] bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600
                          border border-white/20 backdrop-blur-2xl 
                          shadow-2xl p-8 flex items-center justify-center h-[430px]">

            <img
              src={hero}
              alt="Appointment Illustration"
              className="w-[430px] md:w-[500px] object-contain drop-shadow-2xl"
            />

          </div>

        </div>
      </div>
    </section>
  );
}
