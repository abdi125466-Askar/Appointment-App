// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   ClipboardList,
//   Phone,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   FileText,
//   IdCard,
//   BookOpen,
//   UserCheck,
//   UserPlus,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";

// import {
//   fetchAppointments,
//   updateAppointment,
//   assignUserToAppointment,
// } from "../../Redux/slices/cusomerSlice/appointmentSlice";
// import { fetchUsers } from "../../Redux/slices/userSlices/userSlice"

// /* ===============================
//    PDF OPEN HELPER
// ================================ */
// const openPdf = (appointment) => {
//   if (!appointment?.documents?.length) {
//     alert("No PDF uploaded for this request");
//     return;
//   }
//   window.open(
//     appointment.documents[0].url,
//     "_blank",
//     "noopener,noreferrer"
//   );
// };

// export default function PendingAppointments() {
//   const dispatch = useDispatch();
//   const {
//     list = [],
//     loading,
//     updatingId,
//   } = useSelector((state) => state.appointments || {});
//   const { list: users = [] } = useSelector((state) => state.users || {});
//   const [selectedUser, setSelectedUser] = useState({});

//   useEffect(() => {
//     dispatch(fetchAppointments());
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   const pendingCount = useMemo(() => list.length, [list]);

//   const approveWithUser = async (appointmentId) => {
//     const userId = selectedUser[appointmentId];
//     if (!userId) return;

//     await dispatch(
//       assignUserToAppointment({ id: appointmentId, assignedUserId: userId })
//     );
//     await dispatch(
//       updateAppointment({ id: appointmentId, data: { status: "APPROVED" } })
//     );
//     dispatch(fetchAppointments());
//   };

//   const rejectAppointment = async (id) => {
//     await dispatch(updateAppointment({ id, data: { status: "REJECTED" } }));
//     dispatch(fetchAppointments());
//   };

//   if (loading) return <LoadingSpinner />;
//   if (pendingCount === 0) return <EmptyState />;

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
//             <ClipboardList size={22} />
//           </div>
//           <div>
//             <h2 className="text-xl font-black text-slate-800">
//               Pending Requests
//             </h2>
//             <p className="text-xs font-bold text-slate-400 uppercase">
//               Queue Management
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
//           <span className="text-sm font-black text-blue-700">
//             {pendingCount} Action Required
//           </span>
//         </div>
//       </div>

//       {/* LIST */}
//       <div className="grid gap-4">
//         {list.map((a) => {
//           const isUpdating = updatingId === a._id;
//           const hasPdf = a.documents?.length > 0;

//           return (
//             <div
//               key={a._id}
//               className="bg-white border border-slate-100 rounded-[2rem] p-2 hover:shadow-xl transition-all"
//             >
//               <div className="flex flex-col lg:flex-row gap-6 p-4">
//                 {/* CUSTOMER */}
//                 <div className="flex-1">
//                   <h4 className="font-black text-slate-800 text-sm">
//                     {a.customerId?.fullName || "Guest Client"}
//                   </h4>
//                   <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
//                     <Phone size={12} /> {a.customerId?.phone}
//                   </p>
//                 </div>

//                 {/* SERVICE */}
//                 <div className="flex-1">
//                   <div className="text-xs font-black text-emerald-600">
//                     {a.serviceId?.name}
//                   </div>
//                   <div className="text-xs text-slate-500 flex items-center gap-1">
//                     <Calendar size={12} />
//                     {new Date(a.appointmentDate).toLocaleString()}
//                   </div>
//                 </div>

//                 {/* DOCUMENT BADGES */}
//                 <div className="flex gap-2 items-center">
//                   <DocBadge icon={<FileText size={12} />} ok={hasPdf} />
//                   <DocBadge icon={<IdCard size={12} />} ok={a.identityProvided} />
//                   <DocBadge icon={<BookOpen size={12} />} ok={a.passportProvided} />

//                   {!hasPdf && (
//                     <span className="text-[10px] text-rose-500 font-black flex items-center gap-1">
//                       <AlertCircle size={12} /> No PDF
//                     </span>
//                   )}
//                 </div>

//                 {/* READ PDF BUTTON */}
//                 <button
//                   onClick={() => openPdf(a)}
//                   disabled={!hasPdf}
//                   className={`px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all ${
//                     hasPdf
//                       ? "bg-blue-600 text-white hover:bg-blue-700"
//                       : "bg-slate-100 text-slate-400 cursor-not-allowed"
//                   }`}
//                 >
//                   <FileText size={14} />
//                   Read PDF
//                 </button>

//                 {/* ASSIGN + ACTIONS */}
//                 <div className="flex gap-2">
//                   <select
//                     className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-50"
//                     value={selectedUser[a._id] || ""}
//                     onChange={(e) =>
//                       setSelectedUser((prev) => ({
//                         ...prev,
//                         [a._id]: e.target.value,
//                       }))
//                     }
//                   >
//                     <option value="">Assign Staff</option>
//                     {users.map((u) => (
//                       <option key={u._id} value={u._id}>
//                         {u.fullName}
//                       </option>
//                     ))}
//                   </select>

//                   <button
//                     onClick={() => approveWithUser(a._id)}
//                     disabled={isUpdating || !selectedUser[a._id]}
//                     className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black flex items-center gap-2"
//                   >
//                     {isUpdating ? (
//                       <Loader2 size={14} className="animate-spin" />
//                     ) : (
//                       <CheckCircle size={14} />
//                     )}
//                     Approve
//                   </button>

//                   <button
//                     onClick={() => rejectAppointment(a._id)}
//                     disabled={isUpdating}
//                     className="p-2 rounded-xl bg-rose-50 text-rose-500"
//                   >
//                     <XCircle size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// /* ===============================
//    HELPERS
// ================================ */
// function DocBadge({ icon, ok }) {
//   return (
//     <div
//       className={`p-2 rounded-lg border ${
//         ok
//           ? "bg-emerald-50 border-emerald-100 text-emerald-600"
//           : "bg-slate-50 border-slate-100 text-slate-300"
//       }`}
//     >
//       {icon}
//     </div>
//   );
// }

// function LoadingSpinner() {
//   return (
//     <div className="bg-white p-20 rounded-[2rem] text-center">
//       <Loader2 className="animate-spin mx-auto text-blue-600" size={32} />
//       <p className="mt-4 font-black text-slate-700">Loading requests…</p>
//     </div>
//   );
// }

// function EmptyState() {
//   return (
//     <div className="bg-white p-20 rounded-[2rem] text-center">
//       <UserCheck className="mx-auto text-slate-300" size={40} />
//       <p className="mt-4 font-black text-slate-700">No pending requests</p>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ClipboardList,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  IdCard,
  BookOpen,
  UserCheck,
  UserPlus,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  fetchAppointmentsByStatus,
  updateAppointment,
  assignUserToAppointment,
} from "../../Redux/slices/cusomerSlice/appointmentSlice";

import { fetchUsers } from "../../Redux/slices/userSlices/userSlice";

/* ===============================
   PDF OPEN HELPER
================================ */
// const openPdf = (appointment) => {
//   if (!appointment?.documents?.length) {
//     alert("No PDF uploaded for this request");
//     return;
//   }

//   window.open(
//     appointment.documents[0].url,
//     "_blank",
//     "noopener,noreferrer"
//   );
// };
const openPdf = (appointment) => {
  console.log("PDF OBJECT:", appointment.documents);
  console.log("PDF URL:", appointment?.documents?.[0]?.url);

  if (!appointment?.documents?.length) {
    alert("No PDF uploaded for this request");
    return;
  }

  window.open(appointment.documents[0].url, "_blank");
};
export default function PendingAppointments() {
  const dispatch = useDispatch();

  const list = useSelector(
    (state) => state.appointments.byStatus?.["PENDING"] || []
  );

  const loading = useSelector((state) => state.appointments.loading);
  const updatingId = useSelector((state) => state.appointments.updatingId);

  const { list: users = [] } = useSelector(
    (state) => state.users || {}
  );

  const [selectedUser, setSelectedUser] = useState({});

  /* ===============================
     FETCH ONLY PENDING
  ================================ */
  useEffect(() => {
    dispatch(fetchAppointmentsByStatus("PENDING"));
    dispatch(fetchUsers());
  }, [dispatch]);

  const pendingCount = useMemo(() => list.length, [list]);

  /* ===============================
     APPROVE
  ================================ */
  const approveWithUser = async (appointmentId) => {
    const userId = selectedUser[appointmentId];
    if (!userId) return;

    await dispatch(
      assignUserToAppointment({
        id: appointmentId,
        assignedUserId: userId,
      })
    ).unwrap();

    await dispatch(
      updateAppointment({
        id: appointmentId,
        data: { status: "APPROVED" },
      })
    ).unwrap();

    // Remove from local UI instantly (no refetch needed)
  };

  /* ===============================
     REJECT
  ================================ */
  const rejectAppointment = async (id) => {
    await dispatch(
      updateAppointment({
        id,
        data: { status: "REJECTED" },
      })
    ).unwrap();
  };

  if (loading) return <LoadingSpinner />;
  if (pendingCount === 0) return <EmptyState />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
            <ClipboardList size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">
              Pending Requests
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase">
              Queue Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
          <span className="text-sm font-black text-blue-700">
            {pendingCount} Action Required
          </span>
        </div>
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {list.map((a) => {
          const isUpdating = updatingId === a._id;
          const hasPdf = a.documents?.length > 0;

          return (
            <div
              key={a._id}
              className="bg-white border border-slate-100 rounded-[2rem] p-2 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col lg:flex-row gap-6 p-4">

                {/* CUSTOMER */}
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-sm">
                    {a.customerId?.fullName || "Guest Client"}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Phone size={12} /> {a.customerId?.phone}
                  </p>
                </div>

                {/* SERVICE */}
                <div className="flex-1">
                  <div className="text-xs font-black text-emerald-600">
                    {a.serviceId?.name}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(a.appointmentDate).toLocaleString()}
                  </div>
                </div>

                {/* DOCUMENT BADGES */}
                <div className="flex gap-2 items-center">
                  <DocBadge icon={<FileText size={12} />} ok={hasPdf} />
                  <DocBadge icon={<IdCard size={12} />} ok={a.identityProvided} />
                  <DocBadge icon={<BookOpen size={12} />} ok={a.passportProvided} />

                  {!hasPdf && (
                    <span className="text-[10px] text-rose-500 font-black flex items-center gap-1">
                      <AlertCircle size={12} /> No PDF
                    </span>
                  )}
                </div>

                {/* READ PDF */}
                <button
                  onClick={() => openPdf(a)}
                  disabled={!hasPdf}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all ${
                    hasPdf
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <FileText size={14} />
                  Read PDF
                </button>

                {/* ASSIGN + ACTIONS */}
                <div className="flex gap-2">
                  <select
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-50"
                    value={selectedUser[a._id] || ""}
                    onChange={(e) =>
                      setSelectedUser((prev) => ({
                        ...prev,
                        [a._id]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Assign Staff</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.fullName}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => approveWithUser(a._id)}
                    disabled={isUpdating || !selectedUser[a._id]}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle size={14} />
                    )}
                    Approve
                  </button>

                  <button
                    onClick={() => rejectAppointment(a._id)}
                    disabled={isUpdating}
                    className="p-2 rounded-xl bg-rose-50 text-rose-500"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===============================
   HELPERS
================================ */
function DocBadge({ icon, ok }) {
  return (
    <div
      className={`p-2 rounded-lg border ${
        ok
          ? "bg-emerald-50 border-emerald-100 text-emerald-600"
          : "bg-slate-50 border-slate-100 text-slate-300"
      }`}
    >
      {icon}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="bg-white p-20 rounded-[2rem] text-center">
      <Loader2 className="animate-spin mx-auto text-blue-600" size={32} />
      <p className="mt-4 font-black text-slate-700">
        Loading requests…
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white p-20 rounded-[2rem] text-center">
      <UserCheck className="mx-auto text-slate-300" size={40} />
      <p className="mt-4 font-black text-slate-700">
        No pending requests
      </p>
    </div>
  );
}