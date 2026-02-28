import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  UserPlus,
  RefreshCw,
  Edit,
  CheckCircle,
  Slash,
  Trash2,
  AlertCircle,
  X,
  UserCheck,
  Mail,
  Shield,
  Loader2 as LoaderIcon,
} from "lucide-react";
import {
  fetchUsers,
  updateUser,
  updateUserStatus,
  deleteUserPermanent,
  registerUser,
} from "../../Redux/slices/userSlices/userSlice";

export default function Users() {
  const dispatch = useDispatch();
  const { list, loading, registering } = useSelector((s) => s.users);

  const [params] = useSearchParams();
  const search = (params.get("search") || "").trim();

  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  // Form State
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "USER",
    status: "PENDING",
  });

  // ✅ NEW: Added Base URL and Avatar helper from Profile.jsx
  const API_BASE =
    import.meta?.env?.VITE_API_URL?.replace(/\/$/, "") ||
    "http://localhost:4000/api";

  const getAvatarUrl = (v) => {
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;
    return `${API_BASE.replace(/\/api$/, "")}${v}`;
  };

  // ✅ Fetch users whenever search changes
  useEffect(() => {
    dispatch(fetchUsers({ search }));
  }, [dispatch, search]);

  const statusBadge = useMemo(
    () => ({
      APPROVED: "text-emerald-700 bg-emerald-50 border-emerald-200 ring-emerald-100",
      PENDING: "text-amber-700 bg-amber-50 border-amber-200 ring-amber-100",
      REJECTED: "text-rose-700 bg-rose-50 border-rose-200 ring-rose-100",
      DISABLED: "text-slate-500 bg-slate-50 border-slate-200 ring-slate-100",
    }),
    []
  );

  const closeModals = () => {
    setShowRegister(false);
    setEditing(null);
    setConfirmDelete(null);
    setForm({
      fullName: "",
      email: "",
      password: "",
      role: "USER",
      status: "PENDING",
    });
  };

  const submitRegister = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
    closeModals();
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({
      fullName: u.fullName || "",
      email: u.email || "",
      role: u.role || "USER",
      status: u.status || "PENDING",
    });
  };

  const submitUpdate = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id: editing._id, data: form }));
    closeModals();
  };

  const handleDelete = () => {
    if (confirmDelete) {
      dispatch(deleteUserPermanent(confirmDelete._id));
      setConfirmDelete(null);
    }
  };

  const toggleApprove = (u) => {
    // Changed from PENDING to DISABLED so the user is actually frozen
    const next = u.status === "APPROVED" ? "DISABLED" : "APPROVED";
    dispatch(updateUserStatus({ id: u._id, status: next }));
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
          <LoaderIcon className="relative w-12 h-12 text-indigo-600 animate-spin" />
        </div>
        <p className="mt-6 text-sm font-medium text-gray-400 uppercase tracking-[0.2em] animate-pulse">
          Syncing User Data...
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm shadow-gray-200/50">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shadow-inner">
            <UserCheck size={28} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              Access Management
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Configure team roles, system permissions, and account status.
            </p>

            {search && (
              <p className="mt-2 text-xs font-bold text-indigo-600">
                Searching: <span className="text-gray-700">{search}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRegister(true)}
            className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-xl shadow-gray-900/10 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <UserPlus size={18} /> Register User
          </button>
          <button
            onClick={() => dispatch(fetchUsers({ search }))}
            className="p-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-all hover:rotate-180 duration-700"
            title="Refresh Users"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* USER CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.map((u) => {
          // ✅ NEW: Fetch the specific avatar url for this user
          const avatar = getAvatarUrl(u.avatarUrl);

          return (
            <div
              key={u._id}
              className="group relative bg-white border border-gray-200/60 rounded-[2.5rem] p-7 hover:shadow-2xl hover:shadow-indigo-100/40 hover:border-indigo-200 transition-all duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200">
                  <Shield size={10} className="text-gray-400" />
                  {u.role}
                </span>

                <span
                  className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${
                    statusBadge[u.status] || statusBadge.DISABLED
                  }`}
                >
                  {u.status}
                </span>
              </div>

              <div className="flex flex-col items-center text-center flex-1 mb-8">
                <div className="relative w-24 h-24 mb-4">
                  <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl blur-md group-hover:bg-indigo-500/10 transition-all"></div>
                  {/* ✅ NEW: Added overflow-hidden to contain the image, and replaced initial with image logic */}
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center font-bold text-3xl group-hover:scale-105 group-hover:from-indigo-600 group-hover:to-indigo-700 group-hover:text-white group-hover:border-indigo-500 transition-all duration-500 shadow-sm overflow-hidden">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={u.fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      u.fullName?.charAt(0).toUpperCase()
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  {u.fullName}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
                  <Mail size={14} className="text-gray-300 group-hover:text-indigo-400" />
                  {u.email}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 grid grid-cols-3 gap-2">
                <button
                  onClick={() => openEdit(u)}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  <Edit size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    Edit
                  </span>
                </button>

                <button
                  onClick={() => toggleApprove(u)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all ${
                    u.status === "APPROVED"
                      ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                      : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {u.status === "APPROVED" ? (
                    <>
                      <Slash size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">
                        Suspend
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">
                        Approve
                      </span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setConfirmDelete(u)}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <Trash2 size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    Delete
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FORM MODAL */}
      {(showRegister || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
            onClick={closeModals}
          />
          <form
            onSubmit={editing ? submitUpdate : submitRegister}
            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
          >
            <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {editing ? "Update User" : "Add Team Member"}
                </h3>
                <p className="text-gray-400 text-sm font-medium">
                  Please fill in the account details below.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModals}
                className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  placeholder="e.g. John Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium text-gray-900"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  placeholder="john@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium text-gray-900"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {!editing && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Initial Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium text-gray-900"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Role
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 outline-none font-bold text-gray-900 cursor-pointer focus:bg-white transition-all appearance-none"
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="STAFF">STAFF</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Status
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 outline-none font-bold text-gray-900 cursor-pointer focus:bg-white transition-all appearance-none"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    {/* Added DISABLED option to the form so you can manually select it */}
                    <option value="DISABLED">DISABLED</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-4">
              <button
                type="button"
                onClick={closeModals}
                className="px-6 py-3 font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={registering}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {editing
                  ? "Save Changes"
                  : registering
                  ? "Processing..."
                  : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE DIALOG */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-rose-100 shadow-inner">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              Delete Account?
            </h3>
            <p className="text-gray-500 text-sm font-medium mb-10 leading-relaxed">
              You are about to permanently remove{" "}
              <span className="text-gray-900 font-bold underline decoration-rose-200">
                {confirmDelete.fullName}
              </span>
              . This action is irreversible.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="w-full py-4 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all"
              >
                Delete Permanently
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="w-full py-4 rounded-2xl bg-gray-50 text-gray-500 font-bold hover:bg-gray-100 transition-all"
              >
                Keep Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}