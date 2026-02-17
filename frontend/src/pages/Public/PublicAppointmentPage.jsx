import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  CheckCircle,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";

import {
  checkServiceAvailability,
  createPublicAppointment,
  clearAvailability,
} from "../../Redux/slices/PublicSlice/publicAppointmentSlice";

export default function PublicAppointmentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { availability, availabilityLoading, creating, bookingSuccess } =
    useSelector((state) => state.publicAppointment);

  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [file, setFile] = useState(null);
  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    email: "",
    gender: "",
  });

  const today = new Date().toISOString().split("T")[0];

  /* =====================================================
     ✅ READ SERVICE ONLY WHEN ON /book
  ===================================================== */
  useEffect(() => {
    if (location.pathname !== "/book") return;

    if (location.state?.selectedService) {
      setSelectedService(location.state.selectedService);
    } else {
      navigate("/services", { replace: true });
    }
  }, [location.pathname, location.state, navigate]);

  /* =====================================================
     HANDLERS
  ===================================================== */
  const handleDateChange = (e) => {
    const value = e.target.value;
    const day = new Date(value).getUTCDay();

    if (day === 5) {
      setDateError("Jimcaha lama shaqeeyo.");
      setDate("");
    } else {
      setDateError("");
      setDate(value);
      dispatch(clearAvailability());
    }
  };

  const handleCheckAvailability = () => {
    if (!date || !selectedService) return;
    dispatch(
      checkServiceAvailability({
        serviceId: selectedService._id,
        date,
      })
    );
  };

  const handleCreateAppointment = () => {
    const formData = new FormData();
    Object.entries(customer).forEach(([k, v]) =>
      formData.append(k, v)
    );
    formData.append("serviceId", selectedService._id);
    formData.append("appointmentDate", date);
    if (file) formData.append("file", file);

    dispatch(createPublicAppointment(formData));
  };

  /* =====================================================
     RENDER
  ===================================================== */
  if (location.pathname === "/book" && !selectedService) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 lg:p-12">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* TITLE */}
        <div>
          <h2 className="text-4xl font-black text-slate-900">
            {selectedService?.name}
          </h2>
          <p className="text-slate-500">
            Fadlan buuxi foomka diiwaangelinta
          </p>
        </div>

        {/* DATE */}
        <div className="bg-white rounded-3xl p-8 shadow border">
          <label className="text-xs font-black text-blue-600 uppercase mb-4 block">
            Dooro Taariikh
          </label>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Calendar className="absolute left-4 top-4 text-slate-400" />
              <input
                type="date"
                min={today}
                value={date}
                onChange={handleDateChange}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50"
              />
            </div>

            <button
              onClick={handleCheckAvailability}
              disabled={!date || availabilityLoading}
              className="bg-slate-900 text-white px-6 rounded-xl flex items-center gap-2"
            >
              {availabilityLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Hubi <ChevronRight />
                </>
              )}
            </button>
          </div>

          {dateError && (
            <p className="mt-3 text-red-600 font-semibold">
              {dateError}
            </p>
          )}

          {availability && (
            <div className="mt-4 bg-emerald-50 border p-4 rounded-xl">
              <p className="font-bold text-emerald-700">
                {availability.available
                  ? `${availability.remaining} boos bannaan`
                  : "Boos ma banaana"}
              </p>
            </div>
          )}
        </div>

        {/* DETAILS */}
        {availability?.available && (
          <div className="bg-white rounded-3xl p-8 shadow border space-y-6">
            <input
              placeholder="Magaca oo buuxa"
              className="w-full p-4 rounded-xl bg-slate-50"
              onChange={(e) =>
                setCustomer({ ...customer, fullName: e.target.value })
              }
            />

            <input
              placeholder="Telefoon"
              className="w-full p-4 rounded-xl bg-slate-50"
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />

            <input
              placeholder="Email"
              className="w-full p-4 rounded-xl bg-slate-50"
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
            />

            <select
              className="w-full p-4 rounded-xl bg-slate-50"
              onChange={(e) =>
                setCustomer({ ...customer, gender: e.target.value })
              }
            >
              <option value="">Jinsiga</option>
              <option value="MALE">Lab</option>
              <option value="FEMALE">Dheddig</option>
            </select>

            {!file ? (
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
            ) : (
              <div className="flex justify-between bg-blue-50 p-3 rounded-xl">
                <span>{file.name}</span>
                <button onClick={() => setFile(null)}>
                  <X />
                </button>
              </div>
            )}

            <button
              onClick={handleCreateAppointment}
              disabled={creating}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black"
            >
              {creating ? "Sug..." : "Xaqiiji Diiwaangelinta"}
            </button>
          </div>
        )}
      </div>

      {/* SUCCESS */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl text-center">
            <CheckCircle size={48} className="mx-auto text-green-600" />
            <p className="font-mono mt-4">
              {bookingSuccess.appointmentId}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

