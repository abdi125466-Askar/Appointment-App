

// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Activity,
//   Layers,
//   CheckCircle2,
//   AlertCircle,
//   Clock,
//   CalendarDays,
//   DownloadCloud,
//   XCircle,
// } from "lucide-react";

// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// import {
//   fetchEmployeeDashboardAnalytics,
//   fetchMyApprovedAppointments,
// } from "../../Redux/slices/cusomerSlice/appointmentEmployeeSlice";

// const GENDER_COLORS = {
//   MALE: "#6366f1",
//   FEMALE: "#ec4899",
//   UNKNOWN: "#94a3b8",
// };

// const TABS = [
//   { key: "TODAY", label: "Today" },
//   { key: "UPCOMING", label: "Upcoming" },
//   { key: "REJECTED", label: "Rejected" },
// ];

// export default function EmployeeDashboard() {
//   const dispatch = useDispatch();

//   const {
//     summary = {},
//     byGender = {},
//     appointments = [],
//     dashboardLoading,
//     loadingAppointments,
//   } = useSelector((state) => state.appointmentEmployee || {});

//   const today = new Date();
//   const [month, setMonth] = useState(today.getMonth() + 1);
//   const [year, setYear] = useState(today.getFullYear());
//   const [activeTab, setActiveTab] = useState("TODAY");

//   useEffect(() => {
//     dispatch(fetchEmployeeDashboardAnalytics({ month, year }));
//     dispatch(fetchMyApprovedAppointments()); // ✅ refetch too (keeps tabs fresh)
//   }, [dispatch, month, year]);

//   const dateRange = useMemo(() => {
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);
//     const end = new Date();
//     end.setHours(23, 59, 59, 999);
//     return { start, end };
//   }, []);

//   const todayAppointments = useMemo(() => {
//     const { start, end } = dateRange;
//     return appointments.filter((a) => {
//       const d = new Date(a.appointmentDate);
//       return d >= start && d <= end;
//     });
//   }, [appointments, dateRange]);

//   const upcomingAppointments = useMemo(() => {
//     const now = new Date();
//     return appointments
//       .filter((a) => new Date(a.appointmentDate) > now)
//       .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
//   }, [appointments]);

//   const rejectedAppointments = useMemo(() => {
//     return appointments
//       .filter((a) => a.status === "REJECTED")
//       .sort(
//         (a, b) =>
//           new Date(b.updatedAt || b.createdAt) -
//           new Date(a.updatedAt || a.createdAt)
//       );
//   }, [appointments]);

//   const tabList = useMemo(() => {
//     if (activeTab === "TODAY") return todayAppointments;
//     if (activeTab === "UPCOMING") return upcomingAppointments;
//     if (activeTab === "REJECTED") return rejectedAppointments;
//     return todayAppointments;
//   }, [activeTab, todayAppointments, upcomingAppointments, rejectedAppointments]);

//   const genderData = useMemo(() => {
//     return Object.entries(byGender)
//       .filter(([_, v]) => Number(v) > 0)
//       .map(([k, v]) => ({ name: k, value: Number(v) }));
//   }, [byGender]);

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Employee Daily Appointment Report", 14, 15);
//     doc.setFontSize(10);
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 22);

//     autoTable(doc, {
//       startY: 30,
//       head: [["Metric", "Value"]],
//       body: [
//         ["Total Assigned", summary.totalAssigned || 0],
//         ["Completed", summary.completed || 0],
//         ["Pending", summary.approvedPending || 0],
//         ["No Show", summary.noShow || 0],
//         ["Rejected", summary.rejected || 0],
//       ],
//     });

//     autoTable(doc, {
//       startY: doc.lastAutoTable.finalY + 12,
//       head: [["Customer", "Gender", "Service", "Date", "Status"]],
//       body: todayAppointments.map((a) => [
//         a.customerId?.fullName || "N/A",
//         a.customerId?.gender || "N/A",
//         a.serviceId?.name || "N/A",
//         new Date(a.appointmentDate).toLocaleString([], {
//           dateStyle: "medium",
//           timeStyle: "short",
//         }),
//         a.status || "N/A",
//       ]),
//     });

//     doc.save("employee_today_appointments.pdf");
//   };

//   if (dashboardLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//           <span className="text-slate-500 font-black text-xs uppercase">
//             Loading dashboard…
//           </span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-10 bg-[#F8FAFC] min-h-screen">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* HEADER */}
//         <div className="flex flex-wrap justify-between items-center gap-6">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-blue-600 rounded-2xl text-white shadow">
//               <Activity size={24} />
//             </div>
//             <div>
//               <h1 className="text-3xl font-black text-slate-800">
//                 Employee Dashboard
//               </h1>
//               <p className="text-xs text-slate-400 font-bold">
//                 Personal performance & today activity
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <select
//               value={month}
//               onChange={(e) => setMonth(Number(e.target.value))}
//               className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold shadow-sm"
//             >
//               {Array.from({ length: 12 }, (_, i) => (
//                 <option key={i} value={i + 1}>
//                   Month {i + 1}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={year}
//               onChange={(e) => setYear(Number(e.target.value))}
//               className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold shadow-sm"
//             >
//               {[2024, 2025, 2026].map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>

//             <button
//               onClick={downloadPDF}
//               className="px-4 py-2.5 bg-white border border-slate-200 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-slate-50"
//             >
//               <DownloadCloud size={16} /> PDF
//             </button>
//           </div>
//         </div>

//         {/* KPI */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <KPI
//             icon={Layers}
//             label="Total Assigned"
//             value={summary.totalAssigned}
//             color="bg-indigo-50 text-indigo-600"
//           />
//           <KPI
//             icon={CheckCircle2}
//             label="Completed"
//             value={summary.completed}
//             color="bg-emerald-50 text-emerald-600"
//           />
//           <KPI
//             icon={Clock}
//             label="Pending"
//             value={summary.approvedPending}
//             color="bg-amber-50 text-amber-600"
//           />
//           <KPI
//             icon={AlertCircle}
//             label="No Show"
//             value={summary.noShow}
//             color="bg-rose-50 text-rose-600"
//           />
//         </div>

//         {/* Rejected insight */}
//         <div className="flex items-center gap-3">
//           <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
//             <XCircle className="text-rose-600" size={16} />
//             <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
//               Rejected (period)
//             </span>
//             <span className="text-[11px] font-black text-rose-600">
//               {summary.rejected || 0}
//             </span>
//           </div>
//           <p className="text-xs text-slate-400 font-bold">
//             (Shown as an insight — not a performance KPI.)
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* GENDER PIE */}
//           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
//             <h3 className="font-black mb-4">Gender Distribution</h3>

//             {genderData.length === 0 ? (
//               <div className="h-[260px] flex items-center justify-center text-slate-400 font-bold">
//                 No gender data yet.
//               </div>
//             ) : (
//               <div className="h-[260px]">
//                 <ResponsiveContainer>
//                   <PieChart>
//                     <Pie
//                       data={genderData}
//                       dataKey="value"
//                       innerRadius={70}
//                       outerRadius={100}
//                       paddingAngle={8}
//                       label={({ name, percent }) =>
//                         `${name} ${(percent * 100).toFixed(0)}%`
//                       }
//                       labelLine={false}
//                     >
//                       {genderData.map((g) => (
//                         <Cell
//                           key={g.name}
//                           fill={GENDER_COLORS[g.name] || GENDER_COLORS.UNKNOWN}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             )}
//           </div>

//           {/* APPOINTMENTS TABLE */}
//           <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
//               <div className="font-black">Appointments</div>

//               <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
//                 {TABS.map((t) => (
//                   <button
//                     key={t.key}
//                     onClick={() => setActiveTab(t.key)}
//                     className={`px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition
//                       ${
//                         activeTab === t.key
//                           ? "bg-white shadow-sm border border-slate-200 text-slate-800"
//                           : "text-slate-500 hover:text-slate-700"
//                       }`}
//                   >
//                     {t.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {loadingAppointments ? (
//               <div className="p-16 text-center text-slate-400 font-bold">
//                 Loading appointments...
//               </div>
//             ) : tabList.length === 0 ? (
//               <div className="p-16 text-center text-slate-400 font-bold">
//                 No records found.
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="text-xs uppercase text-slate-400 font-black border-b border-slate-200">
//                     <tr>
//                       <th className="px-6 py-4">Customer</th>
//                       <th className="px-6 py-4">Service</th>
//                       <th className="px-6 py-4">Date</th>
//                       <th className="px-6 py-4">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-200">
//                     {tabList.map((a) => (
//                       <tr key={a._id}>
//                         <td className="px-6 py-4 font-bold">
//                           {a.customerId?.fullName || "N/A"}
//                         </td>
//                         <td className="px-6 py-4 italic text-slate-500">
//                           {a.serviceId?.name || "N/A"}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <CalendarDays size={14} className="text-slate-400" />
//                             {new Date(a.appointmentDate).toLocaleString([], {
//                               dateStyle: "medium",
//                               timeStyle: "short",
//                             })}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <StatusPill status={a.status} />
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* KPI */
// const KPI = ({ icon: Icon, label, value, color }) => (
//   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
//     <div className={`p-4 rounded-xl ${color}`}>
//       <Icon size={24} />
//     </div>
//     <div>
//       <p className="text-xs font-black text-slate-400 uppercase">{label}</p>
//       <h4 className="text-3xl font-black text-slate-800">{value || 0}</h4>
//     </div>
//   </div>
// );

// function StatusPill({ status }) {
//   const map = {
//     APPROVED: "bg-blue-50 text-blue-700 border-blue-100",
//     COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
//     REJECTED: "bg-rose-50 text-rose-700 border-rose-100",
//     NO_SHOW: "bg-slate-50 text-slate-700 border-slate-200",
//   };

//   return (
//     <span
//       className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
//         map[status] || "bg-slate-50 text-slate-700 border-slate-200"
//       }`}
//     >
//       {status || "N/A"}
//     </span>
//   );
// }


import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  CalendarDays,
  DownloadCloud,
  XCircle,
} from "lucide-react";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  fetchEmployeeDashboardAnalytics,
  fetchMyApprovedAppointments,
} from "../../Redux/slices/cusomerSlice/appointmentEmployeeSlice";

const GENDER_COLORS = {
  MALE: "#6366f1",
  FEMALE: "#ec4899",
  UNKNOWN: "#94a3b8",
};

const TABS = [
  { key: "TODAY", label: "Today" },
  { key: "UPCOMING", label: "Upcoming" },
  { key: "REJECTED", label: "Rejected" },
  { key: "NO_SHOW", label: "No Show" },
];

export default function EmployeeDashboard() {
  const dispatch = useDispatch();

  const {
    summary = {},
    byGender = {},
    appointments = [],
    dashboardLoading,
    loadingAppointments,
  } = useSelector((state) => state.appointmentEmployee || {});

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [activeTab, setActiveTab] = useState("TODAY");

  useEffect(() => {
    dispatch(fetchEmployeeDashboardAnalytics({ month, year }));
    dispatch(fetchMyApprovedAppointments());
  }, [dispatch, month, year]);

  const dateRange = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }, []);

  const todayAppointments = useMemo(() => {
    const { start, end } = dateRange;
    return appointments.filter((a) => {
      const d = new Date(a.appointmentDate);
      return d >= start && d <= end;
    });
  }, [appointments, dateRange]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((a) => new Date(a.appointmentDate) > now)
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  }, [appointments]);

  const rejectedAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.status === "REJECTED")
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt),
      );
  }, [appointments]);

  const noShowAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.status === "NO_SHOW")
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt),
      );
  }, [appointments]);

  const tabList = useMemo(() => {
    if (activeTab === "TODAY") return todayAppointments;
    if (activeTab === "UPCOMING") return upcomingAppointments;
    if (activeTab === "REJECTED") return rejectedAppointments;
    if (activeTab === "NO_SHOW") return noShowAppointments;
    return todayAppointments;
  }, [
    activeTab,
    todayAppointments,
    upcomingAppointments,
    rejectedAppointments,
    noShowAppointments,
  ]);

  const genderData = useMemo(() => {
    return Object.entries(byGender)
      .filter(([_, v]) => Number(v) > 0)
      .map(([k, v]) => ({ name: k, value: Number(v) }));
  }, [byGender]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Employee Daily Appointment Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [["Metric", "Value"]],
      body: [
        ["Total Assigned", summary.totalAssigned || 0],
        ["Completed", summary.completed || 0],
        ["Pending", summary.approvedPending || 0],
        ["No Show", summary.noShow || 0],
        ["Rejected", summary.rejected || 0],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [["Customer", "Gender", "Service", "Date", "Status"]],
      body: todayAppointments.map((a) => [
        a.customerId?.fullName || "N/A",
        a.customerId?.gender || "N/A",
        a.serviceId?.name || "N/A",
        new Date(a.appointmentDate).toLocaleString([], {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        a.status || "N/A",
      ]),
    });

    doc.save("employee_today_appointments.pdf");
  };

  if (dashboardLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 font-black text-xs uppercase">
            Loading dashboard…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">
                Employee Dashboard
              </h1>
              <p className="text-xs text-slate-400 font-bold">
                Personal performance & today activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-500 font-bold shadow-sm"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  Month {i + 1}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-500 font-bold shadow-sm"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={downloadPDF}
              className="px-4 py-2.5 bg-white border border-slate-200 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-slate-50"
            >
              <DownloadCloud size={16} /> PDF
            </button>
          </div>
        </div>

        {/* KPI (✅ Rejected moved next to No Show, same row, no empty box) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <KPI
            icon={Layers}
            label="Total Assigned"
            value={summary.totalAssigned}
            color="bg-indigo-50 text-indigo-600"
          />
          <KPI
            icon={CheckCircle2}
            label="Completed"
            value={summary.completed}
            color="bg-emerald-50 text-emerald-600"
          />
          <KPI
            icon={Clock}
            label="Pending"
            value={summary.approvedPending}
            color="bg-amber-50 text-amber-600"
          />
          <KPI
            icon={AlertCircle}
            label="No Show"
            value={summary.noShow}
            color="bg-rose-50 text-rose-600"
          />

          {/* ✅ NEW: Rejected next to No Show */}
          <MiniKPI icon={XCircle} label="Rejected" value={summary.rejected} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GENDER PIE */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-black mb-4">Gender Distribution</h3>

            {genderData.length === 0 ? (
              <div className="h-[260px] flex items-center justify-center text-slate-400 font-bold">
                No gender data yet.
              </div>
            ) : (
              <div className="h-[260px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey="value"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {genderData.map((g) => (
                        <Cell
                          key={g.name}
                          fill={GENDER_COLORS[g.name] || GENDER_COLORS.UNKNOWN}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* APPOINTMENTS TABLE */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
              <div className="font-black">Appointments</div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition
                      ${
                        activeTab === t.key
                          ? "bg-white shadow-sm border border-slate-200 text-slate-800"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingAppointments ? (
              <div className="p-16 text-center text-slate-400 font-bold">
                Loading appointments...
              </div>
            ) : tabList.length === 0 ? (
              <div className="p-16 text-center text-slate-400 font-bold">
                No records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-xs uppercase text-slate-400 font-black border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {tabList.map((a) => (
                      <tr key={a._id}>
                        <td className="px-6 py-4 font-bold">
                          {a.customerId?.fullName || "N/A"}
                        </td>
                        <td className="px-6 py-4 italic text-slate-500">
                          {a.serviceId?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={14} className="text-slate-400" />
                            {new Date(a.appointmentDate).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusPill status={a.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* KPI */
const KPI = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs font-black text-slate-400 uppercase">{label}</p>
      <h4 className="text-3xl font-black text-slate-800">{value || 0}</h4>
    </div>
  </div>
);

/* ✅ NEW: Mini KPI (same size & style) */
const MiniKPI = ({ icon: Icon, label, value }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
      <div className="p-4 rounded-xl bg-rose-50 text-rose-600">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase">{label}</p>
        <h4 className="text-3xl font-black text-slate-800">{value || 0}</h4>
      </div>
    </div>
  );
};

function StatusPill({ status }) {
  const map = {
    APPROVED: "bg-blue-50 text-blue-700 border-blue-100",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-100",
    NO_SHOW: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
        map[status] || "bg-slate-50 text-slate-700 border-slate-200"
      }`}
    >
      {status || "N/A"}
    </span>
  );
}
