// import bg from "../../assets/landing/bg.png";

// export default function PublicTrackPage() {
//   return (
//     <main
//       className="relative min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]"
//       style={{
//         backgroundImage: `url(${bg})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="absolute inset-0 bg-white/40" />

//       <div className="relative mx-auto max-w-3xl px-4 md:px-8 py-10 md:py-14">
//         <div className="rounded-[28px] bg-white/55 border border-white/70 backdrop-blur-xl shadow-sm p-6 md:p-8">
//           <h2 className="text-2xl md:text-3xl font-black text-slate-900">
//             Track Your Appointment
//           </h2>
//           <p className="mt-2 text-slate-600">
//             Enter the tracking ID you received after booking.
//           </p>

//           <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
//             <input
//               placeholder="Enter Tracking ID (e.g., APP-20...)"
//               className="h-12 rounded-2xl border border-slate-200 bg-white/70 px-4 font-semibold outline-none focus:ring-2 focus:ring-blue-200"
//             />
//             <button className="h-12 rounded-2xl bg-blue-600 text-white font-black px-6 hover:brightness-95 transition">
//               Track Status
//             </button>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  fetchAppointmentStatus,
} from "../../Redux/slices/PublicSlice/publicAppointmentSlice";
import bg from "../../assets/landing/bg.png";

export default function PublicTrackPage() {
  const dispatch = useDispatch();
  const { appointmentStatus, statusLoading, error } = useSelector(
    (state) => state.publicAppointment
  );

  const [trackingId, setTrackingId] = useState("");

  return (
    <main
      className="relative min-h-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/40" />

      <div className="relative mx-auto max-w-3xl px-6 py-16">
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow">
          <h2 className="text-3xl font-black">Track Your Appointment</h2>

          <div className="mt-6 flex gap-3">
            <input
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="APP-2026-001"
              className="flex-1 px-4 py-4 rounded-xl border"
            />
            <button
              onClick={() => dispatch(fetchAppointmentStatus(trackingId))}
              disabled={!trackingId || statusLoading}
              className="bg-blue-600 text-white px-6 rounded-xl font-black"
            >
              {statusLoading ? <Loader2 className="animate-spin" /> : "Track"}
            </button>
          </div>

          {appointmentStatus && (
            <div className="mt-6 bg-white p-4 rounded-xl border">
              <CheckCircle className="text-green-600 mb-2" />
              <p><b>Adeeg:</b> {appointmentStatus.service?.name}</p>
              <p><b>Taariikh:</b> {new Date(
                appointmentStatus.appointmentDate
              ).toDateString()}</p>
              <p><b>Xaalad:</b> {appointmentStatus.status}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 p-3 rounded-xl flex gap-2">
              <AlertCircle className="text-red-600" />
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


