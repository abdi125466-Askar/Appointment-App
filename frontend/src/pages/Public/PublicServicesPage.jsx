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


// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowRight } from "lucide-react";
// import api from "../../utils/axios";

// // ✅ Somali professional descriptions by SERVICE CODE
// const SOMALI_DESC = {
//   BIRTH_CERTIFICATE:
//     "Codsi shahaadada dhalashada. Geli xogta, ku lifaaq dukumentiyada, kadibna dir codsiga.",
//   PASSPORT_APPLICATION:
//     "Codsi ama cusboonaysiin baasaboor. Soo geli xogta, ku lifaaq sawir & dukumenti, kadibna gudbi.",
//   NATIONAL_ID:
//     "Diiwaan-gelin Kaarka Aqoonsiga Qaranka. Buuxi xogta, ku lifaaq dukumentiyada, kadibna sug xaqiijin.",
// };

// // ✅ Exact order like Railway (sawirka 2aad)
// const ORDER = ["BIRTH_CERTIFICATE", "PASSPORT_APPLICATION", "NATIONAL_ID"];

// export default function PublicServicesPage() {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   // ✅ UI styling by service code (stable even if backend order changes)
//   const uiByCode = useMemo(
//     () => ({
//       BIRTH_CERTIFICATE: {
//         accent: "from-sky-500 via-blue-600 to-indigo-600",
//         ring: "shadow-blue-500/20",
//         preview: "/previews/birth.png", // NOTE: if image text is wrong, replace file birth.png
//       },
//       PASSPORT_APPLICATION: {
//         accent: "from-emerald-500 via-teal-600 to-cyan-600",
//         ring: "shadow-emerald-500/20",
//         preview: "/previews/passport.png",
//       },
//       NATIONAL_ID: {
//         accent: "from-indigo-500 via-blue-600 to-sky-500",
//         ring: "shadow-indigo-500/20",
//         preview: "/previews/idcard.png",
//       },
//     }),
//     []
//   );

//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       try {
//         setLoading(true);
//         setErr("");

//         const res = await api.get("/public/services");
//         const list = res.data?.data || [];
//         if (!mounted) return;

//         // Map by code
//         const byCode = new Map(
//           list.map((s) => [String(s.code || "").toUpperCase().trim(), s])
//         );

//         // Build in exact order: Birth -> Passport -> National ID
//         const ordered = ORDER.map((code) => {
//           const s = byCode.get(code);
//           if (!s) return null;

//           return {
//             ...s,
//             ...uiByCode[code],
//             // ✅ Title fixed (no "Driving License Application" etc)
//             __title: code,
//             // ✅ Somali professional description override
//             __desc: SOMALI_DESC[code],
//           };
//         }).filter(Boolean);

//         // If backend returns extra services not in ORDER, append them at end:
//         const extras = list
//           .filter((s) => !ORDER.includes(String(s.code || "").toUpperCase().trim()))
//           .map((s, idx) => {
//             const code = String(s.code || "").toUpperCase().trim();
//             const fallback = uiByCode[ORDER[idx % ORDER.length]];
//             return {
//               ...s,
//               ...fallback,
//               __title: s.name || code || "Service",
//               __desc:
//                 (typeof s.description === "string" && s.description.trim()) ||
//                 "Buuxi xogta, ku lifaaq dukumentiyada, kadibna gudbi codsiga.",
//             };
//           });

//         setServices([...ordered, ...extras]);
//       } catch (e) {
//         console.error(e);
//         if (!mounted) return;
//         setErr(
//           e?.response?.data?.message || "Failed to load services. Hubi backend-ka."
//         );
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();

//     return () => (mounted = false);
//   }, [uiByCode]);

//   return (
//     <main className="relative w-full overflow-hidden">
//       <div className="absolute inset-0 bg-white/35 pointer-events-none" />

//       <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-10 md:pt-12 pb-10 w-full">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
//             Services
//           </h1>
//           <p className="mt-4 text-slate-700 font-semibold max-w-2xl mx-auto leading-relaxed">
//             Dooro adeegga aad u baahan tahay, kadib si fudud ugu gudub foomka codsiga.
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
//   // ✅ Always show our professional Somali text for the 3 main services
//   const bullets = (() => {
//     const txt = String(item.__desc || item.description || "").trim();
//     if (!txt) return [];
//     // make it 2 bullets for clean UI
//     return [
//       txt,
//       "Riix Apply si aad u buuxiso foomka oo aad u hesho Tracking ID.",
//     ];
//   })();

//   return (
//     <div
//       className={[
//         "group relative rounded-[26px] bg-white/75 backdrop-blur-md",
//         "border border-white/60 shadow-xl shadow-slate-900/10 overflow-hidden",
//         "transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/15",
//         "flex flex-col serviceGlow",
//       ].join(" ")}
//     >
//       <div className={`h-1.5 bg-gradient-to-r ${item.accent}`} />

//       <div className="p-6 flex flex-col flex-1">
//         <div className="flex items-start justify-between gap-3">
//           <h3 className="text-xl font-black text-slate-900 leading-snug">
//             {item.__title || item.name || "Service"}
//           </h3>

//           {/* ✅ APPLY BUTTON (unchanged / works) */}
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
//               alt={item.__title || item.name || "service"}
//               className="w-full h-[170px] md:h-[180px] object-cover transition duration-300 group-hover:scale-[1.02]"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { ArrowRight, FileText, IdCard, BookOpen, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./glow.css";

export default function PublicServicesPage() {
  const navigate = useNavigate();

  const services = [
    {
      key: "birth",
      title: "Birth Certificate",
      theme: "blue",
      img: "/previews/birth.png",
      applyTo: "/book?service=birth_certificate",
      bullets: [
        {
          icon: FileText,
          title: "Diiwaangelin Degdeg ah",
          text: "Buuxi xogta shahaadada dhalashada, kuna lifaaq dukumentiyada muhiimka ah.",
        },
        {
          icon: ShieldCheck,
          title: "Hubin & Tracking",
          text: "Riix Apply si aad u gudbiso codsiga oo aad u hesho Tracking ID.",
        },
      ],
    },
    {
      key: "passport",
      title: "Passport",
      theme: "green",
      img: "/previews/passport.png",
      applyTo: "/book?service=passport",
      bullets: [
        {
          icon: BookOpen,
          title: "Codsi ama Cusboonaysiin",
          text: "Geli xogta baasaboorka, kuna lifaaq sawir & dukumentiyo.",
        },
        {
          icon: ShieldCheck,
          title: "Gudbin & Tracking",
          text: "Riix Apply si aad u dhammaystirto codsiga oo aad u hesho Tracking ID.",
        },
      ],
    },
    {
      key: "nid",
      title: "National ID",
      theme: "blue",
      img: "/previews/idcard.png",
      applyTo: "/book?service=national_id",
      bullets: [
        {
          icon: IdCard,
          title: "Diiwaangelin Kaarka",
          text: "Buuxi xogta oo ku lifaaq dukumentiyada loo baahan yahay.",
        },
        {
          icon: ShieldCheck,
          title: "La Soco Status-ka",
          text: "Riix Apply si aad u dirto codsiga oo aad ula socoto status-ka.",
        },
      ],
    },
  ];

  return (
    <section className="servicesPageWrap">
      <div className="servicesHero">
        <h1 className="servicesTitle glowBorderBlue">Services</h1>

        <p className="servicesSub glowBorderSub">
          Dooro adeegga aad u baahan tahay, kadib si fudud ugu gudub foomka codsiga.
        </p>
      </div>

      <div className="servicesGrid">
        {services.map((s) => (
          <article key={s.key} className={`serviceCard serviceCard--${s.theme}`}>
            <div className="serviceTop">
              <div className="serviceTopTitle">
                <span className="servicePillTitle">{s.title}</span>
              </div>

              <button
                className={`applyBtn applyBtn--${s.theme}`}
                onClick={() => navigate(s.applyTo)}
                type="button"
              >
                Apply
                <span className="applyArrow">
                  <ArrowRight size={18} />
                </span>
              </button>
            </div>

            <div className={`descOuter descOuter--${s.theme}`}>
              <div className="descInner">
                {s.bullets.map((b, idx) => {
                  const Icon = b.icon;
                  return (
                    <div key={idx} className="descItem">
                      <div className={`descIcon descIcon--${s.theme}`}>
                        <Icon size={18} />
                      </div>
                      <div className="descText">
                        <div className="descTitle">{b.title}</div>
                        <div className="descBody">{b.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="docWrap">
              <div className={`docFrame docFrame--${s.theme}`}>
                <img className="docImg" src={s.img} alt={s.title} loading="lazy" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}