import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  Calendar,
  Edit3,
  Trash2,
  Loader2,
  ChevronRight,
  TrendingUp,
  Filter,
} from "lucide-react";

import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomersWithStatus,
  clearCustomerSearch,
} from "../../Redux/slices/cusomerSlice/customerSlice";

import CustomerModal from "./CustomerModal";

export default function Customers() {
  const dispatch = useDispatch();
  const {
    list,
    loading,
    creating,
    updatingId,
    deletingId,
    searchResults,
    searching,
  } = useSelector((state) => state.customers);

  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (search.trim().length >= 2) {
      dispatch(searchCustomersWithStatus(search));
    } else {
      dispatch(clearCustomerSearch());
    }
  }, [search, dispatch]);

  const handleSave = (data) => {
    if (selectedCustomer) {
      dispatch(updateCustomer({ id: selectedCustomer._id, data }));
    } else {
      dispatch(createCustomer(data));
    }
    setOpenModal(false);
    setSelectedCustomer(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      dispatch(deleteCustomer(id));
    }
  };

  const stats = useMemo(
    () => ({
      total: list.length,
      male: list.filter((c) => c.gender === "MALE").length,
      female: list.filter((c) => c.gender === "FEMALE").length,
    }),
    [list]
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
          <Loader2 className="relative w-12 h-12 text-indigo-600 animate-spin" />
        </div>
        <p className="mt-6 text-sm font-medium text-gray-500 uppercase tracking-widest animate-pulse">
          Syncing Customer Database...
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 tracking-wide uppercase">
              CRM & Records
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="mt-2 text-gray-500 font-medium">
            Manage client records, history, and contact details.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCustomer(null);
            setOpenModal(true);
          }}
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-xl shadow-gray-900/10 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300 focus:ring-4 focus:ring-gray-900/20"
        >
          <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
          <span>Register Customer</span>
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <QuickStat
          label="Total Database"
          value={stats.total}
          trend="Total Records"
          color="blue"
        />
        <QuickStat
          label="Male Clients"
          value={stats.male}
          trend="Demographic"
          color="indigo"
        />
        <QuickStat
          label="Female Clients"
          value={stats.female}
          trend="Demographic"
          color="emerald"
        />
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* LEFT: CUSTOMER LIST (2/3) */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Users size={16} className="text-gray-400" />
              Active Directory
            </h3>
            <button className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm">
              <Filter size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                    Identity
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase text-gray-400 tracking-wider text-center">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase text-gray-400 tracking-wider text-right">
                    Manage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map((c) => (
                  <tr
                    key={c._id}
                    className="group hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 group-hover:from-indigo-500 group-hover:to-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all shadow-sm">
                          {c.fullName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {c.fullName}
                          </p>
                          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                            #{c._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                          <Phone size={12} className="text-gray-400" />
                          {c.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                          <Mail size={12} className="text-gray-400" />
                          {c.email || <span className="text-gray-300 italic">No email</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                          c.gender === "MALE"
                            ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}
                      >
                        {c.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedCustomer(c);
                            setOpenModal(true);
                          }}
                          className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {list.length === 0 && (
             <div className="p-12 text-center">
               <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                 <Users size={20} className="text-gray-400" />
               </div>
               <p className="text-sm text-gray-500">No customers registered yet.</p>
             </div>
          )}
        </div>

        {/* RIGHT: LOOKUP TOOL (1/3) */}
        <div className="sticky top-6 space-y-6">
          <div className="bg-slate-800 rounded-[2rem] p-8 shadow-xl shadow-gray-900/10 text-white relative overflow-hidden">
             {/* Decorative background circle */}
             <div className="absolute -top-24 -right-24 w-48 h-48 bg-gray-800 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
             
            <div className="relative z-10 mb-6">
              <h2 className="text-xl font-bold tracking-tight">
                Quick Lookup
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Check appointment status instantly by searching for a client.
              </p>
            </div>

            <div className="relative group mb-6 z-10">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"
                size={18}
              />
              <input
                placeholder="Search name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-800 border border-gray-700 rounded-xl outline-none focus:bg-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-3 relative z-10 min-h-[100px]">
              {searching && (
                <div className="flex items-center justify-center gap-2 text-indigo-300 font-medium text-xs animate-pulse py-4">
                  <Loader2 className="animate-spin" size={14} /> Fetching records...
                </div>
              )}

              {searchResults.map((r) => (
                <div
                  key={r._id}
                  className="p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-indigo-500/50 hover:shadow-lg transition-all cursor-default group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-bold text-white text-sm">
                      {r.fullName}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-700 rounded text-gray-300 border border-gray-600">
                      {r.appointmentStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-indigo-400" />
                      {r.appointmentDate
                        ? new Date(r.appointmentDate).toLocaleDateString()
                        : "No Date"}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      {r.serviceName || "Standard"}
                      <ChevronRight
                        size={12}
                        className="group-hover:translate-x-1 transition-transform text-indigo-400"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {search.length >= 2 && searchResults.length === 0 && !searching && (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500 opacity-60">
                  <Search size={24} className="mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest">No Matches</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CustomerModal
        open={openModal}
        initialData={selectedCustomer}
        loading={creating || Boolean(updatingId)}
        onClose={() => {
          setOpenModal(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleSave}
      />
    </div>
  );
}

/* HELPER COMPONENT */
function QuickStat({ label, value, trend, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
  };
  
  const activeClass = colors[color] || colors.blue;

  return (
    <div className="bg-white border border-gray-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </p>
        <div className="flex items-center gap-1 mt-2 text-gray-400">
          <TrendingUp size={12} />
          <span className="text-[10px] font-semibold uppercase">{trend}</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${activeClass}`}>
        <Users size={20} />
      </div>
    </div>
  );
}