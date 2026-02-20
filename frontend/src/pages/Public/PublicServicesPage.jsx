// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowRight } from "lucide-react";
// import api from "../../utils/axios";

// export default function PublicServicesPage() {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   const accents = useMemo(
//     () => [
//       {
//         accent: "from-sky-500 via-blue-600 to-indigo-600",
//         ring: "shadow-blue-500/20",
//         preview: "/previews/driving.png",
//       },
//       {
//         accent: "from-emerald-500 via-teal-600 to-cyan-600",
//         ring: "shadow-emerald-500/20",
//         preview: "/previews/idcard.png",
//       },
//       {
//         accent: "from-indigo-500 via-blue-600 to-sky-500",
//         ring: "shadow-indigo-500/20",
//         preview: "/previews/passport.png",
//       },
//     ],
//     []
//   );

//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       try {
//         setLoading(true);
//         setErr("");

//         // ✅ baseURL = http://localhost:4000/api
//         // ✅ so here we call ONLY /public/services
//         const res = await api.get("/public/services");
//         const list = res.data?.data || [];

//         if (!mounted) return;

//         const mapped = list.map((s, idx) => {
//           const ui = accents[idx % accents.length];
//           return { ...s, ...ui };
//         });

//         setServices(mapped);
//       } catch (e) {
//         console.error(e);
//         if (!mounted) return;
//         setErr(
//           e?.response?.data?.message ||
//             "Failed to load services. Hubi backend-ka."
//         );
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();

//     return () => (mounted = false);
//   }, [accents]);

//   return (
//     <main className="relative w-full overflow-hidden">
//       <div className="absolute inset-0 bg-white/35 pointer-events-none" />

//       <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-10 md:pt-12 pb-10 w-full">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
//             Services
//           </h1>
//           <p className="mt-4 text-slate-700 font-semibold max-w-2xl mx-auto leading-relaxed">
//             Dooro adeegga aad u baahan tahay, kadib sii fudud ugu gudub foomka
//             codsiga.
//           </p>
//         </div>

//         {loading && (
//           <div className="text-center font-semibold text-slate-700">
//             Loading services...
//           </div>
//         )}

//         {err && (
//           <div className="max-w-3xl mx-auto mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 font-semibold">
//             {err}
//           </div>
//         )}

//         {!loading && !err && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {services.map((s) => (
//               <ServiceCard key={s._id} item={s} />
//             ))}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

// function ServiceCard({ item }) {
//   const bullets = (() => {
//     if (Array.isArray(item?.description)) return item.description;
//     if (typeof item?.description === "string" && item.description.trim().length) {
//       return item.description
//         .split("\n")
//         .map((x) => x.trim())
//         .filter(Boolean);
//     }
//     return [
//       "Buuxi xogta, dooro waqtiga, kuna gudbi dokumentiyada loo baahan yahay.",
//       "Natiijo degdeg ah oo la socod sahlan.",
//     ];
//   })();

//   return (
//     <div className="group relative rounded-[26px] bg-white/75 backdrop-blur-md border border-white/60 shadow-xl shadow-slate-900/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/15 flex flex-col">
//       <div className={`h-1.5 bg-gradient-to-r ${item.accent}`} />

//       <div className="p-6 flex flex-col flex-1">
//         <div className="flex items-start justify-between gap-3">
//           <h3 className="text-xl font-black text-slate-900 leading-snug">
//             {item.name || "Service"}
//           </h3>

//           <Link
//             to={`/book?serviceId=${item._id}`}
//             className={`relative z-20 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-white text-sm bg-gradient-to-r ${item.accent} shadow-lg ${item.ring} transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px]`}
//           >
//             Apply <ArrowRight size={16} />
//           </Link>
//         </div>

//         <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm p-4 min-h-[132px]">
//           <div className="text-[13.5px] text-slate-700 font-semibold leading-relaxed space-y-2">
//             {bullets.slice(0, 3).map((t, i) => (
//               <p key={i} className="flex gap-2">
//                 <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-slate-400" />
//                 <span>{t}</span>
//               </p>
//             ))}
//           </div>
//         </div>

//         <div className="mt-auto pt-5">
//           <div className="relative rounded-2xl overflow-hidden bg-white/35 border border-white/50 shadow-sm">
//             <img
//               src={item.preview}
//               alt={item.name || "service"}
//               className="w-full h-[170px] md:h-[180px] object-cover transition duration-300 group-hover:scale-[1.02]"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import api from "../../utils/axios";
import "../Service/glow.css";

const COPY = {
  BIRTH_CERTIFICATE: {
    title: "Birth Certificate",
    bullets: [
      "Buuxi xogta shahaadada dhalashada, kuna lifaaq dukumentiyada muhiimka ah.",
      "Riix Apply si aad u gudbiso codsiga oo aad u hesho Tracking ID.",
    ],
    preview: "/previews/birth.png",
    accent: "from-sky-500 via-blue-600 to-indigo-600",
    ring: "shadow-blue-500/20",
    tone: "blue", // ✅ big background = blue
  },
  PASSPORT_APPLICATION: {
    title: "Passport Application",
    bullets: [
      "Codsi/cusboonaysiin baasaboorka: geli xogta, ku lifaaq sawir & dukumentiyo.",
      "Riix Apply si aad u dhamaystirto codsiga oo aad u hesho Tracking ID.",
    ],
    preview: "/previews/passport.png",
    accent: "from-emerald-500 via-teal-600 to-cyan-600",
    ring: "shadow-emerald-500/20",
    tone: "green", // ✅ big background = green
  },
  NATIONAL_ID: {
    title: "National ID",
    bullets: [
      "Diiwaan-gelin Kaarka Aqoonsiga: buuxi xogta oo ku lifaaq dukumentiyada loo baahan yahay.",
      "Riix Apply si aad u dirto codsiga oo aad ula socoto status-ka.",
    ],
    preview: "/previews/idcard.png",
    accent: "from-indigo-500 via-blue-600 to-sky-500",
    ring: "shadow-indigo-500/20",
    tone: "blue", // ✅ big background = blue
  },
};

export default function PublicServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const uiFallback = useMemo(
    () => [COPY.BIRTH_CERTIFICATE, COPY.PASSPORT_APPLICATION, COPY.NATIONAL_ID],
    []
  );

  const norm = (v) => String(v || "").toLowerCase().replace(/[\s_-]+/g, "");

  const pickService = (list, kind) => {
    const rules = {
      birth: (s) =>
        norm(s.code).includes("birth") ||
        norm(s.name).includes("birth") ||
        norm(s.name).includes("certificate") ||
        norm(s.code).includes("certificate"),
      passport: (s) => norm(s.code).includes("passport") || norm(s.name).includes("passport"),
      national: (s) =>
        norm(s.code).includes("national") ||
        norm(s.name).includes("national") ||
        norm(s.code).includes("id") ||
        norm(s.name).includes("idcard") ||
        norm(s.name).includes("id"),
    };
    const matcher = rules[kind];
    return matcher ? list.find(matcher) || null : null;
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await api.get("/public/services");
        const list = res.data?.data || [];
        if (!mounted) return;

        if (!Array.isArray(list) || list.length === 0) {
          setServices([]);
          return;
        }

        const birth = pickService(list, "birth");
        const passport = pickService(list, "passport");
        const national = pickService(list, "national");

        const used = new Set([birth?._id, passport?._id, national?._id].filter(Boolean));
        const remaining = list.filter((s) => !used.has(s._id));

        const slots = [birth, passport, national];
        for (let i = 0; i < slots.length; i++) {
          if (!slots[i]) slots[i] = remaining.shift() || null;
        }

        const main = slots
          .filter(Boolean)
          .map((s, idx) => {
            const ui = uiFallback[idx] || uiFallback[0];
            return {
              ...s,
              title: ui.title,
              bullets: ui.bullets,
              preview: ui.preview,
              accent: ui.accent,
              ring: ui.ring,
              tone: ui.tone,
            };
          });

        setServices(main);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setErr(
          e?.response?.data?.message ||
            "Failed to load services. Hubi backend-ka (/api/public/services)."
        );
        setServices([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [uiFallback]);

  return (
    <main className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-white/35 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-6 md:pt-7 pb-4 w-full">
        <div className="text-center mb-5">
          <div className="headerGlow mx-auto inline-block px-6 py-2.5 rounded-3xl">
            <h1 className="text-[38px] md:text-5xl font-black tracking-tight text-slate-900 leading-none">
              Services
            </h1>
          </div>

          <div className="subGlow mx-auto mt-3 max-w-3xl rounded-3xl px-6 py-3">
            <p className="text-slate-800 font-extrabold leading-relaxed">
              Dooro adeegga aad u baahan tahay, kadib si fudud ugu gudub foomka codsiga.
            </p>
          </div>
        </div>

        {loading && (
          <div className="text-center font-semibold text-slate-800">
            Loading services...
          </div>
        )}

        {!loading && err && (
          <div className="max-w-3xl mx-auto mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 font-semibold">
            {err}
          </div>
        )}

        {!loading && !err && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
  return (
    <div className="serviceGlow rounded-[26px] bg-white/85 backdrop-blur-md shadow-xl overflow-hidden flex flex-col transition hover:-translate-y-1">
      <div className={`h-1.5 bg-gradient-to-r ${item.accent}`} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-3">
          <h3 className="svcTitle text-[21px] font-black text-slate-900 leading-tight">
            {item.title}
          </h3>

          <Link
            to={`/book?serviceId=${item._id}`}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-white text-sm bg-gradient-to-r ${item.accent} ${item.ring} shadow-lg hover:brightness-110`}
          >
            Apply <ArrowRight size={16} />
          </Link>
        </div>

        {/* ✅ BIG BOX BACKGROUND (casanka ku wareegsan) = by tone */}
        <div className={`mt-4 infoCard infoTone-${item.tone}`}>
          {(item.bullets || []).slice(0, 2).map((t, i) => (
            // ✅ INNER ROW BACKGROUND = black light (same for all)
            <div key={i} className="infoRow rowBlack">
              <span className={`infoDot dot-${item.tone}`}>
                <CheckCircle2 size={16} />
              </span>
              <p className="infoText">{t}</p>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <div className={`imgFrame frame-${item.tone}`}>
            <img src={item.preview} alt={item.title} className="imgInside" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  );
}