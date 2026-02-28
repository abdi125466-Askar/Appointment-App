import React from "react";
import { CheckCircle2, Clock, XCircle, AlertTriangle } from "lucide-react";

/**
 * MAIN: Pending -> Approved -> Completed
 * Branches:
 *  - Rejected (from Pending)
 *  - No Show (from Approved)
 */

const MAIN_STEPS = [
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "COMPLETED", label: "Completed" },
];

export default function AppointmentStepper({ status }) {
  const s = String(status || "").toUpperCase();

  const isRejected = s === "REJECTED";
  const isNoShow = s === "NO_SHOW";
  const isCompleted = s === "COMPLETED";

  // main index
  const currentIndex = (() => {
    if (isRejected) return 0;
    if (isNoShow) return 1;
    const idx = MAIN_STEPS.findIndex((x) => x.key === s);
    return idx >= 0 ? idx : 0;
  })();

  const doneIndex = (() => {
    if (isRejected) return 0;
    if (isNoShow) return 1;
    return currentIndex;
  })();

  const progressWidth = (doneIndex / (MAIN_STEPS.length - 1)) * 100;

  // main line color
  const progressColor = isCompleted
    ? "bg-emerald-500"
    : isRejected || isNoShow
    ? "bg-slate-200"
    : "bg-blue-600";

  return (
    <div className="w-full">
      <div className="relative mx-auto max-w-4xl">
        {/* LINE */}
        <div className="absolute left-0 right-0 top-[28px] h-2 rounded-full bg-slate-200" />
        <div
          className={`absolute left-0 top-[28px] h-2 rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${progressWidth}%` }}
        />

        {/* MAIN STEPS */}
        <div className="relative grid grid-cols-3 items-start">
          {MAIN_STEPS.map((step, index) => {
            const isDone =
              (!isRejected && !isNoShow && index < currentIndex) ||
              (isRejected && index === 0) ||
              (isNoShow && index <= 1);

            const isActive =
              (!isRejected && !isNoShow && index === currentIndex) ||
              (isCompleted && index === 2);

            const isFuture =
              (!isRejected && !isNoShow && index > currentIndex) ||
              (isRejected && index > 0) ||
              (isNoShow && index > 1);

            let circle =
              "mx-auto w-14 h-14 rounded-full flex items-center justify-center font-black transition-all";
            let label = "mt-3 text-center font-bold transition-all";

            if (isDone) {
              circle += isCompleted
                ? " bg-emerald-500 text-white"
                : " bg-blue-600 text-white";
              label += isCompleted ? " text-emerald-700" : " text-blue-700";
            } else if (isActive) {
              circle += isCompleted
                ? " bg-white border-4 border-emerald-500 text-emerald-600"
                : " bg-white border-4 border-blue-600 text-blue-600";
              label += isCompleted ? " text-emerald-700" : " text-blue-700";
            } else if (isFuture) {
              circle += " bg-slate-300 text-slate-600";
              label += " text-slate-600";
            } else {
              circle += " bg-slate-300 text-slate-600";
              label += " text-slate-600";
            }

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div className={circle}>
                  {isDone ? (
                    <CheckCircle2 size={22} />
                  ) : isActive ? (
                    <Clock size={22} />
                  ) : (
                    <span className="text-lg">{index + 1}</span>
                  )}
                </div>
                <div className={label}>{step.label}</div>
              </div>
            );
          })}
        </div>

        {/* BRANCHES (BELOW) */}
        <div className="relative mt-8 grid grid-cols-3">
          {/* Rejected under Pending */}
          <div className="flex flex-col items-center">
            {/* dashed connector */}
            <div className="h-6 border-l-2 border-dashed border-slate-300" />
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-black ${
                isRejected ? "bg-red-500 text-white" : "bg-slate-300 text-slate-600"
              }`}
              title="Rejected"
            >
              <XCircle size={20} />
            </div>
            <p className={`mt-2 text-sm font-bold ${isRejected ? "text-red-600" : "text-slate-500"}`}>
              Rejected
            </p>
          </div>

          {/* No Show under Approved */}
          <div className="flex flex-col items-center">
            <div className="h-6 border-l-2 border-dashed border-slate-300" />
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-black ${
                isNoShow ? "bg-amber-500 text-white" : "bg-slate-300 text-slate-600"
              }`}
              title="No Show"
            >
              <AlertTriangle size={20} />
            </div>
            <p className={`mt-2 text-sm font-bold ${isNoShow ? "text-amber-600" : "text-slate-500"}`}>
              No Show
            </p>
          </div>

          {/* Empty column under Completed */}
          <div />
        </div>
      </div>

      {/* STATUS MESSAGE */}
      {isRejected && (
        <div className="mt-8 mx-auto max-w-4xl bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <XCircle className="mx-auto text-red-500 mb-3" size={34} />
          <h3 className="text-xl font-black text-red-600 mb-1">Appointment Rejected</h3>
          <p className="text-slate-600">Your request was declined. Please contact support for details.</p>
        </div>
      )}

      {isNoShow && (
        <div className="mt-8 mx-auto max-w-4xl bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <AlertTriangle className="mx-auto text-amber-500 mb-3" size={34} />
          <h3 className="text-xl font-black text-amber-700 mb-1">Marked as No Show</h3>
          <p className="text-slate-600">You did not attend your scheduled appointment. Please contact support to reschedule.</p>
        </div>
      )}
    </div>
  );
}