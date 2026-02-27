import { useMemo, useState } from "react";
import {
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import api from "../../utils/axios";

const PROCESS_STEPS = [
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "COMPLETED", label: "Completed" },
];

export default function PublicTrackPage() {
  const [appointmentId, setAppointmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState(null);

  const cleanId = appointmentId.trim();

  const isValidObjectId = useMemo(() => {
    return /^[a-fA-F0-9]{24}$/.test(cleanId);
  }, [cleanId]);

  async function fetchStatus(id) {
    const res = await api.get(`/public/appointments/${id}/status`);
    return res.data;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidObjectId) {
      setErrorMsg("Please enter a valid 24-character Appointment ID.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setData(null);

    try {
      const res = await fetchStatus(cleanId);
      if (res?.success) {
        setData(res.data);
      } else {
        setErrorMsg(res?.message || "Appointment not found.");
      }
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || "Appointment not found."
      );
    } finally {
      setLoading(false);
    }
  };

  const isNoShow = data?.status === "NO_SHOW";

  const currentIndex = PROCESS_STEPS.findIndex(
    (step) => step.key === data?.status
  );

  const progressWidth =
    currentIndex >= 0
      ? (currentIndex / (PROCESS_STEPS.length - 1)) * 100
      : 0;

  const prettyDate = (d) =>
    d ? new Date(d).toDateString() : "—";

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="w-full px-6 lg:px-16 xl:px-24 py-16">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-700">
            Appointment Tracker
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Monitor your appointment progress.
          </p>
        </div>

        {/* SEARCH */}
        <div className="max-w-4xl mx-auto bg-white shadow-xl border border-blue-100 rounded-3xl p-8 mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-200 focus-within:border-blue-500">
              <Search className="text-blue-600" size={22} />
              <input
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                placeholder="Enter Appointment ID"
                className="w-full bg-transparent outline-none text-gray-800 text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={!isValidObjectId || loading}
              className={`px-10 py-4 rounded-2xl text-lg font-semibold text-white ${
                isValidObjectId
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Tracking..." : "Track Appointment"}
            </button>
          </form>
        </div>

        {/* ERROR */}
        {errorMsg && (
          <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center gap-4 mb-10">
            <AlertCircle className="text-red-500" size={24} />
            <span className="text-red-600 font-medium">
              {errorMsg}
            </span>
          </div>
        )}

        {/* RESULT */}
        {data && !errorMsg && (
          <div className="max-w-6xl mx-auto bg-white shadow-2xl border border-blue-100 rounded-3xl p-10">

            {/* INFO */}
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-blue-700 mb-2">
                {data?.service?.name}
              </h2>
              <p className="text-gray-600">
                Appointment Date: {prettyDate(data?.appointmentDate)}
              </p>
            </div>

            {/* NO SHOW MESSAGE */}
            {isNoShow && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <XCircle className="mx-auto text-red-500 mb-4" size={36} />
                <h3 className="text-2xl font-bold text-red-600 mb-2">
                  Appointment Marked as No Show
                </h3>
                <p className="text-gray-600">
                  You did not attend your scheduled appointment.
                  Please contact support to reschedule.
                </p>
              </div>
            )}

            {/* NORMAL PROCESS */}
            {!isNoShow && (
              <div className="relative mt-10">

                <div className="absolute top-7 left-0 right-0 h-2 bg-gray-200 rounded-full"></div>

                <div
                  style={{ width: `${progressWidth}%` }}
                  className="absolute top-7 left-0 h-2 bg-blue-600 rounded-full transition-all duration-500"
                ></div>

                <div className="relative flex justify-between items-center">
                  {PROCESS_STEPS.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div key={step.key} className="flex flex-col items-center w-1/3">

                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${
                            isCompleted
                              ? "bg-blue-600 text-white"
                              : isCurrent
                              ? "bg-white border-4 border-blue-600 text-blue-600"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={22} />
                          ) : isCurrent ? (
                            <Clock size={22} />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <p className={`mt-4 text-lg font-semibold ${
                          isCompleted || isCurrent
                            ? "text-blue-700"
                            : "text-gray-500"
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}