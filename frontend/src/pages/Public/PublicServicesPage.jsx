import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import bg from "../../assets/landing/bg.png";

const services = [
  { title: "Birth Certificate", desc: "Apply for birth certificate service." },
  { title: "National ID", desc: "Register and manage your national ID." },
  { title: "Passport", desc: "Book passport application appointment." },
  { title: "Driving License", desc: "Apply for driving license services." },
];

export default function PublicServicesPage() {
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

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-14">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Services
          </h2>
          <p className="mt-2 text-slate-600">
            Choose the service you need and continue to the application form.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-[26px] bg-white/55 border border-white/70 backdrop-blur-xl shadow-sm p-6 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-xl font-black text-slate-900">{s.title}</p>
                <p className="text-sm text-slate-600 mt-1">{s.desc}</p>
              </div>

              <Link
                to="/book"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-black shadow-sm hover:brightness-95 transition"
              >
                Apply <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
