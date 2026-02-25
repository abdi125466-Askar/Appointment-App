// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   DownloadCloud,
//   Filter,
//   Activity,
//   Eye,
//   X,
//   Layers,
//   RefreshCw,
//   ChevronDown,
//   CalendarDays,
//   TrendingUp,
//   AlertCircle,
//   CheckCircle2,
//   Clock,
//   Calendar,
//   User,
// } from "lucide-react";

// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   LabelList,
//   /* ADDED NEW COMPONENTS BELOW */
//   AreaChart,
//   Area,
//   Line,
// } from "recharts";

// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// import { fetchAppointmentDashboard } from "../Redux/slices/cusomerSlice/appointmentDashboardSlice";

// const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444"]; // Pending, Approved, Completed, NoShow

// export default function AppointmentDashboard() {
//   const dispatch = useDispatch();

//   const { loading, totals, byStatus, lastActivities } = useSelector(
//     (state) => state.appointmentDashboard,
//   );

//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [timeFilter, setTimeFilter] = useState("ALL_TIME");
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAppointmentDashboard());
//   }, [dispatch]);

//   const handleRefresh = () => {
//     dispatch(fetchAppointmentDashboard());
//   };

//   const handleViewDetails = (appointment) => {
//     setSelectedAppointment(appointment);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedAppointment(null);
//   };

//   /* ===== CALCULATED METRICS ===== */
//   const metrics = useMemo(() => {
//     const total = totals?.total || 1;
//     const completed = byStatus?.completed || 0;
//     const noShow = byStatus?.noShow || 0;
//     const pending = byStatus?.pending || 0;

//     return {
//       completionRate: Math.round((completed / total) * 100),
//       cancellationRate: Math.round((noShow / total) * 100),
//       pendingCount: pending,
//     };
//   }, [totals, byStatus]);

//   /* ===== FILTER LOGIC ===== */
//   const filteredData = useMemo(() => {
//     let data = Array.isArray(lastActivities) ? [...lastActivities] : [];
//     const now = new Date();

//     if (timeFilter === "LAST_MONTH") {
//       const lastMonth = new Date();
//       lastMonth.setMonth(now.getMonth() - 1);
//       data = data.filter((a) => new Date(a.appointmentDate || a.createdAt) >= lastMonth);
//     }

//     if (timeFilter === "LAST_YEAR") {
//       const lastYear = new Date();
//       lastYear.setFullYear(now.getFullYear() - 1);
//       data = data.filter((a) => new Date(a.appointmentDate || a.createdAt) >= lastYear);
//     }

//     if (statusFilter !== "ALL") {
//       data = data.filter((a) => a.status?.toUpperCase() === statusFilter);
//     }

//     return data;
//   }, [lastActivities, statusFilter, timeFilter]);

//   /* ===== CHART DATA ===== */
//   const pieData = useMemo(() => {
//     const data = [
//       { name: "Pending", value: byStatus?.pending || 0 },
//       { name: "Approved", value: byStatus?.approved || 0 },
//       { name: "Completed", value: byStatus?.completed || 0 },
//       { name: "No Show", value: byStatus?.noShow || 0 },
//     ];
//     return data.filter((d) => d.value > 0);
//   }, [byStatus]);

//   const renderCustomizedLabel = ({
//     cx,
//     cy,
//     midAngle,
//     innerRadius,
//     outerRadius,
//     percent,
//   }) => {
//     const RADIAN = Math.PI / 180;
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return percent > 0.01 ? (
//       <text
//         x={x}
//         y={y}
//         fill="white"
//         textAnchor="middle"
//         dominantBaseline="central"
//         className="text-[11px] font-black"
//       >
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     ) : null;
//   };

//   const weeklyVolumeData = useMemo(() => {
//     const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//     const counts = [0, 0, 0, 0, 0, 0, 0];
//     const activities = Array.isArray(lastActivities) ? lastActivities : [];

//     activities.forEach((app) => {
//       const raw = app.appointmentDate || app.createdAt;
//       if (raw) {
//         const date = new Date(raw);
//         counts[date.getDay()] += 1;
//       }
//     });

//     return days.map((day, index) => ({
//       name: day,
//       appointments: counts[index],
//     }));
//   }, [lastActivities]);

//   /* ===== ADDED: SERVICE PERFORMANCE LOGIC ===== */
//   const serviceDistributionData = useMemo(() => {
//     const activities = Array.isArray(lastActivities) ? lastActivities : [];
//     const serviceMap = {};
//     activities.forEach((app) => {
//       const serviceName = app.serviceId?.name || "Miscellaneous";
//       serviceMap[serviceName] = (serviceMap[serviceName] || 0) + 1;
//     });
//     return Object.entries(serviceMap)
//       .map(([name, count]) => ({ name, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 5); 
//   }, [lastActivities]);

//   const serviceTrendData = useMemo(() => {
//     const activities = Array.isArray(lastActivities) ? lastActivities : [];
//     const dailyMap = {};
//     activities.forEach((app) => {
//       const raw = app.appointmentDate || app.createdAt;
//       if (raw) {
//         const dateKey = new Date(raw).toLocaleDateString(undefined, { month: "short", day: "numeric" });
//         dailyMap[dateKey] = (dailyMap[dateKey] || 0) + 1;
//       }
//     });
//     return Object.entries(dailyMap)
//       .map(([date, value]) => ({ date, value }))
//       .sort((a, b) => new Date(a.date) - new Date(b.date))
//       .slice(-7);
//   }, [lastActivities]);

//   /* ===== EXPORTS ===== */
//   const handleExportExcel = () => {
//     const data = filteredData.map((a) => ({
//       Customer: a.customerId?.fullName || "N/A",
//       Service: a.serviceId?.name || "N/A",
//       Staff: a.assignedUserId?.fullName || "—",
//       Date: new Date(a.appointmentDate || a.createdAt).toLocaleDateString(),
//       Status: a.status,
//     }));
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Appointments");
//     XLSX.writeFile(wb, `Dashboard_Report_${new Date().toLocaleDateString()}.xlsx`);
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Executive Appointment Report", 14, 15);
//     autoTable(doc, {
//       startY: 28,
//       head: [["Customer", "Service", "Staff", "Date", "Status"]],
//       body: filteredData.map((a) => [
//         a.customerId?.fullName || "N/A",
//         a.serviceId?.name || "N/A",
//         a.assignedUserId?.fullName || "—",
//         new Date(a.appointmentDate || a.createdAt).toLocaleDateString(),
//         a.status,
//       ]),
//     });
//     doc.save(`Appointments_Report.pdf`);
//   };

//   const getStatusStyle = (status) => {
//     switch (status?.toUpperCase()) {
//       case "COMPLETED":
//         return "bg-emerald-50 text-emerald-700 border-emerald-200";
//       case "APPROVED":
//         return "bg-indigo-50 text-indigo-700 border-indigo-200";
//       case "PENDING":
//         return "bg-amber-50 text-amber-700 border-amber-200";
//       case "NO_SHOW":
//         return "bg-rose-50 text-rose-700 border-rose-200";
//       case "REJECTED":
//         return "bg-slate-100 text-slate-700 border-slate-200";
//       default:
//         return "bg-slate-50 text-slate-600 border-slate-200";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
//         <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
//         <span className="text-slate-500 font-bold tracking-widest text-xs uppercase">
//           Updating Dashboard...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen font-sans text-slate-900 relative">
//       {/* MODAL */}
//       {showModal && selectedAppointment && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
//               <h3 className="text-lg font-black text-slate-800">
//                 Appointment Details
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="p-2 hover:bg-slate-100 rounded-full transition-colors"
//               >
//                 <X size={20} className="text-slate-400" />
//               </button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//                   Customer
//                 </label>
//                 <p className="font-bold text-slate-700 text-lg">
//                   {selectedAppointment.customerId?.fullName}
//                 </p>
//                 <p className="text-slate-500 text-sm">
//                   {selectedAppointment.customerId?.email}
//                 </p>
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//                   Assigned Staff
//                 </label>
//                 <p className="font-bold text-indigo-600">
//                   {selectedAppointment.assignedUserId?.fullName || "Not Assigned"}
//                 </p>
//               </div>
//               <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
//                 <div>
//                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//                     Status
//                   </label>
//                   <div
//                     className={`mt-1 inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getStatusStyle(selectedAppointment.status)}`}
//                   >
//                     {selectedAppointment.status}
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//                     Date
//                   </label>
//                   <p className="font-bold text-slate-700">
//                     {new Date(selectedAppointment.appointmentDate || selectedAppointment.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
//               <button
//                 onClick={closeModal}
//                 className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <div className="flex items-center gap-3 mb-1">
//               <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200 text-white">
//                 <Activity size={20} />
//               </div>
//               <h1 className="text-2xl font-extrabold tracking-tight">
//                 Executive Overview
//               </h1>
//             </div>
//             <p className="text-slate-500 text-sm font-medium ml-12">
//               Performance metrics & activity tracking
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={handleRefresh}
//               className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
//             >
//               <RefreshCw size={16} />
//             </button>
//             <button
//               onClick={handleExportExcel}
//               className="px-4 py-2.5 bg-white border border-slate-200 text-emerald-600 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-emerald-50 transition-all shadow-sm"
//             >
//               <DownloadCloud size={16} /> Excel
//             </button>
//             <button
//               onClick={handleExportPDF}
//               className="px-4 py-2.5 bg-white border border-slate-200 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-red-50 transition-all shadow-sm"
//             >
//               <DownloadCloud size={16} /> PDF
//             </button>
//           </div>
//         </div>

//         {/* KPI */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
//             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
//               <Layers size={24} />
//             </div>
//             <div>
//               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//                 Total Booking
//               </p>
//               <h4 className="text-2xl font-black text-slate-800">
//                 {totals?.total || 0}
//               </h4>
//             </div>
//           </div>

//           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
//             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//               <Calendar size={24} />
//             </div>
//             <div>
//               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//                 Today Requests
//               </p>
//               <h4 className="text-2xl font-black text-slate-800">
//                 {totals?.todayRequests || 0}
//               </h4>
//             </div>
//           </div>

//           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
//             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
//               <CheckCircle2 size={24} />
//             </div>
//             <div>
//               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//                 Completion
//               </p>
//               <h4 className="text-2xl font-black text-slate-800">
//                 {metrics.completionRate}%
//               </h4>
//             </div>
//           </div>

//           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
//             <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
//               <AlertCircle size={24} />
//             </div>
//             <div>
//               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//                 No Show
//               </p>
//               <h4 className="text-2xl font-black text-slate-800">
//                 {metrics.cancellationRate}%
//               </h4>
//             </div>
//           </div>

//           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
//             <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
//               <Clock size={24} />
//             </div>
//             <div>
//               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//                 Pending
//               </p>
//               <h4 className="text-2xl font-black text-slate-800">
//                 {metrics.pendingCount}
//               </h4>
//             </div>
//           </div>
//         </div>

//         {/* FILTERS */}
//         <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-2 items-stretch md:items-center shadow-sm">
//           <div className="flex items-center gap-2 px-4 py-2 text-slate-400 border-r border-slate-100 hidden md:flex">
//             <Filter size={16} />
//             <span className="text-xs font-bold uppercase tracking-wider">
//               Filters
//             </span>
//           </div>

//           <div className="relative flex-1">
//             <select
//               value={timeFilter}
//               onChange={(e) => setTimeFilter(e.target.value)}
//               className="w-full appearance-none bg-slate-50 border-none rounded-xl text-sm font-bold py-3 px-4 pr-10 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
//             >
//               <option value="ALL_TIME">All Time</option>
//               <option value="LAST_MONTH">Last Month</option>
//               <option value="LAST_YEAR">Last Year</option>
//             </select>
//             <ChevronDown
//               className="absolute right-3 top-3 text-slate-400 pointer-events-none"
//               size={18}
//             />
//           </div>

//           <div className="relative flex-1">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full appearance-none bg-slate-50 border-none rounded-xl text-sm font-bold py-3 px-4 pr-10 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
//             >
//               <option value="ALL">All Status</option>
//               <option value="PENDING">Pending</option>
//               <option value="APPROVED">Approved</option>
//               <option value="COMPLETED">Completed</option>
//               <option value="NO_SHOW">No Show</option>
//               <option value="REJECTED">Rejected</option>
//             </select>
//             <ChevronDown
//               className="absolute right-3 top-3 text-slate-400 pointer-events-none"
//               size={18}
//             />
//           </div>
//         </div>

//         {/* CHARTS */}
//         <div className="grid lg:grid-cols-5 gap-6">
//           <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
//             <h3 className="text-lg font-black tracking-tight mb-1 text-slate-800">
//               Status Distribution
//             </h3>
//             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
//               Share of volume
//             </p>

//             <div className="h-[280px] w-full relative">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     dataKey="value"
//                     innerRadius={65}
//                     outerRadius={100}
//                     paddingAngle={8}
//                     labelLine={false}
//                     label={renderCustomizedLabel}
//                   >
//                     {pieData.map((_, i) => (
//                       <Cell
//                         key={i}
//                         fill={COLORS[i % COLORS.length]}
//                         stroke="none"
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     contentStyle={{
//                       borderRadius: "16px",
//                       border: "none",
//                       boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
//                     }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>

//               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                 <span className="text-3xl font-black text-slate-800">
//                   {totals?.total || 0}
//                 </span>
//                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
//                   Total
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
//             <div className="flex justify-between items-start mb-8">
//               <div>
//                 <h3 className="text-lg font-black tracking-tight mb-1 text-slate-800">
//                   Weekly Activity Volume
//                 </h3>
//                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
//                   Appointments by Day
//                 </p>
//               </div>
//               <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
//                 <TrendingUp size={20} />
//               </div>
//             </div>

//             <div className="h-[250px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={weeklyVolumeData} margin={{ top: 20 }}>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     vertical={false}
//                     stroke="#f1f5f9"
//                   />
//                   <XAxis
//                     dataKey="name"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
//                     dy={10}
//                   />
//                   <YAxis
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fill: "#94a3b8", fontSize: 12 }}
//                     allowDecimals={false}
//                   />
//                   <Tooltip
//                     cursor={{ fill: "#f8fafc" }}
//                     contentStyle={{
//                       borderRadius: "16px",
//                       border: "none",
//                       boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
//                     }}
//                   />
//                   <Bar dataKey="appointments" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={40}>
//                     <LabelList
//                       dataKey="appointments"
//                       position="top"
//                       fill="#6366f1"
//                       fontSize={12}
//                       fontWeight={700}
//                     />
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* ADDED: NEW SERVICE PERFORMANCE ROW */}
//         <div className="grid lg:grid-cols-2 gap-6">
//           {/* Trend Line Chart */}
//           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
//             <h3 className="text-lg font-black tracking-tight mb-1 text-slate-800">Booking Velocity</h3>
//             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Service Demand Trend</p>
//             <div className="h-[250px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={serviceTrendData}>
//                   <defs>
//                     <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
//                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
//                   <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
//                   <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
//                   <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fill="url(#colorTrend)" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Most Used Services Bar Chart */}
//           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
//             <h3 className="text-lg font-black tracking-tight mb-1 text-slate-800">Most Used Services</h3>
//             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Top Performers</p>
//             <div className="h-[250px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={serviceDistributionData} layout="vertical" margin={{ left: 30 }}>
//                   <XAxis type="number" hide />
//                   <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11, fontWeight: 700 }} width={100} />
//                   <Tooltip cursor={{ fill: "#f8fafc" }} />
//                   <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} barSize={20}>
//                     <LabelList dataKey="count" position="right" style={{ fill: "#10b981", fontWeight: "bold", fontSize: 12 }} />
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* ACTIVITY TABLE */}
//         <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
//           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-slate-100">
//                 <Layers size={16} />
//               </div>
//               <h3 className="font-black text-slate-800 tracking-tight">
//                 Real-time Activity Log
//               </h3>
//             </div>
//             <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
//               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
//               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                 {filteredData.length} active records
//               </span>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest text-left">
//                   <th className="px-8 py-5">Customer Name</th>
//                   <th className="px-8 py-5">Service Category</th>
//                   <th className="px-8 py-5">Staff Member</th>
//                   <th className="px-8 py-5">Scheduled Date</th>
//                   <th className="px-8 py-5 text-center">Lifecycle Status</th>
//                   <th className="px-8 py-5 text-right">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-50">
//                 {filteredData.map((a) => (
//                   <tr
//                     key={a._id}
//                     className="group hover:bg-slate-50/80 transition-all cursor-default"
//                   >
//                     <td className="px-8 py-5">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
//                           {a.customerId?.fullName?.charAt(0) || "U"}
//                         </div>
//                         <span className="font-bold text-slate-700 group-hover:text-slate-900">
//                           {a.customerId?.fullName}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-8 py-5">
//                       <span className="text-sm font-medium text-slate-500 italic">
//                         "{a.serviceId?.name}"
//                       </span>
//                     </td>

//                     <td className="px-8 py-5">
//                       <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
//                         <User size={14} className="text-indigo-400" />
//                         {a.assignedUserId?.fullName || "—"}
//                       </div>
//                     </td>

//                     <td className="px-8 py-5">
//                       <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
//                         <CalendarDays size={14} className="text-slate-300" />
//                         {new Date(a.appointmentDate || a.createdAt).toLocaleDateString(
//                           undefined,
//                           { month: "short", day: "numeric", year: "numeric" },
//                         )}
//                       </div>
//                     </td>

//                     <td className="px-8 py-5">
//                       <div className="flex justify-center">
//                         <span
//                           className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-tight transition-all shadow-sm ${getStatusStyle(a.status)}`}
//                         >
//                           {a.status}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-8 py-5">
//                       <div className="flex justify-end">
//                         <button
//                           onClick={() => handleViewDetails(a)}
//                           className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
//                         >
//                           <Eye size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>

//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Activity,
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  DownloadCloud,
  Eye,
  Filter,
  Layers,
  RefreshCw,
  TrendingUp,
  User,
  X,
} from "lucide-react";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  AreaChart,
  Area,
} from "recharts";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { fetchAppointmentDashboard } from "../Redux/slices/cusomerSlice/appointmentDashboardSlice";

// Pie colors (Pending, Approved, Completed, No Show)
const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

/* =========================
   DATE HELPERS
========================= */
function toStartOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function toEndOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function inRange(date, start, end) {
  if (!date) return false;
  const d = new Date(date);
  return d >= start && d <= end;
}
function clampDateInput(v) {
  // v = "YYYY-MM-DD"
  if (!v) return null;
  const d = new Date(v + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}
function fmtDayMon(d) {
  // Thu-11
  const dt = new Date(d);
  const wd = dt.toLocaleDateString(undefined, { weekday: "short" });
  const day = dt.getDate();
  return `${wd}-${day}`;
}
function fmtMonthYear(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

/* =========================
   RANGE OPTIONS (Option B + Custom)
========================= */
const RANGE_OPTIONS = [
  { value: "TODAY", label: "Today" },
  { value: "LAST_7_DAYS", label: "Last 7 Days" },
  { value: "LAST_30_DAYS", label: "Last 30 Days" },
  { value: "LAST_90_DAYS", label: "Last 90 Days" },
  { value: "YTD", label: "Year to Date (YTD)" },
  { value: "ALL_TIME", label: "All Time" },
  { value: "CUSTOM", label: "Custom Range" },
];

function getRangeLabel(value) {
  return RANGE_OPTIONS.find((x) => x.value === value)?.label || "Activity";
}

/* =========================
   CHART COLOR (Low/Med/High)
========================= */
function volumeColor(count, max) {
  if (!max || max <= 0) return "#94a3b8";
  const p = count / max;
  if (p <= 0.33) return "#ef4444"; // low
  if (p <= 0.66) return "#f59e0b"; // mid
  return "#10b981"; // high
}

export default function AppointmentDashboard() {
  const dispatch = useDispatch();
  const { loading, totals, lastActivities } = useSelector(
    (state) => state.appointmentDashboard
  );

  // ✅ Today default
  const [timeFilter, setTimeFilter] = useState("TODAY");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Custom range state
  const [customStart, setCustomStart] = useState(""); // YYYY-MM-DD
  const [customEnd, setCustomEnd] = useState(""); // YYYY-MM-DD

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAppointmentDashboard());
  }, [dispatch]);

  const handleRefresh = () => dispatch(fetchAppointmentDashboard());

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const activities = useMemo(
    () => (Array.isArray(lastActivities) ? lastActivities : []),
    [lastActivities]
  );

  /* =========================
     1) Build current range
  ========================= */
  const currentRange = useMemo(() => {
    const now = new Date();

    let start = toStartOfDay(now);
    let end = toEndOfDay(now);

    if (timeFilter === "LAST_7_DAYS") {
      end = toEndOfDay(now);
      start = toStartOfDay(new Date(now));
      start.setDate(start.getDate() - 6);
    } else if (timeFilter === "LAST_30_DAYS") {
      end = toEndOfDay(now);
      start = toStartOfDay(new Date(now));
      start.setDate(start.getDate() - 29);
    } else if (timeFilter === "LAST_90_DAYS") {
      end = toEndOfDay(now);
      start = toStartOfDay(new Date(now));
      start.setDate(start.getDate() - 89);
    } else if (timeFilter === "YTD") {
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      end = toEndOfDay(now);
    } else if (timeFilter === "ALL_TIME") {
      return { start: null, end: null };
    } else if (timeFilter === "CUSTOM") {
      const s = clampDateInput(customStart);
      const e = clampDateInput(customEnd);

      if (s && e) {
        start = toStartOfDay(s);
        end = toEndOfDay(e);
      } else if (s && !e) {
        start = toStartOfDay(s);
        end = toEndOfDay(s);
      } else if (!s && e) {
        start = toStartOfDay(e);
        end = toEndOfDay(e);
      } else {
        // If not selected yet -> keep today
        start = toStartOfDay(now);
        end = toEndOfDay(now);
      }
    }

    return { start, end };
  }, [timeFilter, customStart, customEnd]);

  /* =========================
     2) Apply time range
  ========================= */
  const rangeActivities = useMemo(() => {
    if (!currentRange.start || !currentRange.end) return activities; // ALL_TIME
    return activities.filter((a) =>
      inRange(a.appointmentDate, currentRange.start, currentRange.end)
    );
  }, [activities, currentRange]);

  /* =========================
     3) Apply status filter
  ========================= */
  const filteredActivities = useMemo(() => {
    if (statusFilter === "ALL") return rangeActivities;
    return rangeActivities.filter(
      (a) => (a.status || "").toUpperCase() === statusFilter
    );
  }, [rangeActivities, statusFilter]);

  /* =========================
     4) Counts from filtered
  ========================= */
  const localCounts = useMemo(() => {
    const counts = {
      total: filteredActivities.length,
      pending: 0,
      approved: 0,
      completed: 0,
      rejected: 0,
      noShow: 0,
    };

    filteredActivities.forEach((a) => {
      const s = (a.status || "").toUpperCase();
      if (s === "PENDING") counts.pending++;
      else if (s === "APPROVED") counts.approved++;
      else if (s === "COMPLETED") counts.completed++;
      else if (s === "REJECTED") counts.rejected++;
      else if (s === "NO_SHOW") counts.noShow++;
    });

    return counts;
  }, [filteredActivities]);

  const metrics = useMemo(() => {
    const total = localCounts.total || 1;
    return {
      completionRate: Math.round(((localCounts.completed || 0) / total) * 100),
      noShowRate: Math.round(((localCounts.noShow || 0) / total) * 100),
    };
  }, [localCounts]);

  const pieData = useMemo(() => {
    const data = [
      { name: "Pending", value: localCounts.pending },
      { name: "Approved", value: localCounts.approved },
      { name: "Completed", value: localCounts.completed },
      { name: "No Show", value: localCounts.noShow },
    ];
    return data.filter((d) => d.value > 0);
  }, [localCounts]);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.01 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[11px] font-black"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  /* =========================
     5) ACTIVITY VOLUME CHART
     - Today: 1 bar (Thu-11)
     - Last 7/30/90: daily bars
     - YTD/All time: monthly bars (last 12 months view for All Time)
     - Custom: auto bucket
  ========================= */
  const activityVolume = useMemo(() => {
    const now = new Date();

    // day key map
    const dayKey = (d) => {
      const x = new Date(d);
      return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(
        x.getDate()
      ).padStart(2, "0")}`;
    };

    const countByDay = new Map();
    filteredActivities.forEach((a) => {
      if (!a.appointmentDate) return;
      const k = dayKey(a.appointmentDate);
      countByDay.set(k, (countByDay.get(k) || 0) + 1);
    });

    // TODAY
    if (timeFilter === "TODAY") {
      const k = dayKey(now);
      return [{ name: fmtDayMon(now), value: countByDay.get(k) || 0 }];
    }

    // Daily bars helper
    const buildLastNDays = (n) => {
      const out = [];
      const start = toStartOfDay(new Date(now));
      start.setDate(start.getDate() - (n - 1));

      for (let i = 0; i < n; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const label =
          n <= 10 ? fmtDayMon(d) : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        const k = dayKey(d);
        out.push({ name: label, value: countByDay.get(k) || 0 });
      }
      return out;
    };

    if (timeFilter === "LAST_7_DAYS") return buildLastNDays(7);
    if (timeFilter === "LAST_30_DAYS") return buildLastNDays(30);
    if (timeFilter === "LAST_90_DAYS") return buildLastNDays(90).slice(-30); // keep chart readable (last 30 labels)

    // Month grouping
    const monthKey = (d) => {
      const x = new Date(d);
      return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`;
    };

    const countByMonth = new Map();
    filteredActivities.forEach((a) => {
      if (!a.appointmentDate) return;
      const k = monthKey(a.appointmentDate);
      countByMonth.set(k, (countByMonth.get(k) || 0) + 1);
    });

    const buildLastNMonths = (n) => {
      const out = [];
      const start = new Date(now);
      start.setMonth(start.getMonth() - (n - 1));
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      for (let i = 0; i < n; i++) {
        const d = new Date(start);
        d.setMonth(start.getMonth() + i);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        out.push({ name: fmtMonthYear(d), value: countByMonth.get(k) || 0 });
      }
      return out;
    };

    if (timeFilter === "YTD") {
      // show months from Jan..current month
      const monthsSoFar = new Date(now.getFullYear(), now.getMonth() + 1, 0).getMonth() + 1;
      return buildLastNMonths(monthsSoFar);
    }

    if (timeFilter === "ALL_TIME") {
      // professional view: show last 12 months trend
      return buildLastNMonths(12);
    }

    if (timeFilter === "CUSTOM") {
      const s = currentRange.start;
      const e = currentRange.end;
      if (!s || !e) return buildLastNMonths(12);

      const diffDays = Math.ceil((e.getTime() - s.getTime()) / 86400000) + 1;

      // <= 45 days: daily
      if (diffDays <= 45) {
        const out = [];
        for (let i = 0; i < diffDays; i++) {
          const d = new Date(s);
          d.setDate(s.getDate() + i);
          const label = fmtDayMon(d);
          const k = dayKey(d);
          out.push({ name: label, value: countByDay.get(k) || 0 });
        }
        return out;
      }

      // else: monthly (last 12 points)
      const out = [];
      const cursor = new Date(s.getFullYear(), s.getMonth(), 1, 0, 0, 0, 0);
      const endMonth = new Date(e.getFullYear(), e.getMonth(), 1, 0, 0, 0, 0);

      while (cursor <= endMonth) {
        const k = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
        out.push({ name: fmtMonthYear(cursor), value: countByMonth.get(k) || 0 });
        cursor.setMonth(cursor.getMonth() + 1);
      }
      return out.slice(-12);
    }

    return [];
  }, [filteredActivities, timeFilter, currentRange]);

  const maxVolume = useMemo(() => {
    return activityVolume.reduce((m, x) => Math.max(m, x.value || 0), 0);
  }, [activityVolume]);

  /* =========================
     6) Service charts
  ========================= */
  const serviceDistributionData = useMemo(() => {
    const serviceMap = {};
    filteredActivities.forEach((app) => {
      const serviceName = app.serviceId?.name || "Miscellaneous";
      serviceMap[serviceName] = (serviceMap[serviceName] || 0) + 1;
    });
    return Object.entries(serviceMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredActivities]);

  const bookingTrendData = useMemo(() => {
    const dailyMap = {};
    filteredActivities.forEach((app) => {
      const raw = app.appointmentDate;
      if (!raw) return;
      const dt = new Date(raw);
      const key = dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      dailyMap[key] = (dailyMap[key] || 0) + 1;
    });

    const temp = Object.entries(dailyMap).map(([label, value]) => ({ date: label, value }));
    return temp.slice(-10);
  }, [filteredActivities]);

  /* =========================
     EXPORTS (filtered list)
  ========================= */
  const handleExportExcel = () => {
    const data = filteredActivities.map((a) => ({
      Customer: a.customerId?.fullName || "N/A",
      Service: a.serviceId?.name || "N/A",
      Staff: a.assignedUserId?.fullName || "—",
      Date: a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : "—",
      Status: a.status || "—",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Appointments");
    XLSX.writeFile(wb, `Dashboard_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Executive Appointment Report", 14, 15);

    autoTable(doc, {
      startY: 28,
      head: [["Customer", "Service", "Staff", "Date", "Status"]],
      body: filteredActivities.map((a) => [
        a.customerId?.fullName || "N/A",
        a.serviceId?.name || "N/A",
        a.assignedUserId?.fullName || "—",
        a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : "—",
        a.status || "—",
      ]),
    });

    doc.save("Appointments_Report.pdf");
  };

  const getStatusStyle = (status) => {
    switch ((status || "").toUpperCase()) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "APPROVED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "NO_SHOW":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "REJECTED":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <span className="text-slate-500 font-bold tracking-widest text-xs uppercase">
          Updating Dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen font-sans text-slate-900 relative">
      {/* MODAL */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">Appointment Details</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Customer
                </label>
                <p className="font-bold text-slate-700 text-lg">
                  {selectedAppointment.customerId?.fullName}
                </p>
                <p className="text-slate-500 text-sm">{selectedAppointment.customerId?.email}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Assigned Staff
                </label>
                <p className="font-bold text-indigo-600">
                  {selectedAppointment.assignedUserId?.fullName || "Not Assigned"}
                </p>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </label>
                  <div
                    className={`mt-1 inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getStatusStyle(
                      selectedAppointment.status
                    )}`}
                  >
                    {selectedAppointment.status}
                  </div>
                </div>

                <div className="text-right">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Date
                  </label>
                  <p className="font-bold text-slate-700">
                    {selectedAppointment.appointmentDate
                      ? new Date(selectedAppointment.appointmentDate).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200 text-white">
                <Activity size={20} />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">Executive Overview</h1>
            </div>
            <p className="text-slate-500 text-sm font-medium ml-12">
              Performance metrics & activity tracking
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleRefresh}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-white border border-slate-200 text-emerald-600 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-emerald-50 transition-all shadow-sm"
            >
              <DownloadCloud size={16} /> Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2.5 bg-white border border-slate-200 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-red-50 transition-all shadow-sm"
            >
              <DownloadCloud size={16} /> PDF
            </button>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Booking
              </p>
              <h4 className="text-2xl font-black text-slate-800">{localCounts.total}</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Today Requests
              </p>
              <h4 className="text-2xl font-black text-slate-800">
                {totals?.todayRequests || 0}
              </h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Completion
              </p>
              <h4 className="text-2xl font-black text-slate-800">{metrics.completionRate}%</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No Show</p>
              <h4 className="text-2xl font-black text-slate-800">{metrics.noShowRate}%</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</p>
              <h4 className="text-2xl font-black text-slate-800">{localCounts.pending}</h4>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-2 items-stretch md:items-center shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2 text-slate-400 border-r border-slate-100 hidden md:flex">
            <Filter size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
          </div>

          {/* Time range */}
          <div className="relative flex-1">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full appearance-none bg-slate-50 border-none rounded-xl text-sm font-bold py-3 px-4 pr-10 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              {RANGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-3 text-slate-400 pointer-events-none"
              size={18}
            />
          </div>

          {/* Custom range inputs */}
          {timeFilter === "CUSTOM" && (
            <div className="flex flex-col md:flex-row gap-2 flex-[1.2]">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full bg-slate-50 rounded-xl text-sm font-bold py-3 px-4 focus:ring-2 focus:ring-indigo-500 border border-slate-200"
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full bg-slate-50 rounded-xl text-sm font-bold py-3 px-4 focus:ring-2 focus:ring-indigo-500 border border-slate-200"
              />
            </div>
          )}

          {/* Status */}
          <div className="relative flex-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-slate-50 border-none rounded-xl text-sm font-bold py-3 px-4 pr-10 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="NO_SHOW">No Show</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-3 text-slate-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Status pie */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-black tracking-tight mb-1 text-slate-800">
              Status Distribution
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
              Share of volume (current filters)
            </p>

            <div className="h-[280px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={8}
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-800">{localCounts.total}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Total
                </span>
              </div>
            </div>
          </div>

          {/* Activity volume */}
          <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black tracking-tight mb-1 text-slate-800">
                  {getRangeLabel(timeFilter)} Activity Volume
                </h3>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
                    Low
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
                    Medium
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "#10b981" }} />
                    High
                  </div>
                </div>
              </div>

              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityVolume} margin={{ top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                    dy={10}
                    interval={timeFilter === "LAST_30_DAYS" || timeFilter === "LAST_90_DAYS" ? "preserveStartEnd" : 0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                    formatter={(v) => [`${v}`, "Appointments"]}
                    labelFormatter={(label) => label}
                  />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={32}>
                    {activityVolume.map((d, i) => (
                      <Cell key={i} fill={volumeColor(d.value, maxVolume)} />
                    ))}
                    <LabelList dataKey="value" position="top" fontSize={12} fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SERVICE PERFORMANCE */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black tracking-tight mb-1 text-slate-800">Booking Trend</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
              Trend (current filters)
            </p>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bookingTrendData}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#colorTrend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black tracking-tight mb-1 text-slate-800">Most Used Services</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
              Top 5 (current filters)
            </p>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceDistributionData} layout="vertical" margin={{ left: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#475569", fontSize: 11, fontWeight: 700 }}
                    width={120}
                  />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} barSize={20}>
                    <LabelList
                      dataKey="count"
                      position="right"
                      style={{ fill: "#10b981", fontWeight: "bold", fontSize: 12 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-slate-100">
                <Layers size={16} />
              </div>
              <h3 className="font-black text-slate-800 tracking-tight">Real-time Activity Log</h3>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {filteredActivities.length} records
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest text-left">
                  <th className="px-8 py-5">Customer Name</th>
                  <th className="px-8 py-5">Service Category</th>
                  <th className="px-8 py-5">Staff Member</th>
                  <th className="px-8 py-5">Scheduled Date</th>
                  <th className="px-8 py-5 text-center">Lifecycle Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredActivities.map((a) => (
                  <tr
                    key={a._id}
                    className="group hover:bg-slate-50/80 transition-all cursor-default"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {a.customerId?.fullName?.charAt(0) || "U"}
                        </div>
                        <span className="font-bold text-slate-700 group-hover:text-slate-900">
                          {a.customerId?.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-slate-500 italic">
                        "{a.serviceId?.name}"
                      </span>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                        <User size={14} className="text-indigo-400" />
                        {a.assignedUserId?.fullName || "—"}
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                        <CalendarDays size={14} className="text-slate-300" />
                        {a.appointmentDate
                          ? new Date(a.appointmentDate).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span
                          className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-tight transition-all shadow-sm ${getStatusStyle(
                            a.status
                          )}`}
                        >
                          {a.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleViewDetails(a)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredActivities.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-14 text-center text-slate-500 font-bold">
                      No records for current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}