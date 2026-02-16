// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAppointmentsByStatus,
//   updateAppointment,
// } from "../../Redux/slices/cusomerSlice/appointmentSlice";
// import {
//   User,
//   Phone,
//   Calendar,
//   ClipboardList,
//   UserCheck,
//   ChevronDown,
//   Loader2,
//   Filter,
// } from "lucide-react";

// const STATUS_OPTIONS = [
//   {
//     value: "APPROVED",
//     label: "Approved",
//     color: "bg-blue-50 text-blue-700 border-blue-100",
//   },
//   {
//     value: "COMPLETED",
//     label: "Completed",
//     color: "bg-emerald-50 text-emerald-700 border-emerald-100",
//   },
//   {
//     value: "REJECTED",
//     label: "Rejected",
//     color: "bg-rose-50 text-rose-700 border-rose-100",
//   },
//   {
//     value: "NO_SHOW",
//     label: "No Show",
//     color: "bg-amber-50 text-amber-700 border-amber-100",
//   },
// ];

// export default function ApprovedAppointments() {
//   const dispatch = useDispatch();

//   const { byStatus = {}, loading, updatingId } = useSelector(
//     (state) => state.appointments || {}
//   );

//   const [status, setStatus] = useState("APPROVED");

//   useEffect(() => {
//     dispatch(fetchAppointmentsByStatus(status));
//   }, [status, dispatch]);

//   const list = useMemo(() => {
//     const arr = byStatus?.[status];
//     return Array.isArray(arr) ? arr : [];
//   }, [byStatus, status]);

//   const count = useMemo(() => list.length, [list]);

//   const handleStatusChange = async (id, newStatus) => {
//     const res = await dispatch(
//       updateAppointment({ id, data: { status: newStatus } })
//     );
//     if (res.meta.requestStatus === "fulfilled") {
//       await dispatch(fetchAppointmentsByStatus(status));
//     }
//   };

//   const currentStatusTheme =
//     STATUS_OPTIONS.find((opt) => opt.value === status)?.color ||
//     "bg-slate-50 text-slate-700 border-slate-100";

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
//             <ClipboardList size={22} />
//           </div>
//           <div>
//             <h2 className="text-xl font-black text-slate-800 tracking-tight">
//               Records Vault
//             </h2>
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//               Filter &amp; Manage History
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
//           <div className="flex items-center gap-2 px-3 text-slate-400">
//             <Filter size={16} />
//             <span className="text-[10px] font-black uppercase tracking-wider">
//               Status:
//             </span>
//           </div>

//           <div className="relative">
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-xs font-black text-slate-700 outline-none focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer"
//             >
//               {STATUS_OPTIONS.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown
//               size={14}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//             />
//           </div>

//           <div className="px-4 py-2 bg-green-700 rounded-xl text-white text-[10px] font-black uppercase tracking-tighter">
//             {count} items
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-4 shadow-sm">
//           <Loader2 className="w-10 h-10 text-slate-200 animate-spin" />
//           <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">
//             Retrieving Data...
//           </p>
//         </div>
//       ) : count === 0 ? (
//         <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 p-20 text-center">
//           <p className="text-slate-400 font-bold italic">
//             No records found for this category.
//           </p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-slate-50 [&>th]:px-8 [&>th]:py-6 text-left">
//                   <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     Customer
//                   </th>
//                   <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     Service &amp; Date
//                   </th>
//                   <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     Assignment
//                   </th>
//                   <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
//                     Update
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-50">
//                 {list.map((a) => (
//                   <tr
//                     key={a._id}
//                     className="group hover:bg-slate-50/50 transition-colors"
//                   >
//                     <td className="px-8 py-6">
//                       <div className="flex items-center gap-4">
//                         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-white transition-colors">
//                           <User size={18} />
//                         </div>
//                         <div>
//                           <p className="font-black text-slate-700 text-sm">
//                             {a.customerId?.fullName || "Guest"}
//                           </p>
//                           <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-0.5">
//                             <Phone size={12} className="text-slate-300" />
//                             {a.customerId?.phone || "N/A"}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-8 py-6">
//                       <span
//                         className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase mb-1.5 border ${currentStatusTheme}`}
//                       >
//                         {a.serviceId?.name || "Service"}
//                       </span>

//                       <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
//                         <Calendar size={14} className="text-slate-300" />
//                         {a.appointmentDate
//                           ? new Date(a.appointmentDate).toLocaleString([], {
//                               dateStyle: "medium",
//                               timeStyle: "short",
//                             })
//                           : "N/A"}
//                       </div>
//                     </td>

//                     <td className="px-8 py-6">
//                       {a.assignedUserId ? (
//                         <div className="flex items-center gap-2 text-slate-600 text-xs font-bold bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl w-fit">
//                           <UserCheck size={14} className="text-emerald-500" />
//                           {a.assignedUserId.fullName}
//                         </div>
//                       ) : (
//                         <span className="text-[10px] font-black text-slate-300 uppercase italic">
//                           Not Assigned
//                         </span>
//                       )}
//                     </td>

//                     <td className="px-8 py-6">
//                       <div className="flex justify-center">
//                         <select
//                           disabled={updatingId === a._id}
//                           value={a.status}
//                           onChange={(e) =>
//                             handleStatusChange(a._id, e.target.value)
//                           }
//                           className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-tighter text-slate-600 outline-none focus:border-slate-900 transition-all cursor-pointer disabled:opacity-50"
//                         >
//                           {STATUS_OPTIONS.map((opt) => (
//                             <option key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointmentsByStatus,
  updateAppointment,
} from "../../Redux/slices/cusomerSlice/appointmentSlice";
import {
  User,
  Phone,
  Calendar,
  ClipboardList,
  UserCheck,
  ChevronDown,
  Loader2,
  Filter,
  FileText,
} from "lucide-react";

const STATUS_OPTIONS = [
  {
    value: "APPROVED",
    label: "Approved",
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    value: "REJECTED",
    label: "Rejected",
    color: "bg-rose-50 text-rose-700 border-rose-100",
  },
  {
    value: "NO_SHOW",
    label: "No Show",
    color: "bg-amber-50 text-amber-700 border-amber-100",
  },
];

/* ================================
   ✅ OPEN PDF (WHERE TO SEE PDF)
   - preferred: a.documents[0].url (backend sends)
   - fallback: build from filename + API base
================================ */
const openPdf = (appointment) => {
  const doc = appointment?.documents?.[0];
  if (!doc) {
    alert("No PDF uploaded for this request");
    return;
  }

  const url =
    doc.url ||
    `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/uploads/appointments/${doc.filename}`;

  window.open(url, "_blank", "noopener,noreferrer");
};

export default function ApprovedAppointments() {
  const dispatch = useDispatch();

  const { byStatus = {}, loading, updatingId } = useSelector(
    (state) => state.appointments || {}
  );

  const [status, setStatus] = useState("APPROVED");

  useEffect(() => {
    dispatch(fetchAppointmentsByStatus(status));
  }, [status, dispatch]);

  const list = useMemo(() => {
    const arr = byStatus?.[status];
    return Array.isArray(arr) ? arr : [];
  }, [byStatus, status]);

  const count = useMemo(() => list.length, [list]);

  const handleStatusChange = async (id, newStatus) => {
    const res = await dispatch(
      updateAppointment({ id, data: { status: newStatus } })
    );
    if (res.meta.requestStatus === "fulfilled") {
      await dispatch(fetchAppointmentsByStatus(status));
    }
  };

  const currentStatusTheme =
    STATUS_OPTIONS.find((opt) => opt.value === status)?.color ||
    "bg-slate-50 text-slate-700 border-slate-100";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <ClipboardList size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Records Vault
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Filter &amp; Manage History
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 px-3 text-slate-400">
            <Filter size={16} />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Status:
            </span>
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-xs font-black text-slate-700 outline-none focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          <div className="px-4 py-2 bg-green-700 rounded-xl text-white text-[10px] font-black uppercase tracking-tighter">
            {count} items
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-4 shadow-sm">
          <Loader2 className="w-10 h-10 text-slate-200 animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">
            Retrieving Data...
          </p>
        </div>
      ) : count === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 p-20 text-center">
          <p className="text-slate-400 font-bold italic">
            No records found for this category.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50 [&>th]:px-8 [&>th]:py-6 text-left">
                  <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Customer
                  </th>
                  <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Service &amp; Date
                  </th>
                  <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Assignment
                  </th>

                  {/* ✅ NEW: PDF COLUMN */}
                  <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    PDF
                  </th>

                  <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Update
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {list.map((a) => {
                  const hasPdf = Array.isArray(a.documents) && a.documents.length > 0;

                  return (
                    <tr
                      key={a._id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-white transition-colors">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-black text-slate-700 text-sm">
                              {a.customerId?.fullName || "Guest"}
                            </p>
                            <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                              <Phone size={12} className="text-slate-300" />
                              {a.customerId?.phone || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase mb-1.5 border ${currentStatusTheme}`}
                        >
                          {a.serviceId?.name || "Service"}
                        </span>

                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                          <Calendar size={14} className="text-slate-300" />
                          {a.appointmentDate
                            ? new Date(a.appointmentDate).toLocaleString([], {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "N/A"}
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        {a.assignedUserId ? (
                          <div className="flex items-center gap-2 text-slate-600 text-xs font-bold bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl w-fit">
                            <UserCheck size={14} className="text-emerald-500" />
                            {a.assignedUserId.fullName}
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-slate-300 uppercase italic">
                            Not Assigned
                          </span>
                        )}
                      </td>

                      {/* ✅ NEW: PDF BUTTON CELL */}
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <button
                            onClick={() => openPdf(a)}
                            disabled={!hasPdf}
                            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tighter transition-all flex items-center gap-2 ${
                              hasPdf
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                            title={hasPdf ? "Open uploaded PDF" : "No PDF uploaded"}
                          >
                            <FileText size={14} />
                            View
                          </button>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <select
                            disabled={updatingId === a._id}
                            value={a.status}
                            onChange={(e) =>
                              handleStatusChange(a._id, e.target.value)
                            }
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-tighter text-slate-600 outline-none focus:border-slate-900 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

