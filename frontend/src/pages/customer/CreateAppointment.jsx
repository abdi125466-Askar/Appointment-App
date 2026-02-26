import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  Search,
  User,
  Briefcase,
  FileCheck,
  StickyNote,
  Loader2,
  PlusCircle,
  AlertCircle,
} from "lucide-react";

import { fetchServices } from "../../Redux/slices/cusomerSlice/serviceSlice";
import {
  createAppointment,
  searchCustomers,
  clearCustomerSearch,
} from "../../Redux/slices/cusomerSlice/appointmentSlice";

export default function CreateAppointment() {
  const dispatch = useDispatch();

  const { list: services } = useSelector((state) => state.services);
  const { creating, customerSearchResults, customerSearching } = useSelector(
    (state) => state.appointments,
  );

  const [searchCustomer, setSearchCustomer] = useState("");
  const [showCustomerList, setShowCustomerList] = useState(false);

  const [form, setForm] = useState({
    customerId: "",
    serviceId: "",
    appointmentDate: "",
    documentsSubmitted: false,
    identityProvided: false,
    passportProvided: false,
    notes: "",
  });

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (searchCustomer.trim().length >= 2) {
      dispatch(searchCustomers(searchCustomer));
    } else {
      dispatch(clearCustomerSearch());
    }
  }, [searchCustomer, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerId || !form.serviceId || !form.appointmentDate) {
      return;
    }
    dispatch(createAppointment(form));
    setForm({
      customerId: "",
      serviceId: "",
      appointmentDate: "",
      documentsSubmitted: false,
      identityProvided: false,
      passportProvided: false,
      notes: "",
    });
    setSearchCustomer("");
    setShowCustomerList(false);
    dispatch(clearCustomerSearch());
  };

  // Helper to find selected service details
  const selectedService = services.find((s) => s._id === form.serviceId);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
          <PlusCircle size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Schedule Appointment
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Register a new booking in the system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: CLIENT & SERVICE */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* CUSTOMER SEARCH */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              <User size={14} className="text-blue-500" /> Client Selection
            </label>

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                type="text"
                placeholder="Name or phone..."
                value={searchCustomer}
                onChange={(e) => {
                  setSearchCustomer(e.target.value);
                  setShowCustomerList(true);
                }}
                onFocus={() => setShowCustomerList(true)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border text-slate-500 border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-sm"
              />

              {showCustomerList && searchCustomer.length >= 2 && (
                <div className="absolute z-30 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200 overflow-hidden max-h-60 overflow-y-auto">
                  {customerSearching ? (
                    <div className="p-4 flex items-center gap-3 text-sm text-slate-400 font-bold">
                      <Loader2 className="animate-spin" size={16} />{" "}
                      Searching...
                    </div>
                  ) : customerSearchResults.length === 0 ? (
                    <div className="p-4 text-sm text-slate-400 font-bold italic">
                      No records found
                    </div>
                  ) : (
                    customerSearchResults.map((c) => (
                      <div
                        key={c._id}
                        onClick={() => {
                          setForm({ ...form, customerId: c._id });
                          setSearchCustomer(c.fullName);
                          setShowCustomerList(false);
                        }}
                        className="p-4 border-b border-slate-50 hover:bg-blue-50 cursor-pointer transition-colors group"
                      >
                        <p className="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">
                          {c.fullName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-400 uppercase tracking-tight">
                          {c.phone}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SERVICE SELECTION */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              <Briefcase size={14} className="text-emerald-500" /> Service Type
            </label>
            <select
              value={form.serviceId}
              onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
            >
              <option value="">Choose a service...</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SECTION 2: DATE & TIME */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              <Calendar size={14} className="text-rose-500" /> Schedule
            </label>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Select the date and arrival time for this appointment.
            </p>
          </div>
          <div className="md:col-span-2">
            <input
              type="datetime-local"
              value={form.appointmentDate}
              onChange={(e) =>
                setForm({ ...form, appointmentDate: e.target.value })
              }
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-rose-500 transition-all font-bold text-slate-700"
            />
          </div>
        </div>

        {/* SECTION 3: CHECKLIST & NOTES */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
              <FileCheck size={14} className="text-amber-500" /> Compliance
              Checklist
            </label>

            <div className="space-y-3">
              <CheckToggle
                label="Documents Submitted"
                name="documentsSubmitted"
                checked={form.documentsSubmitted}
                onChange={(val) =>
                  setForm({ ...form, documentsSubmitted: val })
                }
              />
              <CheckToggle
                label="Identity Verified"
                name="identityProvided"
                checked={form.identityProvided}
                onChange={(val) => setForm({ ...form, identityProvided: val })}
              />
              <CheckToggle
                label="Passport Scanned"
                name="passportProvided"
                checked={form.passportProvided}
                onChange={(val) => setForm({ ...form, passportProvided: val })}
              />
            </div>

            {selectedService && (
              <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <AlertCircle size={16} className="text-amber-600 shrink-0" />
                <p className="text-[11px] font-bold text-amber-700 leading-tight">
                  Remember: {selectedService.name} requires{" "}
                  {selectedService.requiresDocuments
                    ? "Original Documents"
                    : "Basic Info"}
                  .
                </p>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              <StickyNote size={14} className="text-slate-400" /> Internal Notes
            </label>
            <textarea
              placeholder="Add any specific requirements or client requests here..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="flex-grow w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-600 resize-none text-sm"
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={creating || !form.customerId || !form.serviceId}
          className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
        >
          {creating ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Processing...
            </>
          ) : (
            "Finalize Appointment"
          )}
        </button>
      </form>
    </div>
  );
}

function CheckToggle({ label, checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-blue-100 transition-all cursor-pointer group"
    >
      <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700">
        {label}
      </span>
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          checked
            ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-100"
            : "border-slate-200 bg-white"
        }`}
      >
        {checked && (
          <div className="w-1.5 h-3 border-r-2 border-b-2 border-white rotate-45 mb-1" />
        )}
      </div>
    </div>
  );
}
