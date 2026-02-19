import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, Info, Upload, XCircle } from "lucide-react";
import api from "../../utils/axios";

export default function PublicAppointmentPage() {
  const [params] = useSearchParams();
  const serviceIdFromUrl = params.get("serviceId") || "";

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesErr, setServicesErr] = useState("");

  const [selectedServiceId, setSelectedServiceId] = useState(serviceIdFromUrl);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Male");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [file, setFile] = useState(null);

  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState(null); // {available, message, remaining...}
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // success or error

  // ✅ Load services for dropdown
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setServicesLoading(true);
        setServicesErr("");

        // ✅ IMPORTANT:
        // haddii axios baseURL = http://localhost:4000/api
        // route-ka server = app.use("/api/public", publicRoutes)
        // markaa endpoint waa: GET /api/public/services
        // laakiin axios baseURL already /api -> wac: /public/services
        const res = await api.get("/public/services");
        const list = res.data?.data || [];

        if (!mounted) return;

        setServices(list);

        // ✅ haddii URL ku jiro serviceId oo sax ah -> select it
        const urlId = serviceIdFromUrl;
        const exists = urlId && list.some((s) => s._id === urlId);

        if (exists) {
          setSelectedServiceId(urlId);
        } else if (!selectedServiceId && list[0]?._id) {
          // ✅ haddii waxba la dooran -> default first service
          setSelectedServiceId(list[0]._id);
        }
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setServicesErr(
          e?.response?.data?.message ||
            "Failed to load services. Hubi backend-ka & route-ka (/api/public/services)."
        );
      } finally {
        if (mounted) setServicesLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ haddii user uu URL-ka beddelo (/book?serviceId=...)
  useEffect(() => {
    if (serviceIdFromUrl) setSelectedServiceId(serviceIdFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceIdFromUrl]);

  // reset availability when inputs change
  useEffect(() => {
    setAvailability(null);
    setResult(null);
  }, [selectedServiceId, appointmentDate]);

  const canCheck = useMemo(
    () => !!selectedServiceId && !!appointmentDate,
    [selectedServiceId, appointmentDate]
  );

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length >= 3 &&
      phone.trim().length >= 6 &&
      !!selectedServiceId &&
      !!appointmentDate &&
      availability?.available === true &&
      !submitting
    );
  }, [
    fullName,
    phone,
    selectedServiceId,
    appointmentDate,
    availability,
    submitting,
  ]);

  const checkAvailability = async () => {
    if (!canCheck) return;

    try {
      setChecking(true);
      setAvailability(null);
      setResult(null);

      // ✅ Backend route: GET /api/public/services/:serviceId/availability?date=YYYY-MM-DD
      // axios baseURL = /api -> so: /public/services/:id/availability
      const res = await api.get(
        `/public/services/${selectedServiceId}/availability`,
        { params: { date: appointmentDate } }
      );

      setAvailability(res.data?.data || null);
    } catch (e) {
      console.error(e);
      setAvailability(null);
      setResult({
        type: "error",
        message:
          e?.response?.data?.message ||
          "Failed to check availability. Hubi backend-ka.",
      });
    } finally {
      setChecking(false);
    }
  };

  const submit = async () => {
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setResult(null);

      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("phone", phone.trim());
      formData.append("email", email.trim());
      formData.append("gender", gender);
      formData.append("serviceId", selectedServiceId);
      formData.append("appointmentDate", appointmentDate);
      if (file) formData.append("file", file);

      // ✅ Backend route: POST /api/public/appointments
      // axios baseURL = /api -> so: /public/appointments
      const res = await api.post("/public/appointments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data?.data;
      setResult({
        type: "success",
        message: res.data?.message || "Appointment created ✅",
        appointmentId: data?.appointmentId,
        status: data?.status,
        serviceName: data?.service?.name,
        date: data?.appointmentDate,
      });
    } catch (e) {
      console.error(e);
      setResult({
        type: "error",
        message:
          e?.response?.data?.message ||
          "Failed to create appointment. Hubi uploads path + backend validations.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative flex-1 w-full overflow-hidden flex items-center">
      <div className="absolute inset-0 pointer-events-none bg-white/25" />

      <div className="relative mx-auto max-w-5xl w-full px-4 md:px-8 py-10">
        <div className="rounded-[28px] bg-white/70 border border-white/70 backdrop-blur-xl shadow-2xl shadow-slate-900/15 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-500" />

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                  Booking Form
                </h1>
                <p className="mt-2 text-slate-700 font-semibold">
                  Buuxi xogta → Check Availability → Submit.
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  to="/services"
                  className="px-4 py-2 rounded-xl font-black bg-white/70 border border-slate-200/70 text-slate-900 hover:bg-white transition"
                >
                  Back to Services
                </Link>
                <Link
                  to="/track"
                  className="px-4 py-2 rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 transition"
                >
                  Track
                </Link>
              </div>
            </div>

            {/* ✅ services load / error */}
            {servicesLoading && (
              <div className="mt-5 rounded-2xl border border-slate-200/70 bg-white/70 p-4 font-semibold text-slate-700">
                Loading services...
              </div>
            )}

            {servicesErr && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
                {servicesErr}
              </div>
            )}

            {/* Form grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name">
                <input
                  className="w-full rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-sky-400/20"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                />
              </Field>

              <Field label="Service">
                <select
                  className="w-full rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-emerald-400/20"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  disabled={servicesLoading || services.length === 0}
                >
                  <option value="" disabled>
                    {servicesLoading ? "Loading..." : "Select service..."}
                  </option>

                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {/* haddii serviceId URL-ku khaldan yahay */}
                {!!serviceIdFromUrl &&
                  !servicesLoading &&
                  services.length > 0 &&
                  !services.some((s) => s._id === serviceIdFromUrl) && (
                    <p className="mt-2 text-xs font-semibold text-amber-700">
                      serviceId-ka URL-ka ku jira lama helin. Fadlan dooro service
                      kale.
                    </p>
                  )}
              </Field>

              <Field label="Phone">
                <input
                  className="w-full rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-sky-400/20"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+252..."
                />
              </Field>

              <Field label="Email (optional)">
                <input
                  className="w-full rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-sky-400/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </Field>

              <Field label="Gender">
                <select
                  className="w-full rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-emerald-400/20"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </Field>

              <Field label="Appointment Date">
                <div className="relative">
                  <CalendarDays
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200/70 bg-white/80 pl-10 pr-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-indigo-400/20"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </div>
              </Field>

              <div className="md:col-span-2">
                <label className="block text-sm font-black text-slate-900 mb-2">
                  Upload Supporting Document (optional)
                </label>
                <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 flex items-center justify-between gap-3 flex-col sm:flex-row">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Upload size={18} />
                    <span>{file ? file.name : "No file chosen"}</span>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Availability row */}
            <div className="mt-6 flex flex-col md:flex-row gap-3 items-start md:items-center">
              <button
                onClick={checkAvailability}
                disabled={!canCheck || checking || servicesLoading}
                className={`px-5 py-3 rounded-2xl font-black text-white transition ${
                  !canCheck || checking || servicesLoading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-500 hover:brightness-110"
                }`}
              >
                {checking ? "Checking..." : "Check Availability"}
              </button>

              <button
                onClick={submit}
                disabled={!canSubmit || servicesLoading}
                className={`px-6 py-3 rounded-2xl font-black text-white transition ${
                  !canSubmit || servicesLoading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110"
                }`}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>

            {/* Messages */}
            <div className="mt-4 space-y-3">
              {availability && (
                <div
                  className={`rounded-2xl border p-4 font-semibold flex gap-2 items-start ${
                    availability.available
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {availability.available ? (
                    <CheckCircle2 size={18} className="mt-0.5" />
                  ) : (
                    <XCircle size={18} className="mt-0.5" />
                  )}
                  <div>
                    <div className="font-black">
                      {availability.available ? "Available ✅" : "Fully booked ❌"}
                    </div>
                    <div className="text-sm">
                      {availability.message ||
                        (availability.available
                          ? "Your selected date is available."
                          : "This date is fully booked.")}
                    </div>
                    {typeof availability.remaining === "number" && (
                      <div className="text-sm mt-1">
                        Remaining:{" "}
                        <span className="font-black">{availability.remaining}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result && (
                <div
                  className={`rounded-2xl border p-4 font-semibold flex gap-2 items-start ${
                    result.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  <Info size={18} className="mt-0.5" />
                  <div>
                    <div className="font-black">{result.message}</div>

                    {result.type === "success" && result.appointmentId && (
                      <div className="text-sm mt-1">
                        Tracking ID (Appointment ID):{" "}
                        <span className="font-black">{result.appointmentId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-black text-slate-900 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
