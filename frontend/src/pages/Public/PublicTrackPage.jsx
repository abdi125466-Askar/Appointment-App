import bg from "../../assets/landing/bg.png";

export default function PublicTrackPage() {
  return (
    <main
      className="relative min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/40" />

      <div className="relative mx-auto max-w-3xl px-4 md:px-8 py-10 md:py-14">
        <div className="rounded-[28px] bg-white/55 border border-white/70 backdrop-blur-xl shadow-sm p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            Track Your Appointment
          </h2>
          <p className="mt-2 text-slate-600">
            Enter the tracking ID you received after booking.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
            <input
              placeholder="Enter Tracking ID (e.g., APP-20...)"
              className="h-12 rounded-2xl border border-slate-200 bg-white/70 px-4 font-semibold outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button className="h-12 rounded-2xl bg-blue-600 text-white font-black px-6 hover:brightness-95 transition">
              Track Status
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
