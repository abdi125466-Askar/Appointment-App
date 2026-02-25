// import { useMemo, useState } from "react";
// import { Search, Lock, Info, CheckCircle2, AlertCircle } from "lucide-react";
// import api from "../../utils/axios";

// export default function PublicTrackPage() {
//   const [appointmentId, setAppointmentId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [data, setData] = useState(null);

//   const cleanId = appointmentId.trim();

//   // backend expects Mongo ObjectId (24 chars hex)
//   const isValidObjectId = useMemo(
//     () => /^[a-fA-F0-9]{24}$/.test(cleanId),
//     [cleanId]
//   );

//   const isEmpty = cleanId.length === 0;

//   async function fetchStatus(id) {
//     const res = await api.get(`/public/appointments/${id}/status`);
//     return res.data;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isValidObjectId) {
//       setData(null);
//       setErrorMsg(
//         isEmpty ? "Fadlan geli Appointment ID." : "Appointment ID sax ma aha (24 characters)."
//       );
//       return;
//     }

//     setLoading(true);
//     setErrorMsg("");
//     setData(null);

//     try {
//       const res = await fetchStatus(cleanId);

//       if (res?.success) {
//         setData(res.data);
//       } else {
//         setErrorMsg(res?.message || "Appointment not found");
//       }
//     } catch (err) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         "Appointment not found";
//       setErrorMsg(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const prettyDate = (d) => {
//     try {
//       return d ? new Date(d).toDateString() : "—";
//     } catch {
//       return "—";
//     }
//   };

//   const statusLabel = (s) => {
//     const x = String(s || "").toLowerCase();
//     if (x === "approved") return "Approved";
//     if (x === "pending") return "Pending";
//     if (x === "completed") return "Completed";
//     return s || "—";
//   };

//   const statusClass = (s) => {
//     const x = String(s || "").toLowerCase();
//     if (x === "approved") return "statusPill approved";
//     if (x === "pending") return "statusPill pending";
//     if (x === "completed") return "statusPill completed";
//     return "statusPill";
//   };

//   return (
//     <section className="relative flex-1 w-full overflow-hidden flex items-center justify-center px-4 py-10">
//       {/* Blue-only overlay (match PublicLayout premium) */}
//       <div className="absolute inset-0 pointer-events-none bg-slate-950/55" />

//       <div className="relative w-full max-w-5xl">
//         {/* Title */}
//         <div className="text-center mb-6">
//           <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
//             Track Your Appointment
//           </h1>
//           <p className="mt-2 text-slate-200/90 font-semibold">
//             Enter your Appointment ID to view your appointment status.
//           </p>
//         </div>

//         {/* Outer rim */}
//         <div className="rounded-[30px] p-[1px] bg-gradient-to-r from-blue-500/35 via-white/10 to-blue-700/30 shadow-2xl shadow-black/35">
//           {/* Inner card */}
//           <div className="rounded-[29px] bg-white/5 backdrop-blur-2xl border border-white/10 p-5 md:p-6">
//             <form onSubmit={handleSubmit}>
//               <div className="flex flex-col md:flex-row gap-4 items-stretch">
//                 {/* Input */}
//                 <div className="relative flex-1 group">
//                   <div
//                     className="absolute -inset-[3px] rounded-2xl blur-xl opacity-60 pointer-events-none
//                     bg-[radial-gradient(circle_at_30%_35%,rgba(59,130,246,0.40),transparent_62%)]"
//                   />
//                   <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-blue-400/60 via-blue-600/70 to-indigo-400/50">
//                     <div className="flex items-center gap-3 rounded-[14px] bg-slate-950/55 border border-white/10 backdrop-blur-2xl px-4 py-3">
//                       <Search className="text-white/85" size={18} />
//                       <input
//                         value={appointmentId}
//                         onChange={(e) => setAppointmentId(e.target.value)}
//                         placeholder="69943441d79e1429898caeea"
//                         className="w-full bg-transparent outline-none text-white placeholder:text-white/45 font-semibold"
//                         inputMode="text"
//                         autoComplete="off"
//                       />
//                     </div>
//                   </div>

//                   {/* Correct example (24 hex) */}
//                   <p className="mt-2 text-xs text-slate-200/80 flex items-center gap-2">
//                     <Info size={14} className="opacity-80" />
//                     Example:
//                     <span className="font-extrabold text-white/90">
//                       69943441d79e1429898caeea
//                     </span>
//                     <span className="opacity-60">(24-characters)</span>
//                   </p>
//                 </div>

//                 {/* Button (Blue-only) */}
//                 <div className="relative md:w-[260px] w-full group">
//                   <div
//                     className="absolute -inset-[3px] rounded-2xl blur-xl opacity-60 pointer-events-none
//                     bg-[radial-gradient(circle_at_70%_40%,rgba(37,99,235,0.45),transparent_60%)]"
//                   />

//                   <button
//                     type="submit"
//                     disabled={!isValidObjectId || loading}
//                     className={`
//                       relative w-full inline-flex items-center justify-center gap-2
//                       px-5 py-3 rounded-2xl font-extrabold text-white
//                       transition-all duration-300 overflow-hidden
//                       focus:outline-none focus:ring-4 focus:ring-blue-400/25
//                       ${(isValidObjectId && !loading)
//                         ? "hover:-translate-y-[2px] hover:brightness-110"
//                         : "opacity-55 cursor-not-allowed"}
//                     `}
//                   >
//                     {/* animated border (blue) */}
//                     <span
//                       className={`
//                         absolute inset-0 rounded-2xl p-[2px]
//                         bg-[linear-gradient(90deg,rgba(59,130,246,1),rgba(15,23,42,1),rgba(37,99,235,1),rgba(59,130,246,1))]
//                         bg-[length:300%_300%]
//                         ${(isValidObjectId && !loading) ? "animate-[borderMove_4.2s_linear_infinite]" : ""}
//                       `}
//                     />
//                     {/* inner fill */}
//                     <span
//                       className="absolute inset-[2px] rounded-[14px]
//                       bg-gradient-to-r from-blue-600 via-slate-950/90 to-blue-700
//                       shadow-[0_0_22px_rgba(37,99,235,0.22)]"
//                     />

//                     <span className="relative z-10 flex items-center gap-2">
//                       {loading ? "Tracking..." : "Track Status"}{" "}
//                       <span className="opacity-90">→</span>
//                     </span>
//                   </button>

//                   {/* tooltip when disabled */}
//                   {(!isValidObjectId && !loading) && (
//                     <div
//                       className="pointer-events-none absolute left-1/2 -top-3 -translate-x-1/2 translate-y-[-100%]
//                       opacity-0 group-hover:opacity-100 transition"
//                     >
//                       <div className="rounded-xl bg-slate-950/90 text-white text-xs font-bold px-3 py-2 shadow-lg border border-white/10 flex items-center gap-2">
//                         <Lock size={14} className="opacity-80" />
//                         {isEmpty ? "Geli Appointment ID marka hore" : "ID-ga waa inuu noqdaa 24 characters"}
//                       </div>
//                       <div className="mx-auto w-2 h-2 rotate-45 bg-slate-950/90 border-r border-b border-white/10 -mt-1" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <p className="mt-4 text-center text-xs sm:text-sm text-slate-200/75">
//                 Tip: Appointment ID waa 24-character (Mongo ObjectId).
//               </p>

//               <style>{`
//                 @keyframes borderMove {
//                   0% { background-position: 0% 50%; }
//                   50% { background-position: 100% 50%; }
//                   100% { background-position: 0% 50%; }
//                 }
//               `}</style>
//             </form>
//           </div>
//         </div>

//         {/* Results / Error */}
//         <div className="mt-6">
//           {errorMsg && (
//             <div className="rounded-2xl border border-red-500/20 bg-red-500/10 backdrop-blur-xl p-4 flex items-center gap-3">
//               <AlertCircle className="text-red-300" size={20} />
//               <p className="font-bold text-red-100">{errorMsg}</p>
//             </div>
//           )}

//           {data && !errorMsg && (
//             <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-5">
//               <div className="flex items-start gap-3">
//                 <CheckCircle2 className="text-blue-300" size={22} />
//                 <div className="space-y-2">
//                   <p className="font-black text-white">
//                     Adeeg:{" "}
//                     <span className="font-extrabold text-slate-200">
//                       {data?.service?.name || "—"}
//                     </span>
//                   </p>

//                   <p className="font-black text-white">
//                     Taariikh:{" "}
//                     <span className="font-extrabold text-slate-200">
//                       {prettyDate(data?.appointmentDate)}
//                     </span>
//                   </p>

//                   <div className="flex flex-wrap items-center gap-2">
//                     <p className="font-black text-white">Xaalad:</p>
//                     <span className={statusClass(data?.status)}>
//                       {statusLabel(data?.status)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Status pill CSS (blue-only) */}
//               <style>{`
//                 .statusPill{
//                   display:inline-flex;
//                   align-items:center;
//                   justify-content:center;
//                   padding: 6px 12px;
//                   border-radius: 999px;
//                   font-weight: 900;
//                   font-size: 12px;
//                   border: 1px solid rgba(255,255,255,.12);
//                   background: rgba(255,255,255,.06);
//                   color: rgba(255,255,255,.92);
//                 }
//                 .statusPill.pending{
//                   border-color: rgba(226,232,240,.20);
//                   background: rgba(255,255,255,.06);
//                 }
//                 .statusPill.approved{
//                   border-color: rgba(59,130,246,.35);
//                   background: rgba(59,130,246,.12);
//                   color: rgba(191,219,254,.95);
//                 }
//                 .statusPill.completed{
//                   border-color: rgba(99,102,241,.35);
//                   background: rgba(99,102,241,.10);
//                   color: rgba(224,231,255,.95);
//                 }
//               `}</style>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Lock,
  Info,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import api from "../../utils/axios";

const TRACKING_KEY = "appointify_tracking_id";

export default function PublicTrackPage() {
  const [appointmentId, setAppointmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState(null);
  const [hasSaved, setHasSaved] = useState(false);

  // ✅ Only detect if saved ID exists (DO NOT auto-fill)
  useEffect(() => {
    const saved = localStorage.getItem(TRACKING_KEY);
    const cleanSaved = String(saved || "").trim();

    if (cleanSaved && cleanSaved.length === 24) {
      setHasSaved(true);
    } else {
      setHasSaved(false);
    }
  }, []);

  const cleanId = appointmentId.trim();

  const isValidObjectId = useMemo(
    () => /^[a-fA-F0-9]{24}$/.test(cleanId),
    [cleanId]
  );

  const isEmpty = cleanId.length === 0;

  async function fetchStatus(id) {
    const res = await api.get(`/public/appointments/${id}/status`);
    return res.data;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidObjectId) {
      setData(null);
      setErrorMsg(
        isEmpty
          ? "Fadlan geli Appointment ID."
          : "Appointment ID sax ma aha (24 characters)."
      );
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

  const useSavedId = () => {
    const saved = localStorage.getItem(TRACKING_KEY);
    const cleanSaved = String(saved || "").trim();

    if (cleanSaved && cleanSaved.length === 24) {
      setAppointmentId(cleanSaved);
      setErrorMsg("");
      setData(null);
    }
  };

  const clearSavedId = () => {
    localStorage.removeItem(TRACKING_KEY);
    setHasSaved(false);
  };

  const prettyDate = (d) => {
    try {
      return d ? new Date(d).toDateString() : "—";
    } catch {
      return "—";
    }
  };

  const statusLabel = (s) => {
    const x = String(s || "").toLowerCase();
    if (x === "approved") return "Approved";
    if (x === "pending") return "Pending";
    if (x === "completed") return "Completed";
    return s || "—";
  };

  const statusClass = (s) => {
    const x = String(s || "").toLowerCase();
    if (x === "approved") return "statusPill approved";
    if (x === "pending") return "statusPill pending";
    if (x === "completed") return "statusPill completed";
    return "statusPill";
  };

  return (
    <section className="relative flex-1 w-full overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 pointer-events-none bg-slate-950/55" />

      <div className="relative w-full max-w-5xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Track Your Appointment
          </h1>
          <p className="mt-2 text-slate-200/90 font-semibold">
            Enter your Appointment ID to view your appointment status.
          </p>
        </div>

        <div className="rounded-[30px] p-[1px] bg-gradient-to-r from-blue-500/35 via-white/10 to-blue-700/30 shadow-2xl shadow-black/35">
          <div className="rounded-[29px] bg-white/5 backdrop-blur-2xl border border-white/10 p-5 md:p-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-4 items-stretch">

                {/* INPUT */}
                <div className="relative flex-1">
                  <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-blue-400/60 via-blue-600/70 to-indigo-400/50">
                    <div className="flex items-center gap-3 rounded-[14px] bg-slate-950/55 border border-white/10 px-4 py-3">
                      <Search className="text-white/85" size={18} />
                      <input
                        value={appointmentId}
                        onChange={(e) => setAppointmentId(e.target.value)}
                        placeholder="69943441d79e1429898caeea"
                        className="w-full bg-transparent outline-none text-white placeholder:text-white/45 font-semibold"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-200/80 flex items-center gap-2">
                    <Info size={14} className="opacity-80" />
                    Appointment ID waa 24-character (Fadlan Ilaasho).
                  </p>

                  {/* Saved ID Actions */}
                  {hasSaved && (
                    <div className="mt-3 flex gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={useSavedId}
                        className="px-4 py-2 rounded-xl text-xs font-black border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
                      >
                        Use Saved ID
                      </button>

                      <button
                        type="button"
                        onClick={clearSavedId}
                        className="px-4 py-2 rounded-xl text-xs font-black border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20 transition"
                      >
                        <Trash2 size={14} className="inline mr-1" />
                        Clear Saved
                      </button>
                    </div>
                  )}
                </div>

                {/* BUTTON */}
                <div className="relative md:w-[260px] w-full">
                  <button
                    type="submit"
                    disabled={!isValidObjectId || loading}
                    className={`w-full px-5 py-3 rounded-2xl font-extrabold text-white transition ${
                      isValidObjectId && !loading
                        ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:brightness-110"
                        : "bg-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {loading ? "Tracking..." : "Track Status →"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RESULT */}
        <div className="mt-6">
          {errorMsg && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-center gap-3">
              <AlertCircle className="text-red-300" size={20} />
              <p className="font-bold text-red-100">{errorMsg}</p>
            </div>
          )}

          {data && !errorMsg && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-blue-300" size={22} />
                <div className="space-y-2">
                  <p className="font-black text-white">
                    Adeeg:{" "}
                    <span className="font-extrabold text-slate-200">
                      {data?.service?.name || "—"}
                    </span>
                  </p>

                  <p className="font-black text-white">
                    Taariikh:{" "}
                    <span className="font-extrabold text-slate-200">
                      {prettyDate(data?.appointmentDate)}
                    </span>
                  </p>

                  <p className="font-black text-white">
                    Xaalad:{" "}
                    <span className="font-extrabold text-slate-200">
                      {statusLabel(data?.status)}
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