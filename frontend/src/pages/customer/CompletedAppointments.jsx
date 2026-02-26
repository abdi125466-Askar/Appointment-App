// import React, { useEffect, useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import api from "../../utils/axios";

// export default function CompletedAppointments() {
//   const token = useSelector((state) => state.auth?.token);

//   const [loading, setLoading] = useState(false);
//   const [rows, setRows] = useState([]);
//   const [error, setError] = useState(null);

//   const [search, setSearch] = useState("");

//   // Load COMPLETED appointments
//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // ✅ uses your existing endpoint: GET /api/appointments/appointments?status=COMPLETED
//         const res = await api.get("/appointments/appointments?status=COMPLETED", {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });

//         setRows(res.data?.data || []);
//       } catch (e) {
//         setError(e.response?.data?.message || "Failed to load completed appointments");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [token]);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return rows;

//     return rows.filter((a) => {
//       const customer = a.customerId?.fullName?.toLowerCase() || "";
//       const phone = a.customerId?.phone?.toLowerCase() || "";
//       const service = a.serviceId?.name?.toLowerCase() || "";
//       const staff = a.assignedUserId?.fullName?.toLowerCase() || "";
//       return (
//         customer.includes(q) ||
//         phone.includes(q) ||
//         service.includes(q) ||
//         staff.includes(q)
//       );
//     });
//   }, [rows, search]);

//   return (
//     <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl font-black text-slate-800">
//               Completed Appointments
//             </h1>
            
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-black text-slate-600">
//               {filtered.length} items
//             </div>

//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search..."
//               className="w-[240px] px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         </div>

//         {/* Body */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
//             <div className="text-sm font-black text-slate-700">
//               Records Vault
//             </div>
//             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//               Completed only
//             </div>
//           </div>

//           {loading ? (
//             <div className="p-16 text-center text-slate-400 font-bold">
//               Loading completed appointments...
//             </div>
//           ) : error ? (
//             <div className="p-16 text-center text-rose-600 font-bold">
//               {error}
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="p-16 text-center text-slate-400 font-bold">
//               No completed records found.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="text-[11px] uppercase text-slate-400 font-black border-b border-slate-200">
//                   <tr>
//                     <th className="px-6 py-4 text-left">Customer</th>
//                     <th className="px-6 py-4 text-left">Service</th>
//                     <th className="px-6 py-4 text-left">Assigned</th>
//                     <th className="px-6 py-4 text-left">Date</th>
//                     <th className="px-6 py-4 text-left">Status</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200">
//                   {filtered.map((a) => (
//                     <tr key={a._id} className="hover:bg-slate-50">
//                       <td className="px-6 py-4">
//                         <div className="font-black text-slate-800">
//                           {a.customerId?.fullName || "N/A"}
//                         </div>
//                         <div className="text-xs text-slate-400 font-bold">
//                           {a.customerId?.phone || ""}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="font-bold text-slate-600 italic">
//                           {a.serviceId?.name || "N/A"}
//                         </div>
//                         <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
//                           {a.serviceId?.code || ""}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="font-bold text-indigo-600">
//                           {a.assignedUserId?.fullName || "—"}
//                         </div>
//                         <div className="text-xs text-slate-400 font-bold">
//                           {a.assignedUserId?.role || ""}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="font-bold text-slate-700">
//                           {new Date(a.appointmentDate || a.createdAt).toLocaleString([], {
//                             dateStyle: "medium",
//                             timeStyle: "short",
//                           })}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <span className="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-100">
//                           COMPLETED
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>

//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/axios";
import { FileText, Search, Loader2 } from "lucide-react";

export default function CompletedAppointments() {
  const token = useSelector((state) => state.auth?.token);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  /* ===============================
     LOAD COMPLETED APPOINTMENTS
  ============================== */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(
          "/appointments/appointments?status=COMPLETED",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        setRows(res.data?.data || []);
      } catch (e) {
        setError(
          e.response?.data?.message ||
            "Failed to load completed appointments"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  /* ===============================
     SEARCH FILTER
  ============================== */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((a) => {
      const customer = a.customerId?.fullName?.toLowerCase() || "";
      const phone = a.customerId?.phone?.toLowerCase() || "";
      const service = a.serviceId?.name?.toLowerCase() || "";
      const staff = a.assignedUserId?.fullName?.toLowerCase() || "";
      return (
        customer.includes(q) ||
        phone.includes(q) ||
        service.includes(q) ||
        staff.includes(q)
      );
    });
  }, [rows, search]);

  /* ===============================
     OPEN PDF
  ============================== */
  const openPdf = (appointment) => {
    const doc = appointment?.documents?.[0];
    if (!doc) {
      alert("No PDF uploaded for this appointment");
      return;
    }

    const url =
      doc.url ||
      `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/uploads/appointments/${doc.filename}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800">
              Completed Appointments
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Finalized records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-black text-slate-600">
              {filtered.length} items
            </div>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, phone, service..."
                className="w-[260px] pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-500 font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="text-sm font-black text-slate-700">
              Records Vault
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Completed only
            </div>
          </div>

          {loading ? (
            <div className="p-16 flex flex-col items-center gap-3 text-slate-400 font-bold">
              <Loader2 className="animate-spin" />
              Loading completed appointments...
            </div>
          ) : error ? (
            <div className="p-16 text-center text-rose-600 font-bold">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center text-slate-400 font-bold">
              No completed records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-[11px] uppercase text-slate-400 font-black border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left">Customer</th>
                    <th className="px-6 py-4 text-left">Service</th>
                    <th className="px-6 py-4 text-left">Assigned</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-center">PDF</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filtered.map((a) => {
                    const hasPdf =
                      Array.isArray(a.documents) && a.documents.length > 0;

                    return (
                      <tr key={a._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-black text-slate-800">
                            {a.customerId?.fullName || "N/A"}
                          </div>
                          <div className="text-xs text-slate-400 font-bold">
                            {a.customerId?.phone || ""}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-600 italic">
                            {a.serviceId?.name || "N/A"}
                          </div>
                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                            {a.serviceId?.code || ""}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-bold text-indigo-600">
                            {a.assignedUserId?.fullName || "—"}
                          </div>
                          <div className="text-xs text-slate-400 font-bold">
                            {a.assignedUserId?.role || ""}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-700">
                            {new Date(
                              a.appointmentDate || a.createdAt
                            ).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </div>
                        </td>

                        {/* PDF COLUMN */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openPdf(a)}
                            disabled={!hasPdf}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                              hasPdf
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            <FileText size={14} />
                            View
                          </button>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-100">
                            COMPLETED
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

