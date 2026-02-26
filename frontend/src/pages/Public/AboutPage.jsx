import React from "react";
import {
  ShieldCheck,
  Clock3,
  Users,
  CheckCircle2,
  Sparkles,
  BarChart3,
  MapPin,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

/** ====== Small UI (BLUE-ONLY brand, subtle WHITE glow borders) ====== */
const StatusBadge = () => (
  <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] sm:text-xs font-bold text-white ring-1 ring-white/10 backdrop-blur-xl shadow-[0_18px_60px_-55px_rgba(0,0,0,0.75)]">
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-slate-100">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-200/80" />
      Pending
    </span>
    <span className="text-slate-200/70">→</span>
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-slate-100">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-300/90" />
      Approved
    </span>
    <span className="text-slate-200/70">→</span>
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-slate-100">
      <span className="h-1.5 w-1.5 rounded-full bg-indigo-300/90" />
      Completed
    </span>
  </div>
);

const Stat = ({ icon: Icon, label, value }) => (
  <div className="pulse-soft rounded-2xl border border-white/10 bg-white/5 px-5 py-4 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_22px_70px_-60px_rgba(0,0,0,0.80)] transition hover:border-white/15 hover:bg-white/7">
    <div className="flex items-center gap-3">
      {/* ✅ Icon box now pulses subtly */}
      <span className="pulse-soft grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
        <Icon className="h-5 w-5 text-white/85" />
      </span>
      <div className="min-w-0">
        <div className="text-sm text-slate-100/75">{label}</div>
        <div className="text-xl font-extrabold tracking-tight text-white">
          {value}
        </div>
      </div>
    </div>
  </div>
);

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="pulse-soft rounded-2xl border border-white/10 bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_22px_70px_-62px_rgba(0,0,0,0.82)] transition hover:border-white/15 hover:bg-white/7">
    <div className="flex items-start gap-4">
      {/* ✅ Icon box now pulses subtly */}
      <span className="pulse-soft grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
        <Icon className="h-5 w-5 text-white/85" />
      </span>
      <div>
        <div className="text-base font-bold text-white">{title}</div>
        <p className="mt-1 text-sm leading-6 text-slate-100/80">{desc}</p>
      </div>
    </div>
  </div>
);

const Step = ({ index, title, desc }) => (
  <div className="pulse-soft relative rounded-2xl border border-white/10 bg-white/5 p-5 ring-1 ring-white/10 shadow-[0_22px_70px_-62px_rgba(0,0,0,0.82)] backdrop-blur-xl transition hover:border-white/15 hover:bg-white/7">
    <div className="flex items-start gap-4">
      {/* ✅ Step number badge pulses subtly */}
      <div className="pulse-soft grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white font-extrabold shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
        {index}
      </div>
      <div>
        <div className="font-bold text-white">{title}</div>
        <p className="mt-1 text-sm leading-6 text-slate-100/80">{desc}</p>
      </div>
    </div>
  </div>
);

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Muwaadiniin la adeego", value: "24/7" },
    { icon: Clock3, label: "Waqti la badbaadiyo", value: "Faster Flow" },
    { icon: ShieldCheck, label: "Amni & Xog ilaalin", value: "Secure" },
    { icon: BarChart3, label: "Hufnaan & La socod", value: "Transparent" },
  ];

  const features = [
    {
      icon: BadgeCheck,
      title: "Ballan Degdeg ah",
      desc: "Dooro adeegga aad rabto, buuxi foomka, kadibna hel ballan rasmi ah oo leh jadwal cad.",
    },
    {
      icon: MapPin,
      title: "Meel & Waqti La Qorsheeyey",
      desc: "Ka fogow safaf iyo ciriiri — Appointify waxay kuu qorshaysaa waqtiga saxda ah ee aad imanayso.",
    },
    {
      icon: Sparkles,
      title: "Tracking ID",
      desc: "La soco xaaladda codsigaaga adigoo adeegsanaya Appointment ID-gaaga (Track page).",
    },
    {
      icon: CheckCircle2,
      title: "Hab-maamul Nadiif ah",
      desc: "Shaqaale iyo Admin waxay maareeyaan ballamaha si nidaamsan: Pending → Approved → Completed.",
    },
  ];

  const steps = [
    {
      title: "Dooro Adeegga",
      desc: "Passport, National ID, Driving License iyo adeegyo kale oo public ah.",
    },
    {
      title: "Buuxi Foomka",
      desc: "Gali xogtaada, ku lifaaq dukumenti haddii loo baahdo, kadibna dir codsiga.",
    },
    {
      title: "Hel & La Soco",
      desc: "Hel Appointment ID, kadibna ka eeg status-ka si fudud oo hufan.",
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      {/* overlay (subtle) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/35 to-slate-950/55" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-500/8 blur-3xl" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-indigo-500/7 blur-3xl" />
        <div className="absolute left-1/2 bottom-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/7 blur-3xl" />
      </div>

      <div className="relative flex justify-center px-3 sm:px-6 py-8 sm:py-10">
        <div className="w-full max-w-[980px]">
          <div className="pulse-soft rounded-[24px] sm:rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-6 md:p-10 backdrop-blur-2xl ring-1 ring-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_40px_120px_-80px_rgba(0,0,0,0.85)]">
            {/* HERO GRID */}
            <div className="grid gap-7 lg:grid-cols-[1fr_360px] lg:items-start">
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="pulse-soft inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/10">
                    <span className="h-2 w-2 rounded-full bg-blue-300/80 shadow-[0_0_10px_rgba(59,130,246,0.30)]" />
                    Government Appointment System
                  </div>
                </div>

                <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  About{" "}
                  <span className="inline-flex items-baseline gap-0.5">
                    <span className="text-white">Appoint</span>
                    <span className="text-blue-200 drop-shadow-[0_0_10px_rgba(59,130,246,0.22)]">
                      ify
                    </span>
                  </span>
                </h1>

                <p className="mt-3 text-sm sm:text-base leading-7 text-slate-100/85">
                  Appointify waxay caawisaa muwaadiniinta inay adeegyada dowladda si online ah u qabsadaan,
                  safafka u yareeyaan, ayna si hufan ula socdaan xaaladda codsigooda iyagoo adeegsanaya{" "}
                  <span className="font-semibold text-white">Appointment ID</span>.
                </p>

                <div className="pulse-soft mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100/90 ring-1 ring-white/10">
                  <span className="font-bold text-white">Hadafkeennu:</span>
                  <span className="mx-2 text-slate-200/70">—</span>
                  In adeegyada dowladda laga dhigo kuwo <span className="font-semibold">fudud</span>,{" "}
                  <span className="font-semibold">degdeg</span>, iyo{" "}
                  <span className="font-semibold">hufan</span> qof walba.
                </div>

                <div className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                  <Link
                    to="/services"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 text-sm font-bold text-white shadow-[0_16px_45px_-30px_rgba(37,99,235,0.55)] ring-1 ring-white/10 transition hover:brightness-110"
                  >
                    Explore Services <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/track"
                    className="pulse-soft inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/95 ring-1 ring-white/10 backdrop-blur-xl transition hover:bg-white/7"
                  >
                    Track Request
                  </Link>
                </div>
              </div>

              <div className="grid gap-3">
                {stats.map((s) => (
                  <Stat key={s.label} icon={s.icon} label={s.label} value={s.value} />
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {features.map((f) => (
                <Feature key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
              ))}
            </div>

            <div className="pulse-soft mt-10 rounded-[22px] sm:rounded-[24px] border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8 backdrop-blur-2xl ring-1 ring-white/10 shadow-[0_26px_85px_-70px_rgba(0,0,0,0.85)]">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="text-center md:text-left">
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">
                    Sida Ay U Shaqayso
                  </h2>
                  <p className="mt-1 text-sm text-slate-100/80">
                    3 tallaabo oo kooban — adeeg dooro, foom buuxi, kadibna la soco.
                  </p>
                </div>
                <StatusBadge />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {steps.map((st, i) => (
                  <Step key={st.title} index={i + 1} title={st.title} desc={st.desc} />
                ))}
              </div>

              <div className="pulse-soft mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 ring-1 ring-white/10 md:flex-row">
                <div className="text-center md:text-left">
                  <div className="text-sm font-extrabold text-white">
                    Diyaar ma tahay inaad bilowdo?
                  </div>
                  <div className="mt-1 text-xs text-slate-100/80">
                    Dooro adeegga ku habboon, kadib si fudud u gudbi codsigaaga.
                  </div>
                </div>

                <Link
                  to="/services"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#2563EB] hover:bg-[#1D4ED8] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_18px_55px_-34px_rgba(37,99,235,0.55)] ring-1 ring-white/10 transition hover:brightness-110"
                >
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* PublicLayout footer already exists */}
        </div>
      </div>

      {/* ✅ Subtle pulse animation (white glow - khafiif) */}
      <style>
        {`
          .pulse-soft {
            animation: apPulseSoft 2.6s ease-in-out infinite;
          }
          @keyframes apPulseSoft {
            0%,100% {
              box-shadow: 0 0 0 1px rgba(255,255,255,0.10),
                          0 0 14px rgba(255,255,255,0.03);
            }
            50% {
              box-shadow: 0 0 0 1px rgba(255,255,255,0.18),
                          0 0 22px rgba(255,255,255,0.06);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .pulse-soft { animation: none !important; }
          }
        `}
      </style>
    </div>
  );
}