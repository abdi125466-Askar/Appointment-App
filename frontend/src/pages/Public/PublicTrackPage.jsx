import { useMemo, useState } from "react";
import { Search, Lock, Info, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../../utils/axios";

export default function PublicTrackPage() {
  const [appointmentId, setAppointmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState(null);

  const cleanId = appointmentId.trim();

  // ✅ backend expects Mongo ObjectId (24 chars hex)
  const isValidObjectId = useMemo(
    () => /^[a-fA-F0-9]{24}$/.test(cleanId),
    [cleanId]
  );

  const isEmpty = cleanId.length === 0;

  async function fetchStatus(id) {
    // ✅ IMPORTANT: This matches your backend route:
    // router.get("/appointments/:appointmentId/status", getMyAppointmentStatus)
    // Usually mounted as /api/public in server.js
    const res = await api.get(`/public/appointments/${id}/status`);
    return res.data;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidObjectId) {
      setData(null);
      setErrorMsg(isEmpty ? "Fadlan geli Appointment ID." : "Appointment ID sax ma aha (24 characters).");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setData(null);

    try {
      const res = await fetchStatus(cleanId);

      if (res?.success) {
        setData(res.data);
      } else {
        setErrorMsg(res?.message || "Appointment not found");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Appointment not found";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex-1 w-full overflow-hidden flex items-center justify-center px-4 py-10">
      {/* ✅ keep your gray/white background from layout */}
      <div className="absolute inset-0 pointer-events-none bg-white/35" />

      <div className="relative w-full max-w-5xl">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Track Your Appointment
          </h1>
          <p className="mt-2 text-slate-700 font-semibold">
            Enter your tracking ID to view your appointment status.
          </p>
        </div>

        {/* ✅ Outer frame (WHITE border) */}
        <div className="rounded-[30px] p-[2px] bg-white/80 border border-white/70 shadow-2xl shadow-black/10">
          {/* ✅ Inner bar (BLACK) */}
          <div className="rounded-[28px] bg-black/75 backdrop-blur-2xl border border-white/10 p-5 md:p-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-4 items-stretch">
                {/* ✅ Input (BLUE glow) */}
                <div className="relative flex-1 group">
                  <div className="absolute -inset-[3px] rounded-2xl blur-xl opacity-70 pointer-events-none
                    bg-[radial-gradient(circle_at_30%_35%,rgba(59,130,246,0.45),transparent_62%)]"
                  />
                  <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-sky-400/70 via-blue-600/70 to-cyan-400/60">
                    <div className="flex items-center gap-3 rounded-[14px] bg-white/10 border border-white/15 backdrop-blur-2xl px-4 py-3">
                      <Search className="text-white/85" size={18} />
                      <input
                        value={appointmentId}
                        onChange={(e) => setAppointmentId(e.target.value)}
                        placeholder="69943441d79e1429898caeea"
                        className="w-full bg-transparent outline-none text-white placeholder:text-white/55 font-semibold"
                      />
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-white/70 flex items-center gap-2">
                    <Info size={14} className="opacity-80" />
                    Example:{" "}
                    <span className="font-bold text-white/90">
                      APP-2026-001
                    </span>
                    <span className="opacity-60">(Halkan waa Appointment ID)</span>
                  </p>
                </div>

                {/* ✅ Button (GREEN glow) */}
                <div className="relative md:w-[260px] w-full group">
                  <div className="absolute -inset-[3px] rounded-2xl blur-xl opacity-70 pointer-events-none
                    bg-[radial-gradient(circle_at_70%_40%,rgba(16,185,129,0.45),transparent_60%)]"
                  />

                  <button
                    type="submit"
                    disabled={!isValidObjectId || loading}
                    className={`
                      relative w-full inline-flex items-center justify-center gap-2
                      px-5 py-3 rounded-2xl font-extrabold text-white
                      transition-all duration-300 overflow-hidden
                      focus:outline-none focus:ring-4 focus:ring-emerald-400/25
                      ${(isValidObjectId && !loading)
                        ? "hover:-translate-y-[2px] hover:brightness-110"
                        : "opacity-55 cursor-not-allowed"}
                    `}
                  >
                    {/* animated border */}
                    <span
                      className={`
                        absolute inset-0 rounded-2xl p-[2px]
                        bg-[linear-gradient(90deg,rgba(16,185,129,1),rgba(15,23,42,1),rgba(52,211,153,1),rgba(16,185,129,1))]
                        bg-[length:300%_300%]
                        ${(isValidObjectId && !loading) ? "animate-[borderMove_4.2s_linear_infinite]" : ""}
                      `}
                    />
                    {/* inner fill */}
                    <span className="absolute inset-[2px] rounded-[14px]
                      bg-gradient-to-r from-emerald-500 via-slate-900/90 to-emerald-400
                      shadow-[0_0_22px_rgba(16,185,129,0.25)]"
                    />

                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? "Tracking..." : "Track Status"} <span className="opacity-90">→</span>
                    </span>
                  </button>

                  {/* tooltip when disabled */}
                  {(!isValidObjectId && !loading) && (
                    <div className="pointer-events-none absolute left-1/2 -top-3 -translate-x-1/2 translate-y-[-100%]
                      opacity-0 group-hover:opacity-100 transition"
                    >
                      <div className="rounded-xl bg-slate-950/90 text-white text-xs font-bold px-3 py-2 shadow-lg border border-white/10 flex items-center gap-2">
                        <Lock size={14} className="opacity-80" />
                        {isEmpty ? "Geli Appointment ID marka hore" : "ID-ga waa inuu noqdaa 24 characters"}
                      </div>
                      <div className="mx-auto w-2 h-2 rotate-45 bg-slate-950/90 border-r border-b border-white/10 -mt-1" />
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-4 text-center text-xs sm:text-sm text-white/70">
                Tip: Tracking ID usually looks like{" "}
                <span className="font-extrabold text-white/90">APP-2026-001</span>
              </p>

              <style>{`
                @keyframes borderMove {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}</style>
            </form>
          </div>
        </div>

        {/* ✅ Results / Error (show below like your old UI) */}
        <div className="mt-6">
          {errorMsg && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <p className="font-bold text-red-700">{errorMsg}</p>
            </div>
          )}

          {data && !errorMsg && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600" size={22} />
                <div className="space-y-2">
                  <p className="font-black text-slate-900">
                    Adeeg:{" "}
                    <span className="font-extrabold text-slate-800">
                      {data?.service?.name || "—"}
                    </span>
                  </p>
                  <p className="font-black text-slate-900">
                    Taariikh:{" "}
                    <span className="font-extrabold text-slate-800">
                      {data?.appointmentDate
                        ? new Date(data.appointmentDate).toDateString()
                        : "—"}
                    </span>
                  </p>
                  <p className="font-black text-slate-900">
                    Xaalad:{" "}
                    <span className="font-extrabold text-slate-800">
                      {data?.status || "—"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
