import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  Wrench,
  Layers,
  Infinity as InfinityIcon,
  ShieldCheck,
  Edit3,
  Trash2,
  Loader2,
  MoreHorizontal, // Added for visual flair (optional)
} from "lucide-react";

import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../../Redux/slices/cusomerSlice/serviceSlice";

import ServiceModal from "./ServiceModal";

export default function Services() {
  const dispatch = useDispatch();
  const { list, loading, creating, updatingId, deletingId } = useSelector(
    (state) => state.services
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleSave = (data) => {
    const payload = {
      ...data,
      code: String(data.code || "").toUpperCase().trim(),
    };

    if (selectedService) {
      dispatch(updateService({ id: selectedService._id, data: payload }));
    } else {
      dispatch(createService(payload));
    }

    setOpenModal(false);
    setSelectedService(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      dispatch(deleteService(id));
    }
  };

  const filteredServices = useMemo(() => {
    const q = search.toLowerCase();

    return (list || [])
      .filter((s) => {
        const name = String(s.name || "").toLowerCase();
        const code = String(s.code || "").toLowerCase();
        return name.includes(q) || code.includes(q);
      })
      // ✅ SORT BY CODE (001,002,003...)
      .sort((a, b) =>
        String(a.code).localeCompare(String(b.code), undefined, {
          numeric: true,
        })
      );
  }, [search, list]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
          <Loader2 className="relative w-12 h-12 text-indigo-600 animate-spin" />
        </div>
        <p className="mt-6 text-sm font-medium text-gray-500 uppercase tracking-widest animate-pulse">
          Syncing Catalog...
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 tracking-wide uppercase">
              Management
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Layers className="text-indigo-600 w-8 h-8 md:w-10 md:h-10" />
            Service Catalog
          </h1>
          <p className="mt-2 text-gray-500 font-medium">
            Manage your service offerings and appointment capacities.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedService(null);
            setOpenModal(true);
          }}
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-xl shadow-gray-900/10 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300 focus:ring-4 focus:ring-gray-900/20"
        >
          <Plus size={18} className="group-hover:scale-110 transition-transform" />
          <span>New Service</span>
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          label="Total Services"
          value={(list || []).length}
          icon={<Layers size={22} />}
          trend="All active"
        />
        <StatCard
          label="Limited Capacity"
          value={(list || []).filter((s) => Number(s.maxCustomersPerDay) > 0).length}
          icon={<ShieldCheck size={22} />}
          accentColor="indigo"
        />
        <StatCard
          label="Unlimited Access"
          value={(list || []).filter((s) => Number(s.maxCustomersPerDay) === 0).length}
          icon={<InfinityIcon size={22} />}
          accentColor="emerald"
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-2 rounded-2xl border border-gray-200/60 shadow-sm">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium sm:text-sm"
            />
          </div>
          
          <div className="hidden sm:block text-xs font-semibold text-gray-400 px-4">
            Showing {filteredServices.length} results
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredServices.map((s) => (
            <div
              key={s._id}
              className="group relative bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600 shadow-sm group-hover:scale-105 transition-transform duration-300">
                     {s.name ? s.name.charAt(0).toUpperCase() : <Wrench size={20} />}
                  </div>
                  {/* Status Dot */}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                </div>

                <div className="px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 font-mono tracking-wider">
                    {String(s.code || "N/A")}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="flex-1 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {s.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {s.description || "No description provided for this service."}
                </p>
                
                {/* Meta info chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                   {Number(s.maxCustomersPerDay) > 0 ? (
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-[11px] font-bold border border-orange-100">
                       <ShieldCheck size={12} /> Cap: {s.maxCustomersPerDay}
                     </span>
                   ) : (
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                       <InfinityIcon size={12} /> Unlimited
                     </span>
                   )}
                </div>
              </div>

              {/* Card Footer / Actions */}
              <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-1">
                  <button
                    disabled={updatingId === s._id}
                    onClick={() => {
                      setSelectedService(s);
                      setOpenModal(true);
                    }}
                    className="h-9 px-3 rounded-lg bg-white text-gray-600 border border-gray-200 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center gap-2"
                  >
                    {updatingId === s._id ? <Loader2 className="animate-spin" size={14} /> : <Edit3 size={14} />}
                    Edit
                  </button>
                  
                  <button
                    disabled={deletingId === s._id}
                    onClick={() => handleDelete(s._id)}
                    className="h-9 w-9 flex items-center justify-center rounded-lg bg-white text-gray-400 border border-gray-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                  >
                    {deletingId === s._id ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredServices.length === 0 && (
             <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-gray-400">
                   <Search size={24} />
                </div>
                <h3 className="text-gray-900 font-bold text-lg">No services found</h3>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your search query.</p>
             </div>
          )}
        </div>
      </div>

      <ServiceModal
        open={openModal}
        initialData={selectedService}
        loading={creating || Boolean(updatingId)}
        onClose={() => {
          setOpenModal(false);
          setSelectedService(null);
        }}
        onSubmit={handleSave}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SUBCOMPONENTS                               */
/* -------------------------------------------------------------------------- */

function StatCard({ label, value, icon, accentColor = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-500/10",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-500/10",
    blue: "bg-blue-50 text-blue-600 ring-blue-500/10",
  };

  const activeColor = colors[accentColor] || colors.indigo;

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Decorative gradient blob */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 blur-2xl ${accentColor === 'emerald' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h4 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h4>
          </div>
        </div>
        <div className={`p-3 rounded-xl ring-1 ring-inset ${activeColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}