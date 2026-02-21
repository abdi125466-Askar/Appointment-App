import { Link } from "react-router-dom";
import {
  Search,
  FileText,
  ArrowRight,
  ShieldCheck,
  Timer,
} from "lucide-react";

export default function LandingPage() {
  return (
    <section
      className="
        relative flex items-center justify-center
        min-h-[calc(100vh-80px-56px)]
        lg:h-[calc(100vh-80px-56px)]
        overflow-hidden
        py-4 md:py-6
      "
    >
      {/* BACKGROUND OVERLAY */}
      <div
        className="
          absolute inset-0 z-0
          bg-[radial-gradient(900px_520px_at_28%_32%,rgba(37,99,235,.16),rgba(2,6,23,.84)),
              radial-gradient(700px_420px_at_78%_68%,rgba(59,130,246,.12),rgba(2,6,23,.90)),
              linear-gradient(180deg,rgba(2,6,23,.65),rgba(2,6,23,.92))]
        "
      />

      <div className="relative z-10 w-full max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* ================= LEFT BOX ================= */}
          <div className="rounded-[30px] p-[1px] bg-gradient-to-br from-blue-600/30 to-white/10 shadow-[0_28px_70px_rgba(0,0,0,.38)]">
            <div className="rounded-[29px] bg-slate-950/30 backdrop-blur-xl p-5">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 flex flex-col justify-center h-full min-h-[430px]">

                <h1 className="inline-block px-4 py-2 mb-3 text-white font-black text-4xl lg:text-5xl leading-tight rounded-xl border border-white/20 bg-white/5">
                  Ballan Casri ah
                </h1>

                <p className="mb-4 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white/90 font-bold">
                  Si fudud u qabso ballantaada — mar kasta la soco codsigaaga.
                </p>

                {/* Pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {["Degdeg", "Ammaan", "La socod"].map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 text-sm font-extrabold text-white/90 rounded-full border border-white/10 bg-white/5"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/services"
                    className="
                      flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-white
                      bg-gradient-to-r from-blue-600 to-blue-700
                      border border-white/10
                      shadow-lg hover:translate-y-[-2px] transition
                    "
                  >
                    <FileText size={18} />
                    Services
                    <ArrowRight
                      size={16}
                      className="animate-[bounce_1.6s_infinite]"
                    />
                  </Link>

                  <Link
                    to="/track"
                    className="
                      flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-white
                      bg-blue-600/20 border border-white/10
                      hover:translate-y-[-2px] transition
                    "
                  >
                    <Search size={18} />
                    Track
                    <ArrowRight
                      size={16}
                      className="animate-[bounce_1.6s_infinite]"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT BOX ================= */}
          <div className="rounded-[30px] p-[1px] bg-gradient-to-br from-blue-500/30 to-white/10 shadow-[0_28px_70px_rgba(0,0,0,.38)]">
            <div className="rounded-[29px] bg-slate-950/30 backdrop-blur-xl p-5">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 flex flex-col justify-between h-full min-h-[430px]">

                <div>
                  <h2 className="inline-block px-4 py-2 mb-3 text-white font-black text-3xl rounded-xl border border-white/20 bg-white/5">
                    Nidaam Hufan
                  </h2>

                  <p className="mb-4 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white/90 font-bold">
                    Hal meel ku dhammee codsiga, jadwalka, iyo hubinta.
                  </p>

                  {/* Feature 1 */}
                  <div className="space-y-4 mt-4">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600/20 border border-blue-400/30">
                          <Timer className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="font-black text-white">
                            Waqti la qorsheeyey
                          </p>
                          <p className="text-sm text-slate-200">
                            Jadwal cad, sugitaan yar.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/20 border border-blue-300/30">
                          <ShieldCheck className="text-white" size={20} />
                        </div>

                        <div>
                          <p className="font-black text-white mb-2">
                            Xaalad Cad
                          </p>

                          <div className="flex flex-wrap items-center gap-2 text-sm font-extrabold">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white">
                              Pending
                            </span>
                            <span className="text-white/70">→</span>
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200">
                              Approved
                            </span>
                            <span className="text-white/70">→</span>
                            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200">
                              Completed
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6">
                  <Link
                    to="/services"
                    className="
                      inline-flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold
                      border border-blue-400/50 text-white
                      hover:translate-y-[-2px] transition
                    "
                  >
                    Start Request
                    <ArrowRight
                      size={16}
                      className="animate-[bounce_1.6s_infinite]"
                    />
                  </Link>
                </div>

              </div>
            </div>
          </div>
          {/* END */}
        </div>
      </div>
    </section>
  );
}