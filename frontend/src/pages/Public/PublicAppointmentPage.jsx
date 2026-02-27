import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Copy,
  Info,
  Upload,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActiveServices,
  checkServiceAvailability,
  createPublicAppointment,
  clearAvailability,
  clearBookingSuccess,
  clearPublicError,
} from "../../Redux/slices/PublicSlice/publicAppointmentSlice";

const TRACKING_KEY = "appointify_tracking_id";

/**
 * ✅ slugify: u rogo "Birth Certificate Application" -> "birth_certificate_application"
 */
const slugify = (str = "") =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export default function PublicAppointmentPage() {
  const dispatch = useDispatch();
  const [params] = useSearchParams();

  // ✅ URL styles:
  // /book?service=birth_certificate (slug)
  // /book?serviceId=MongoObjectId (id)
  const serviceIdFromUrl = params.get("serviceId") || "";
  const serviceSlugFromUrl = params.get("service") || "";

  const {
    services,
    servicesLoading,
    availability,
    availabilityLoading,
    creating,
    error,
  } = useSelector((s) => s.publicAppointment);

  const [selectedServiceId, setSelectedServiceId] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Male");
  const [appointmentDate, setAppointmentDate] = useState(""); // YYYY-MM-DD
  const [file, setFile] = useState(null);

  const [localResult, setLocalResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // ✅ date error (past date)
  const [dateError, setDateError] = useState("");

  // ✅ today string for min date (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const isPastDate = useMemo(() => {
    if (!appointmentDate) return false;
    return appointmentDate < todayStr; // works for YYYY-MM-DD format
  }, [appointmentDate, todayStr]);

  // Load services
  useEffect(() => {
    dispatch(fetchActiveServices());
  }, [dispatch]);

  /**
   * ✅ Pick default service after services loaded:
   * 1) serviceId from URL
   * 2) service slug from URL (try multiple matching styles)
   * 3) fallback first service
   */
  useEffect(() => {
    if (servicesLoading) return;
    if (!Array.isArray(services) || services.length === 0) return;

    // 1) by id
    const byId =
      serviceIdFromUrl &&
      services.find((s) => String(s._id) === String(serviceIdFromUrl));
    if (byId) {
      setSelectedServiceId(byId._id);
      return;
    }

    // 2) by slug:
    // - match against slugified service.name
    // - also match against service.code (like BC-001, ID-001, PP-001) by friendly mapping
    // - also allow URL slug like "passport" / "national_id" / "birth_certificate"
    const urlSlug = slugify(serviceSlugFromUrl);

    const byNameSlug =
      serviceSlugFromUrl &&
      services.find((s) => slugify(s.name) === urlSlug);

    if (byNameSlug) {
      setSelectedServiceId(byNameSlug._id);
      return;
    }

    // OPTIONAL: map short slugs -> service code (if you use these in URL)
    const slugToCode = {
      passport: "PP-001",
      national_id: "ID-001",
      birth_certificate: "BC-001",
    };

    const maybeCode = slugToCode[urlSlug];
    const byCode =
      maybeCode && services.find((s) => String(s.code).toUpperCase() === maybeCode);

    if (byCode) {
      setSelectedServiceId(byCode._id);
      return;
    }

    // 3) fallback
    setSelectedServiceId((prev) => prev || services[0]._id);
  }, [servicesLoading, services, serviceIdFromUrl, serviceSlugFromUrl]);

  // reset messages on change
  useEffect(() => {
    dispatch(clearAvailability());
    dispatch(clearBookingSuccess());
    dispatch(clearPublicError());
    setLocalResult(null);
    setCopied(false);
  }, [dispatch, selectedServiceId, appointmentDate]);

  const canCheck = useMemo(
    () => !!selectedServiceId && !!appointmentDate && !isPastDate,
    [selectedServiceId, appointmentDate, isPastDate]
  );

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length >= 3 &&
      phone.trim().length >= 6 &&
      !!selectedServiceId &&
      !!appointmentDate &&
      !isPastDate &&
      availability?.available === true &&
      !creating
    );
  }, [fullName, phone, selectedServiceId, appointmentDate, availability, creating, isPastDate]);

  const onCheckAvailability = () => {
    if (!selectedServiceId || !appointmentDate) return;

    if (isPastDate) {
      setDateError("Taariikh hore lama ogola. Doorso maanta ama kadib.");
      return;
    }

    setDateError("");
    dispatch(checkServiceAvailability({ serviceId: selectedServiceId, date: appointmentDate }));
  };

  const onSubmit = async () => {
    if (!canSubmit) return;

    if (isPastDate) {
      setDateError("Taariikh hore lama ogola. Doorso maanta ama kadib.");
      return;
    }

    setDateError("");

    const formData = new FormData();
    formData.append("fullName", fullName.trim());
    formData.append("phone", phone.trim());
    if (email?.trim()) formData.append("email", email.trim());
    formData.append("gender", gender);
    formData.append("serviceId", selectedServiceId);
    formData.append("appointmentDate", appointmentDate);

    // ✅ multer field mismatch safe
    // if (file) {
    //   formData.append("file", file);
    //   formData.append("document", file);
    // }
    if (file) {
  formData.append("file", file);   // ✅ ONLY THIS
}

    const resAction = await dispatch(createPublicAppointment(formData));

    if (createPublicAppointment.fulfilled.match(resAction)) {
      const payload = resAction.payload;
      const d = payload?.data ? payload.data : payload;

      const trackingId = d?.trackingId || d?.appointmentId || d?._id;

      // ✅ OPTION 1: Save silently (Track page auto-fill)
      if (trackingId) localStorage.setItem(TRACKING_KEY, String(trackingId));

      setLocalResult({
        type: "success",
        message: "Appointment created ✅",
        trackingId,
        status: d?.status,
        serviceName: d?.service?.name,
        date: d?.appointmentDate,
      });
    }
  };

  const handleCopy = async () => {
    if (!localResult?.trackingId) return;
    try {
      await navigator.clipboard.writeText(String(localResult.trackingId));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // do nothing
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
                  Enter your details. → Check Availability → Submit.
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

            {servicesLoading && (
              <div className="mt-5 rounded-2xl border border-slate-200/70 bg-white/70 p-4 font-semibold text-slate-700">
                Loading services...
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name">
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-3 font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-sky-400/20"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                />
              </Field>

              <Field label="Service">
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-3 font-semibold text-slate-900 outline-none focus:ring-4 focus:ring-emerald-400/20"
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

                {!!serviceSlugFromUrl &&
                  !servicesLoading &&
                  services.length > 0 &&
                  !services.some(
                    (s) =>
                      slugify(s.name) === slugify(serviceSlugFromUrl) ||
                      String(s.code).toUpperCase() ===
                        ({
                          passport: "PP-001",
                          national_id: "ID-001",
                          birth_certificate: "BC-001",
                        }[slugify(serviceSlugFromUrl)] || "")
                  ) && (
                    <p className="mt-2 text-xs font-semibold text-amber-700">
                      service-ka URL-ka ({serviceSlugFromUrl}) lama helin. Fadlan dooro service kale.
                    </p>
                  )}

                {!!serviceIdFromUrl &&
                  !servicesLoading &&
                  services.length > 0 &&
                  !services.some((s) => String(s._id) === String(serviceIdFromUrl)) && (
                    <p className="mt-2 text-xs font-semibold text-amber-700">
                      serviceId-ka URL-ka ku jira lama helin. Fadlan dooro service kale.
                    </p>
                  )}
              </Field>

              <Field label="Phone">
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-3 font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-sky-400/20"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+252..."
                />
              </Field>

              <Field label="Email (optional)">
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-3 font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-sky-400/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </Field>

              <Field label="Gender">
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-3 font-semibold text-slate-900 outline-none focus:ring-4 focus:ring-emerald-400/20"
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                    size={18}
                  />
                  <input
                    type="date"
                    min={todayStr}
                    className="w-full rounded-xl border border-slate-300 bg-white/95 pl-10 pr-4 py-3 font-semibold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-400/20"
                    value={appointmentDate}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v && v < todayStr) {
                        setDateError("Ma dooran kartid taariikh hore. Fadlan dooro maanta ama kadib.");
                        setAppointmentDate("");
                        return;
                      }
                      setDateError("");
                      setAppointmentDate(v);
                    }}
                  />
                </div>

                {dateError && (
                  <p className="mt-2 text-xs font-semibold text-red-700">
                    {dateError}
                  </p>
                )}
              </Field>

              <div className="md:col-span-2">
                <label className="block text-sm font-black text-slate-900 mb-2">
                  Upload Supporting Document (optional)
                </label>
                <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 flex items-center justify-between gap-3 flex-col sm:flex-row">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <Upload size={18} />
                    <span>{file ? file.name : "No file chosen"}</span>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="text-sm font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row gap-3 items-start md:items-center">
              <button
                onClick={onCheckAvailability}
                disabled={!canCheck || availabilityLoading || servicesLoading}
                className={`px-5 py-3 rounded-2xl font-black text-white transition ${
                  !canCheck || availabilityLoading || servicesLoading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-500 hover:brightness-110"
                }`}
              >
                {availabilityLoading ? "Checking..." : "Check Availability"}
              </button>

              <button
                onClick={onSubmit}
                disabled={!canSubmit || servicesLoading}
                className={`px-6 py-3 rounded-2xl font-black text-white transition ${
                  !canSubmit || servicesLoading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110"
                }`}
              >
                {creating ? "Submitting..." : "Submit Application"}
              </button>
            </div>

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

              {localResult && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-semibold flex gap-2 items-start text-emerald-800">
                  <Info size={18} className="mt-0.5" />
                  <div className="w-full">
                    <div className="font-black">{localResult.message}</div>

                    {localResult.trackingId && (
                      <div className="text-sm mt-2 flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          Tracking ID:{" "}
                          <span className="font-black">{localResult.trackingId}</span>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopy}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl font-black bg-white/80 border border-emerald-200 hover:bg-white transition"
                        >
                          <Copy size={16} />
                          {copied ? "Copied ✅" : "Copy"}
                        </button>
                      </div>
                    )}

                    <p className="text-xs mt-2 text-emerald-700/90 font-semibold">
                      (Option 1) Tracking ID-ga si automatic ah ayuu u kaydsan yahay — marka aad gasho Track page, wuu kuu muuqan doonaa.
                    </p>
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