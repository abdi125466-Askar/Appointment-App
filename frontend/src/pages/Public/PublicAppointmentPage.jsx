import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Copy,
  Info,
  Upload,
  XCircle,
  AlertCircle,
  Clock3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/axios";
import {
  fetchActiveServices,
  checkServiceAvailability,
  createPublicAppointment,
  clearAvailability,
  clearBookingSuccess,
  clearPublicError,
} from "../../Redux/slices/PublicSlice/publicAppointmentSlice";

const TRACKING_KEY = "appointify_tracking_id";
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const FRIDAY_DAY_INDEX = 5;
const HOUR_ORDER = ["07", "08", "09", "10", "11"];

const slugify = (str = "") =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const countDigits = (value = "") => value.replace(/\D/g, "").length;

export default function PublicAppointmentPage() {
  const dispatch = useDispatch();
  const [params] = useSearchParams();

  const serviceIdFromUrl = params.get("serviceId") || "";
  const serviceSlugFromUrl = params.get("service") || "";

  const {
    services = [],
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
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [file, setFile] = useState(null);

  const [localResult, setLocalResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const [dateError, setDateError] = useState("");
  const [fileError, setFileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [slotError, setSlotError] = useState("");
  const [slotLoading, setSlotLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotInfo, setSlotInfo] = useState("");
  const [expandedHour, setExpandedHour] = useState(null);
  const [hasSubmittedSuccessfully, setHasSubmittedSuccessfully] = useState(false);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);

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
    return appointmentDate < todayStr;
  }, [appointmentDate, todayStr]);

  const isFriday = useMemo(() => {
    if (!appointmentDate) return false;
    const d = new Date(`${appointmentDate}T00:00:00`);
    return d.getDay() === FRIDAY_DAY_INDEX;
  }, [appointmentDate]);

  const validateName = (value = "") => {
    const clean = value.trim();
    if (!clean) return "Full Name is required.";
    if (clean.length < 7) return "Full Name must be at least 7 characters.";
    return "";
  };

  const validatePhone = (value = "") => {
    const clean = value.trim();
    if (!clean) return "Phone is required.";
    if (countDigits(clean) < 7) return "Phone must contain at least 7 digits.";
    return "";
  };

  const validateGmail = (value = "") => {
    const clean = value.trim();
    if (!clean) return "Email is required.";
    if (!GMAIL_REGEX.test(clean)) {
      return "Invalid email. Please enter a complete Gmail address ending with @gmail.com";
    }
    return "";
  };

  const validateFile = (value) => {
    if (!value) return "Supporting document is required.";
    return "";
  };

  const hourSlotCards = useMemo(() => {
    const slotSet = new Set(availableSlots);

    return HOUR_ORDER.map((hour) => {
      const base = `${hour}:00`;
      const minuteOptions = ["15", "30", "45"]
        .map((minute) => `${hour}:${minute}`)
        .filter((slot) => slotSet.has(slot));

      const hasBase = slotSet.has(base);
      const hasAny = hasBase || minuteOptions.length > 0;

      return {
        hour,
        base,
        hasBase,
        minuteOptions,
        hasAny,
      };
    }).filter((item) => item.hasAny);
  }, [availableSlots]);

  const fetchAvailableSlots = async (serviceId, date) => {
    if (!serviceId || !date) return;

    setSlotLoading(true);
    setSlotError("");
    setSlotInfo("");
    setAvailableSlots([]);
    setAppointmentTime("");
    setExpandedHour(null);

    try {
      const res = await api.get("/public/appointments/available-slots", {
        params: { serviceId, date },
      });

      const data = res.data;

      if (data?.success === false) {
        setSlotError(data?.message || "Failed to load available time slots.");
        return;
      }

      const slots = Array.isArray(data?.data?.availableSlots)
        ? data.data.availableSlots
        : [];

      setAvailableSlots(slots);
      setSlotInfo(data?.message || "");

      if (slots.length === 0) {
        setSlotError(
          data?.message || "No available time slots for this date."
        );
      }
    } catch (err) {
      setSlotError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load available time slots."
      );
    } finally {
      setSlotLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchActiveServices());
  }, [dispatch]);

  useEffect(() => {
    if (servicesLoading) return;
    if (!Array.isArray(services) || services.length === 0) return;

    const byId =
      serviceIdFromUrl &&
      services.find((s) => String(s._id) === String(serviceIdFromUrl));

    if (byId) {
      setSelectedServiceId(byId._id);
      return;
    }

    const urlSlug = slugify(serviceSlugFromUrl);
    const byNameSlug =
      serviceSlugFromUrl &&
      services.find((s) => slugify(s.name) === urlSlug);

    if (byNameSlug) {
      setSelectedServiceId(byNameSlug._id);
      return;
    }

    const slugToCode = {
      passport: "PP-001",
      national_id: "ID-001",
      birth_certificate: "BC-001",
    };

    const maybeCode = slugToCode[urlSlug];
    const byCode =
      maybeCode &&
      services.find((s) => String(s.code).toUpperCase() === maybeCode);

    if (byCode) {
      setSelectedServiceId(byCode._id);
      return;
    }

    setSelectedServiceId((prev) => prev || services[0]._id);
  }, [servicesLoading, services, serviceIdFromUrl, serviceSlugFromUrl]);

  useEffect(() => {
    dispatch(clearAvailability());
    dispatch(clearBookingSuccess());
    dispatch(clearPublicError());
    setLocalResult(null);
    setCopied(false);
    setFileError("");
    setSlotError("");
    setSlotInfo("");
    setAvailableSlots([]);
    setAppointmentTime("");
    setExpandedHour(null);
    setHasSubmittedSuccessfully(false);
    setHasCheckedAvailability(false);
  }, [dispatch, selectedServiceId, appointmentDate]);

  const isFormBasicallyValid = useMemo(() => {
    return (
      !validateName(fullName) &&
      !validatePhone(phone) &&
      !validateGmail(email) &&
      !validateFile(file) &&
      !!selectedServiceId &&
      !!appointmentDate &&
      !!appointmentTime &&
      !isPastDate &&
      !isFriday
    );
  }, [
    fullName,
    phone,
    email,
    file,
    selectedServiceId,
    appointmentDate,
    appointmentTime,
    isPastDate,
    isFriday,
  ]);

  const canCheck = useMemo(() => {
    return (
      !!selectedServiceId &&
      !!appointmentDate &&
      !isPastDate &&
      !isFriday &&
      !slotLoading &&
      availableSlots.length === 0 &&
      !hasSubmittedSuccessfully
    );
  }, [
    selectedServiceId,
    appointmentDate,
    isPastDate,
    isFriday,
    slotLoading,
    availableSlots.length,
    hasSubmittedSuccessfully,
  ]);

  const canSubmit = useMemo(() => {
    return (
      isFormBasicallyValid &&
      availability?.available === true &&
      !creating &&
      !servicesLoading &&
      !hasSubmittedSuccessfully
    );
  }, [
    isFormBasicallyValid,
    availability,
    creating,
    servicesLoading,
    hasSubmittedSuccessfully,
  ]);

  const onCheckAvailability = async () => {
    if (!selectedServiceId || !appointmentDate) return;

    if (isPastDate) {
      setDateError("Past dates are not allowed. Please choose today or a future date.");
      return;
    }

    if (isFriday) {
      setDateError("Friday is a holiday. Please choose Saturday to Thursday.");
      return;
    }

    setDateError("");
    setHasCheckedAvailability(true);

    dispatch(
      checkServiceAvailability({
        serviceId: selectedServiceId,
        date: appointmentDate,
      })
    );

    await fetchAvailableSlots(selectedServiceId, appointmentDate);
  };

  const onSubmit = async () => {
    if (hasSubmittedSuccessfully || creating) return;

    const currentNameError = validateName(fullName);
    const currentPhoneError = validatePhone(phone);
    const currentEmailError = validateGmail(email);
    const currentFileError = validateFile(file);

    setNameError(currentNameError);
    setPhoneError(currentPhoneError);
    setEmailError(currentEmailError);
    setFileError(currentFileError);

    if (!appointmentTime) {
      setSlotError("Please select an available time slot.");
    } else {
      setSlotError("");
    }

    if (isPastDate) {
      setDateError("Past dates are not allowed. Please choose today or a future date.");
      return;
    }

    if (isFriday) {
      setDateError("Friday is a holiday. Please choose Saturday to Thursday.");
      return;
    }

    if (
      currentNameError ||
      currentPhoneError ||
      currentEmailError ||
      currentFileError ||
      !appointmentTime
    ) {
      return;
    }

    if (!canSubmit) return;

    setDateError("");
    setFileError("");
    setSlotError("");

    const formData = new FormData();
    formData.append("fullName", fullName.trim());
    formData.append("phone", phone.trim());
    formData.append("email", email.trim());
    formData.append("gender", gender);
    formData.append("serviceId", selectedServiceId);
    formData.append("appointmentDate", appointmentDate);
    formData.append("appointmentTime", appointmentTime);
    formData.append("file", file);

    const resAction = await dispatch(createPublicAppointment(formData));

    if (createPublicAppointment.fulfilled.match(resAction)) {
      const d = resAction.payload;
      const trackingId = d?.trackingId || d?.appointmentId || d?._id;

      if (trackingId) localStorage.setItem(TRACKING_KEY, String(trackingId));

      setLocalResult({
        type: "success",
        message: "Appointment created successfully ✅",
        trackingId,
        status: d?.status,
        serviceName: d?.service?.name,
        date: d?.appointmentDate,
        time: d?.appointmentTime,
      });

      setHasSubmittedSuccessfully(true);
    }
  };

  const handleCopy = async () => {
    if (!localResult?.trackingId) return;
    try {
      await navigator.clipboard.writeText(String(localResult.trackingId));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      //
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
                  Enter your details. → Check Availability → Choose Time → Submit.
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
              <Field label="Full Name *">
                <input
                  className={`w-full rounded-xl border bg-white/95 px-4 py-3 font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 ${
                    nameError
                      ? "border-red-400 focus:ring-red-400/20"
                      : "border-slate-300 focus:ring-sky-400/20"
                  }`}
                  value={fullName}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFullName(v);
                    setNameError(validateName(v));
                    setHasSubmittedSuccessfully(false);
                  }}
                  placeholder="Enter full name"
                />
                {nameError && (
                  <p className="mt-2 text-xs font-semibold text-red-700">
                    {nameError}
                  </p>
                )}
              </Field>

              <Field label="Service *">
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-3 font-semibold text-slate-900 outline-none focus:ring-4 focus:ring-emerald-400/20"
                  value={selectedServiceId}
                  onChange={(e) => {
                    setSelectedServiceId(e.target.value);
                    setHasSubmittedSuccessfully(false);
                  }}
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
              </Field>

              <Field label="Phone *">
                <input
                  className={`w-full rounded-xl border bg-white/95 px-4 py-3 font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 ${
                    phoneError
                      ? "border-red-400 focus:ring-red-400/20"
                      : "border-slate-300 focus:ring-sky-400/20"
                  }`}
                  value={phone}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPhone(v);
                    setPhoneError(validatePhone(v));
                    setHasSubmittedSuccessfully(false);
                  }}
                  placeholder="+252..."
                />
                {phoneError && (
                  <p className="mt-2 text-xs font-semibold text-red-700">
                    {phoneError}
                  </p>
                )}
              </Field>

              <Field label="Email *">
                <input
                  className={`w-full rounded-xl border bg-white/95 px-4 py-3 font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 ${
                    emailError
                      ? "border-red-400 focus:ring-red-400/20"
                      : "border-slate-300 focus:ring-sky-400/20"
                  }`}
                  value={email}
                  onChange={(e) => {
                    const v = e.target.value;
                    setEmail(v);
                    setEmailError(validateGmail(v));
                    setHasSubmittedSuccessfully(false);
                  }}
                  placeholder="name@gmail.com"
                />
                {emailError && (
                  <p className="mt-2 text-xs font-semibold text-red-700">
                    {emailError}
                  </p>
                )}
              </Field>

              <Field label="Gender *">
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-3 font-semibold text-slate-900 outline-none focus:ring-4 focus:ring-emerald-400/20"
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setHasSubmittedSuccessfully(false);
                  }}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </Field>

              <Field label="Appointment Date *">
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

                      setAppointmentTime("");
                      setAvailableSlots([]);
                      setSlotError("");
                      setSlotInfo("");
                      setExpandedHour(null);
                      setHasSubmittedSuccessfully(false);
                      setHasCheckedAvailability(false);

                      if (!v) {
                        setAppointmentDate("");
                        setDateError("");
                        return;
                      }

                      if (v < todayStr) {
                        setDateError(
                          "Past dates are not allowed. Please choose today or a future date."
                        );
                        setAppointmentDate("");
                        return;
                      }

                      const d = new Date(`${v}T00:00:00`);
                      if (d.getDay() === FRIDAY_DAY_INDEX) {
                        setDateError("Friday is a holiday. Please choose Saturday to Thursday.");
                        setAppointmentDate(v);
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

                {!dateError && (
                  <p className="mt-2 text-xs font-semibold text-slate-600">
                    Working days: Saturday to Thursday • Working hours: 7:00 AM to 12:00 PM
                  </p>
                )}
              </Field>

              <div className="md:col-span-2">
                <label className="block text-sm font-black text-slate-900 mb-2">
                  Available Time Slots *
                </label>

                <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                  {!appointmentDate ? (
                    <p className="text-sm font-semibold text-slate-600">
                      Please select a date first to view available time slots.
                    </p>
                  ) : dateError ? (
                    <p className="text-sm font-semibold text-red-700">{dateError}</p>
                  ) : slotLoading ? (
                    <p className="text-sm font-semibold text-slate-700">
                      Loading available time slots...
                    </p>
                  ) : hourSlotCards.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                        <Clock3 size={16} />
                        Please select a suitable available time slot
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {hourSlotCards.map((item) => {
                          const isExpanded = expandedHour === item.hour;
                          const baseSelected = appointmentTime === item.base;
                          const canExpand = item.minuteOptions.length > 0;

                          return (
                            <div
                              key={item.hour}
                              className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                            >
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={!item.hasBase || hasSubmittedSuccessfully}
                                  onClick={() => {
                                    if (!item.hasBase || hasSubmittedSuccessfully) return;
                                    setAppointmentTime(item.base);
                                    setSlotError("");
                                  }}
                                  className={`flex-1 rounded-xl border px-4 py-3 text-center font-black transition ${
                                    baseSelected
                                      ? "border-emerald-500 bg-emerald-500 text-white"
                                      : item.hasBase
                                      ? "border-slate-300 bg-white text-slate-900 hover:border-emerald-400 hover:bg-emerald-50"
                                      : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                  } ${hasSubmittedSuccessfully ? "cursor-not-allowed opacity-60" : ""}`}
                                >
                                  {item.base}
                                </button>

                                <button
                                  type="button"
                                  disabled={!canExpand || hasSubmittedSuccessfully}
                                  onClick={() => {
                                    if (!canExpand || hasSubmittedSuccessfully) return;
                                    setExpandedHour((prev) =>
                                      prev === item.hour ? null : item.hour
                                    );
                                  }}
                                  className={`h-11 w-11 shrink-0 rounded-xl border flex items-center justify-center transition ${
                                    canExpand
                                      ? "border-slate-300 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50"
                                      : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300"
                                  } ${hasSubmittedSuccessfully ? "cursor-not-allowed opacity-60" : ""}`}
                                  aria-label={`Open minute options for ${item.base}`}
                                >
                                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                              </div>

                              {isExpanded && canExpand && !hasSubmittedSuccessfully && (
                                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                                  <div className="mb-2 text-xs font-bold text-slate-500">
                                    Choose minutes
                                  </div>

                                  <div className="grid grid-cols-3 gap-2">
                                    {item.minuteOptions.map((slot) => {
                                      const selected = appointmentTime === slot;
                                      const minuteLabel = slot.split(":")[1];

                                      return (
                                        <button
                                          key={slot}
                                          type="button"
                                          onClick={() => {
                                            setAppointmentTime(slot);
                                            setSlotError("");
                                            setExpandedHour(null);
                                          }}
                                          className={`rounded-xl border px-3 py-2 text-sm font-black transition ${
                                            selected
                                              ? "border-emerald-500 bg-emerald-500 text-white"
                                              : "border-slate-300 bg-white text-slate-900 hover:border-emerald-400 hover:bg-emerald-50"
                                          }`}
                                        >
                                          :{minuteLabel}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {slotInfo && (
                        <p className="mt-4 text-xs font-semibold text-slate-600">
                          {slotInfo}
                        </p>
                      )}
                    </>
                  ) : !hasCheckedAvailability ? (
                    <p className="text-sm font-semibold text-slate-600">
                      Click{" "}
                      <span className="font-bold text-blue-600">
                        "Check Availability"
                      </span>{" "}
                      to view available time slots.
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-slate-700">
                      {slotError || "No available time slots for this date."}
                    </p>
                  )}

                  {appointmentTime && (
                    <p className="mt-3 text-sm font-black text-emerald-700">
                      Selected time: {appointmentTime}
                    </p>
                  )}

                  {slotError && hourSlotCards.length > 0 && (
                    <p className="mt-2 text-xs font-semibold text-red-700">
                      {slotError}
                    </p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-black text-slate-900 mb-2">
                  Upload Supporting Document (PDF)
                </label>

                <div
                  className={`rounded-2xl border bg-white/70 p-4 flex items-center justify-between gap-3 flex-col sm:flex-row ${
                    fileError ? "border-red-300" : "border-slate-200/70"
                  }`}
                >
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <Upload size={18} />
                    <span>{file ? file.name : "No file chosen"}</span>
                  </div>

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setFile(f);
                      setFileError(validateFile(f));
                      setHasSubmittedSuccessfully(false);
                    }}
                    className="text-sm font-semibold text-slate-800"
                    disabled={hasSubmittedSuccessfully}
                  />
                </div>

                {fileError && (
                  <p className="mt-2 text-xs font-semibold text-red-700">
                    {fileError}
                  </p>
                )}
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
                disabled={!canSubmit}
                className={`px-6 py-3 rounded-2xl font-black text-white transition ${
                  !canSubmit
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110"
                }`}
              >
                {creating
                  ? "Submitting..."
                  : hasSubmittedSuccessfully
                  ? "Submitted ✓"
                  : "Submit Application"}
              </button>

              {hasSubmittedSuccessfully && (
                <p className="text-xs font-bold text-emerald-700">
                  {/* ✅ This application has already been submitted. */}
                </p>
              )}
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

                    {localResult.date && (
                      <div className="text-sm mt-2">
                        Date:{" "}
                        <span className="font-black">
                          {String(localResult.date).slice(0, 10)}
                        </span>
                      </div>
                    )}

                    {localResult.time && (
                      <div className="text-sm mt-1">
                        Time: <span className="font-black">{localResult.time}</span>
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