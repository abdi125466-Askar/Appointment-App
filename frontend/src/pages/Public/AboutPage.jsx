import bg from "../../assets/landing/bg.png";

export default function AboutPage() {
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

      <div className="relative mx-auto max-w-4xl px-4 md:px-8 py-10 md:py-14">
        <div className="rounded-[28px] bg-white/55 border border-white/70 backdrop-blur-xl shadow-sm p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            About Us
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Appointify helps citizens book services online, reduce queues, and
            track status using a unique tracking ID.
          </p>
        </div>
      </div>
    </main>
  );
}
