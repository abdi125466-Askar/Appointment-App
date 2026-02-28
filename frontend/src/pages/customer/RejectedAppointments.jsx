import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointmentsByStatus } from "../../Redux/slices/cusomerSlice/appointmentSlice";

export default function RejectedAppointments() {
  const dispatch = useDispatch();
  const rejected = useSelector((s) => s.appointments.byStatus.REJECTED || []);
  const loading = useSelector((s) => s.appointments.loading);
  const error = useSelector((s) => s.appointments.error);

  useEffect(() => {
    dispatch(fetchAppointmentsByStatus("REJECTED"));
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-4">
        Rejected Appointments
      </h1>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <p className="font-bold text-slate-700">
            Total: {rejected.length}
          </p>
          {loading && <p className="text-slate-500">Loading...</p>}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Service</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rejected.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="p-3 font-semibold text-slate-800">
                    {a?.customerId?.fullName || "—"}
                    <div className="text-slate-500 font-normal">
                      {a?.customerId?.phone || ""}
                    </div>
                  </td>
                  <td className="p-3">
                    {a?.serviceId?.name || a?.service?.name || "—"}
                  </td>
                  <td className="p-3">
                    {a?.appointmentDate
                      ? new Date(a.appointmentDate).toDateString()
                      : "—"}
                  </td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold">
                      REJECTED
                    </span>
                  </td>
                </tr>
              ))}

              {rejected.length === 0 && !loading && (
                <tr>
                  <td className="p-6 text-center text-slate-500" colSpan={4}>
                    No rejected appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}