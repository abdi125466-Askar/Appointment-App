import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../../utils/axios";

export default function PublicServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const accents = useMemo(
    () => [
      {
        accent: "from-sky-500 via-blue-600 to-indigo-600",
        ring: "shadow-blue-500/20",
        preview: "/previews/driving.png",
      },
      {
        accent: "from-emerald-500 via-teal-600 to-cyan-600",
        ring: "shadow-emerald-500/20",
        preview: "/previews/idcard.png",
      },
      {
        accent: "from-indigo-500 via-blue-600 to-sky-500",
        ring: "shadow-indigo-500/20",
        preview: "/previews/passport.png",
      },
    ],
    []
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // ✅ baseURL = http://localhost:4000/api
        // ✅ so here we call ONLY /public/services
        const res = await api.get("/public/services");
        const list = res.data?.data || [];

        if (!mounted) return;

        const mapped = list.map((s, idx) => {
          const ui = accents[idx % accents.length];
          return { ...s, ...ui };
        });

        setServices(mapped);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setErr(
          e?.response?.data?.message ||
            "Failed to load services. Hubi backend-ka."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [accents]);

  return (
    <main className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-white/35 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-10 md:pt-12 pb-10 w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Services
          </h1>
          <p className="mt-4 text-slate-700 font-semibold max-w-2xl mx-auto leading-relaxed">
            Dooro adeegga aad u baahan tahay, kadib sii fudud ugu gudub foomka
            codsiga.
          </p>
        </div>

        {loading && (
          <div className="text-center font-semibold text-slate-700">
            Loading services...
          </div>
        )}

        {err && (
          <div className="max-w-3xl mx-auto mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 font-semibold">
            {err}
          </div>
        )}

        {!loading && !err && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <ServiceCard key={s._id} item={s} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ServiceCard({ item }) {
  const bullets = (() => {
    if (Array.isArray(item?.description)) return item.description;
    if (typeof item?.description === "string" && item.description.trim().length) {
      return item.description
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
    }
    return [
      "Buuxi xogta, dooro waqtiga, kuna gudbi dokumentiyada loo baahan yahay.",
      "Natiijo degdeg ah oo la socod sahlan.",
    ];
  })();

  return (
    <div className="group relative rounded-[26px] bg-white/75 backdrop-blur-md border border-white/60 shadow-xl shadow-slate-900/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/15 flex flex-col">
      <div className={`h-1.5 bg-gradient-to-r ${item.accent}`} />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-black text-slate-900 leading-snug">
            {item.name || "Service"}
          </h3>

          <Link
            to={`/book?serviceId=${item._id}`}
            className={`relative z-20 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-white text-sm bg-gradient-to-r ${item.accent} shadow-lg ${item.ring} transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px]`}
          >
            Apply <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm p-4 min-h-[132px]">
          <div className="text-[13.5px] text-slate-700 font-semibold leading-relaxed space-y-2">
            {bullets.slice(0, 3).map((t, i) => (
              <p key={i} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>{t}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-5">
          <div className="relative rounded-2xl overflow-hidden bg-white/35 border border-white/50 shadow-sm">
            <img
              src={item.preview}
              alt={item.name || "service"}
              className="w-full h-[170px] md:h-[180px] object-cover transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
