

import { useEffect, useState } from "react";
import {
  X,
  Wrench,
  Settings,
  FileText,
  Users,
  Loader2,
  Check,
} from "lucide-react";

export default function ServiceModal({
  open,
  onClose,
  onSubmit,
  loading,
  initialData,
}) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    requiresDocuments: true,
    requiresIdentity: false,
    requiresPassport: false,
    approvalRequired: true,
    maxCustomersPerDay: 0,
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        // ✅ ensure code is uppercase when opening edit modal
        code: String(initialData.code || "").toUpperCase().trim(),
        description: initialData.description || "",
        requiresDocuments: initialData.requiresDocuments ?? true,
        requiresIdentity: initialData.requiresIdentity ?? false,
        requiresPassport: initialData.requiresPassport ?? false,
        approvalRequired: initialData.approvalRequired ?? true,
        maxCustomersPerDay: initialData.maxCustomersPerDay ?? 0,
        isActive: initialData.isActive ?? true,
      });
    } else {
      setForm({
        name: "",
        code: "",
        description: "",
        requiresDocuments: true,
        requiresIdentity: false,
        requiresPassport: false,
        approvalRequired: true,
        maxCustomersPerDay: 0,
        isActive: true,
      });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // ✅ Special: always uppercase service code (both typing & pasting)
    if (name === "code") {
      setForm((prev) => ({
        ...prev,
        code: String(value || "").toUpperCase().trim(),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "maxCustomersPerDay"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ final safety (always uppercase code before submit)
    onSubmit({
      ...form,
      code: String(form.code || "").toUpperCase().trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
        {/* HEADER */}
        <div className="px-10 pt-10 pb-6 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Wrench size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {initialData ? "Update Service" : "Register Service"}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                Service Catalog Config
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 text-slate-400 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* CORE INFO SECTION */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Service Name
                </label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Visa Processing"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Internal Code
                </label>
                <input
                  name="code"
                  required
                  placeholder="VP-001"
                  value={form.code}
                  onChange={handleChange}
                  // ✅ UI always looks uppercase
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-emerald-500 transition-all font-mono font-bold text-emerald-600 uppercase"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileText size={12} /> Brief Description
              </label>
              <textarea
                name="description"
                placeholder="Describe the service requirements and process..."
                value={form.description}
                onChange={handleChange}
                rows="1"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium text-slate-600 resize-none"
              />
            </div>
          </div>

          {/* CONFIGURATION GRID */}
          <div className="bg-slate-50/50 rounded-[2rem] p-5 border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 px-2">
              <Settings size={12} /> Service Parameters
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <ToggleOption
                label="Requires Identity"
                name="requiresIdentity"
                checked={form.requiresIdentity}
                onChange={handleChange}
              />
              <ToggleOption
                label="Requires Documents"
                name="requiresDocuments"
                checked={form.requiresDocuments}
                onChange={handleChange}
              />
              <ToggleOption
                label="Passport Required"
                name="requiresPassport"
                checked={form.requiresPassport}
                onChange={handleChange}
              />
              <ToggleOption
                label="Manual Approval"
                name="approvalRequired"
                checked={form.approvalRequired}
                onChange={handleChange}
              />
              <ToggleOption
                label="Status: Active"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* CAPACITY SECTION */}
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Users size={12} /> Daily Quota
              </label>
              <span className="text-[10px] font-bold text-emerald-500 italic">
                0 = No limit
              </span>
            </div>
            <input
              type="number"
              name="maxCustomersPerDay"
              min="0"
              value={form.maxCustomersPerDay}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-700"
            />
          </div>

          {/* FOOTER */}
          <div className="flex items-center gap-4 pt-3 border-t border-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-100 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-colors"
            >
              Discard
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-slate-900 hover:bg-black text-white px-4 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  {initialData ? "Save Changes" : "Register Service"}
                  <Check size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* SUB-COMPONENT FOR CLEANER TOGGLES */
function ToggleOption({ label, name, checked, onChange }) {
  return (
    <label className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white rounded-xl transition-all">
      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">
        {label}
      </span>
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
      </div>
    </label>
  );
}
