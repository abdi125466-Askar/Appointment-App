import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  DownloadCloud,
  Filter,
  Activity,
  Eye,
  X,
  Layers,
  RefreshCw,
  ChevronDown,
  CalendarDays,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  User,
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
  /* ADDED NEW COMPONENTS BELOW */
  AreaChart,
  Area,
  Line,
} from "recharts";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { fetchAppointmentDashboard } from "../Redux/slices/cusomerSlice/appointmentDashboardSlice";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444"]; // Pending, Approved, Completed, NoShow

export default function AppointmentDashboard() {
  const dispatch = useDispatch();

  const { loading, totals, byStatus, lastActivities } = useSelector(
    (state) => state.appointmentDashboard,
  );

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL_TIME");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAppointmentDashboard());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAppointmentDashboard());
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  /* ===== CALCULATED METRICS ===== */
  const metrics = useMemo(() => {
    const total = totals?.total || 1;
    const completed = byStatus?.completed || 0;
    const noShow = byStatus?.noShow || 0;
    const pending = byStatus?.pending || 0;

    return {
      completionRate: Math.round((completed / total) * 100),
      cancellationRate: Math.round((noShow / total) * 100),
      pendingCount: pending,
    };
  }, [totals, byStatus]);

  /* ===== FILTER LOGIC ===== */
  const filteredData = useMemo(() => {
    let data = Array.isArray(lastActivities) ? [...lastActivities] : [];
    const now = new Date();

    if (timeFilter === "LAST_MONTH") {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      data = data.filter((a) => new Date(a.appointmentDate || a.createdAt) >= lastMonth);
    }

    if (timeFilter === "LAST_YEAR") {
      const lastYear = new Date();
      lastYear.setFullYear(now.getFullYear() - 1);
      data = data.filter((a) => new Date(a.appointmentDate || a.createdAt) >= lastYear);
    }

    if (statusFilter !== "ALL") {
      data = data.filter((a) => a.status?.toUpperCase() === statusFilter);
    }

    return data;
  }, [lastActivities, statusFilter, timeFilter]);

  /* ===== CHART DATA ===== */
  const pieData = useMemo(() => {
    const data = [
      { name: "Pending", value: byStatus?.pending || 0 },
      { name: "Approved", value: byStatus?.approved || 0 },
      { name: "Completed", value: byStatus?.completed || 0 },
      { name: "No Show", value: byStatus?.noShow || 0 },
    ];
    return data.filter((d) => d.value > 0);
  }, [byStatus]);

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

  const weeklyVolumeData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const activities = Array.isArray(lastActivities) ? lastActivities : [];

    activities.forEach((app) => {
      const raw = app.appointmentDate || app.createdAt;
      if (raw) {
        const date = new Date(raw);
        counts[date.getDay()] += 1;
      }
    });

    return days.map((day, index) => ({
      name: day,
      appointments: counts[index],
    }));
  }, [lastActivities]);

  /* ===== ADDED: SERVICE PERFORMANCE LOGIC ===== */
  const serviceDistributionData = useMemo(() => {
    const activities = Array.isArray(lastActivities) ? lastActivities : [];
    const serviceMap = {};
    activities.forEach((app) => {
      const serviceName = app.serviceId?.name || "Miscellaneous";
      serviceMap[serviceName] = (serviceMap[serviceName] || 0) + 1;
    });
    return Object.entries(serviceMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); 
  }, [lastActivities]);

  const serviceTrendData = useMemo(() => {
    const activities = Array.isArray(lastActivities) ? lastActivities : [];
    const dailyMap = {};
    activities.forEach((app) => {
      const raw = app.appointmentDate || app.createdAt;
      if (raw) {
        const dateKey = new Date(raw).toLocaleDateString(undefined, { month: "short", day: "numeric" });
        dailyMap[dateKey] = (dailyMap[dateKey] || 0) + 1;
      }
    });
    return Object.entries(dailyMap)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);
  }, [lastActivities]);

  /* ===== EXPORTS ===== */
  const handleExportExcel = () => {
    const data = filteredData.map((a) => ({
      Customer: a.customerId?.fullName || "N/A",
      Service: a.serviceId?.name || "N/A",
      Staff: a.assignedUserId?.fullName || "—",
      Date: new Date(a.appointmentDate || a.createdAt).toLocaleDateString(),
      Status: a.status,
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
      body: filteredData.map((a) => [
        a.customerId?.fullName || "N/A",
        a.serviceId?.name || "N/A",
        a.assignedUserId?.fullName || "—",
        new Date(a.appointmentDate || a.createdAt).toLocaleDateString(),
        a.status,
      ]),
    });
    doc.save(`Appointments_Report.pdf`);
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
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
              <h3 className="text-lg font-black text-slate-800">
                Appointment Details
              </h3>
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
                <p className="text-slate-500 text-sm">
                  {selectedAppointment.customerId?.email}
                </p>
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
                    className={`mt-1 inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getStatusStyle(selectedAppointment.status)}`}
                  >
                    {selectedAppointment.status}
                  </div>
                </div>
                <div className="text-right">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Date
                  </label>
                  <p className="font-bold text-slate-700">
                    {new Date(selectedAppointment.appointmentDate || selectedAppointment.createdAt).toLocaleDateString()}
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
              <h1 className="text-2xl font-extrabold tracking-tight">
                Executive Overview
              </h1>
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
              <h4 className="text-2xl font-black text-slate-800">
                {totals?.total || 0}
              </h4>
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
              <h4 className="text-2xl font-black text-slate-800">
                {metrics.completionRate}%
              </h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                No Show
              </p>
              <h4 className="text-2xl font-black text-slate-800">
                {metrics.cancellationRate}%
              </h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pending
              </p>
              <h4 className="text-2xl font-black text-slate-800">
                {metrics.pendingCount}
              </h4>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-2 items-stretch md:items-center shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2 text-slate-400 border-r border-slate-100 hidden md:flex">
            <Filter size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Filters
            </span>
          </div>

          <div className="relative flex-1">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full appearance-none bg-slate-50 border-none rounded-xl text-sm font-bold py-3 px-4 pr-10 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="ALL_TIME">All Time</option>
              <option value="LAST_MONTH">Last Month</option>
              <option value="LAST_YEAR">Last Year</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-3 text-slate-400 pointer-events-none"
              size={18}
            />
          </div>

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
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-black tracking-tight mb-1 text-slate-800">
              Status Distribution
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
              Share of volume
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
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                        stroke="none"
                      />
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
                <span className="text-3xl font-black text-slate-800">
                  {totals?.total || 0}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Total
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-black tracking-tight mb-1 text-slate-800">
                  Weekly Activity Volume
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Appointments by Day
                </p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVolumeData} margin={{ top: 20 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                    dy={10}
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
                  />
                  <Bar dataKey="appointments" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={40}>
                    <LabelList
                      dataKey="appointments"
                      position="top"
                      fill="#6366f1"
                      fontSize={12}
                      fontWeight={700}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ADDED: NEW SERVICE PERFORMANCE ROW */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Trend Line Chart */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black tracking-tight mb-1 text-slate-800">Booking Velocity</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Service Demand Trend</p>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={serviceTrendData}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fill="url(#colorTrend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Most Used Services Bar Chart */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black tracking-tight mb-1 text-slate-800">Most Used Services</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Top Performers</p>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceDistributionData} layout="vertical" margin={{ left: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11, fontWeight: 700 }} width={100} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} barSize={20}>
                    <LabelList dataKey="count" position="right" style={{ fill: "#10b981", fontWeight: "bold", fontSize: 12 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ACTIVITY TABLE */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-slate-100">
                <Layers size={16} />
              </div>
              <h3 className="font-black text-slate-800 tracking-tight">
                Real-time Activity Log
              </h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {filteredData.length} active records
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
                {filteredData.map((a) => (
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
                        {new Date(a.appointmentDate || a.createdAt).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span
                          className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-tight transition-all shadow-sm ${getStatusStyle(a.status)}`}
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
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}