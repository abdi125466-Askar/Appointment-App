// frontend/src/pages/Public/AboutPage.jsx
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

/** ====== Small UI ====== */
const StatusBadge = () => (
  <div className="inline-flex items-center gap-2 rounded-2xl border border-sky-400/60 bg-slate-900/30 px-3 py-2 text-xs font-bold text-white shadow-[0_10px_30px_-18px_rgba(56,189,248,0.55)] ring-1 ring-sky-400/30 backdrop-blur-xl">
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/60 bg-amber-500/15 px-2 py-1 text-amber-100">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Pending
    </span>
    <span className="text-slate-200/80">→</span>
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/60 bg-emerald-500/15 px-2 py-1 text-emerald-100">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      Approved
    </span>
    <span className="text-slate-200/80">→</span>
    <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/60 bg-sky-500/15 px-2 py-1 text-sky-100">
      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
      Completed
    </span>
  </div>
);

const Stat = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-sky-400/35 bg-slate-900/25 px-5 py-4 shadow-[0_18px_60px_-40px_rgba(2,132,199,0.65)] ring-1 ring-emerald-400/15 backdrop-blur-xl transition hover:border-sky-400/55 hover:bg-slate-900/30">
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-400/35 bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-indigo-500/20 shadow-[0_0_22px_rgba(16,185,129,0.18)]">
        <Icon className="h-5 w-5 text-white/90" />
      </span>
      <div className="min-w-0">
        <div className="text-sm text-slate-100/80">{label}</div>
        <div className="text-xl font-extrabold tracking-tight text-white">{value}</div>
      </div>
    </div>
  </div>
);

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="rounded-2xl border border-sky-400/30 bg-slate-900/25 p-5 shadow-[0_18px_60px_-45px_rgba(2,132,199,0.55)] ring-1 ring-emerald-400/12 backdrop-blur-xl transition hover:border-sky-400/50 hover:bg-slate-900/30">
    <div className="flex items-start gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-emerald-400/35 bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-indigo-500/20">
        <Icon className="h-5 w-5 text-white/90" />
      </span>
      <div>
        <div className="text-base font-bold text-white">{title}</div>
        <p className="mt-1 text-sm leading-6 text-slate-100/80">{desc}</p>
      </div>
    </div>
  </div>
);

const Step = ({ index, title, desc }) => (
  <div className="relative rounded-2xl border border-emerald-400/22 bg-slate-900/25 p-5 ring-1 ring-sky-400/12 shadow-[0_18px_55px_-45px_rgba(16,185,129,0.35)] backdrop-blur-xl transition hover:border-emerald-400/38 hover:bg-slate-900/30">
    <div className="flex items-start gap-4">
      <div className="grid h-10 w-10 place-items-center rounded-xl border border-sky-400/35 bg-sky-500/10 text-white font-extrabold shadow-[0_0_20px_rgba(56,189,248,0.15)]">
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
    { icon: BadgeCheck, title: "Ballan Degdeg ah", desc: "Dooro adeegga aad rabto, buuxi foomka, kadibna hel ballan rasmi ah oo leh jadwal cad." },
    { icon: MapPin, title: "Meel & Waqti La Qorsheeyey", desc: "Ka fogow safaf iyo ciriiri — Appointify waxay kuu qorshaysaa waqtiga saxda ah ee aad imanayso." },
    { icon: Sparkles, title: "Tracking ID", desc: "La soco xaaladda codsigaaga adigoo adeegsanaya tracking ID gaar ah (Track page)." },
    { icon: CheckCircle2, title: "Hab-maamul Nadiif ah", desc: "Shaqaale iyo Admin waxay maareeyaan ballamaha si nidaamsan: Pending → Approved → Completed." },
  ];

  const steps = [
    { title: "Dooro Adeegga", desc: "Passport, National ID, Driving License iyo adeegyo kale oo public ah." },
    { title: "Buuxi Foomka", desc: "Gali xogtaada, ku lifaaq dukumenti haddii loo baahdo, kadibna dir codsiga." },
    { title: "Hel & La Soco", desc: "Hel tracking ID, kadibna ka eeg status-ka si fudud oo hufan." },
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      {/* overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/35 to-slate-900/55" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-500/18 blur-3xl" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-emerald-500/14 blur-3xl" />
        <div className="absolute left-1/2 bottom-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/14 blur-3xl" />
      </div>

      {/* ✅ CENTER WRAPPER (sida Terms page) */}
      <div className="relative flex justify-center px-6 py-10">
        <div className="w-full max-w-[980px]">
          <div className="rounded-[28px] border border-sky-400/80 bg-slate-900/20 p-6 backdrop-blur-2xl ring-2 ring-sky-400/35 shadow-[0_0_0_1px_rgba(56,189,248,0.35),0_0_55px_rgba(56,189,248,0.22),0_40px_120px_-60px_rgba(0,0,0,0.85)] md:p-10">
            {/* HERO GRID */}
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
              {/* Left */}
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/45 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-50 ring-1 ring-emerald-400/20">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
                    Government Appointment System
                  </div>
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                  About{" "}
                  <span className="inline-flex items-baseline gap-0.5">
                    <span className="text-white">Appoint</span>
                    <span className="text-sky-400 drop-shadow-[0_0_14px_rgba(56,189,248,0.65)]">ify</span>
                  </span>
                </h1>

                <p className="mt-3 text-sm leading-7 text-slate-100/85 md:text-base">
                  Appointify waxay caawisaa muwaadiniinta inay adeegyada dowladda si online ah u qabsadaan,
                  safafka u yareeyaan, ayna si hufan ula socdaan xaaladda codsigooda iyagoo adeegsanaya{" "}
                  <span className="font-semibold text-white">Tracking ID</span>.
                </p>

                <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-50/90 ring-1 ring-emerald-400/20">
                  <span className="font-bold text-white">Hadafkeennu:</span>
                  <span className="mx-2 text-emerald-200/80">—</span>
                  In adeegyada dowladda laga dhigo kuwo <span className="font-semibold">fudud</span>,{" "}
                  <span className="font-semibold">degdeg</span>, iyo <span className="font-semibold">hufan</span> qof walba.
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-[0_16px_45px_-22px_rgba(37,99,235,0.95)] ring-1 ring-white/10 transition hover:brightness-110"
                  >
                    Explore Services <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/track"
                    className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-slate-900/25 px-4 py-2 text-sm font-bold text-white/95 ring-1 ring-sky-400/20 backdrop-blur-xl transition hover:bg-slate-900/35"
                  >
                    Track Request
                  </Link>
                </div>
              </div>

              {/* Right stats */}
              <div className="grid gap-3">
                {stats.map((s) => (
                  <Stat key={s.label} icon={s.icon} label={s.label} value={s.value} />
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {features.map((f) => (
                <Feature key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
              ))}
            </div>

            {/* How it works */}
            <div className="mt-10 rounded-[24px] border border-sky-400/35 bg-slate-900/20 p-6 backdrop-blur-2xl ring-1 ring-sky-400/20 shadow-[0_26px_85px_-55px_rgba(56,189,248,0.35)] md:p-8">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-extrabold text-white">Sida Ay U Shaqayso</h2>
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

              <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-500/12 via-sky-500/10 to-indigo-500/12 p-5 ring-1 ring-emerald-400/15 md:flex-row">
                <div className="text-center md:text-left">
                  <div className="text-sm font-extrabold text-white">Diyaar ma tahay inaad bilowdo?</div>
                  <div className="mt-1 text-xs text-slate-100/80">
                    Dooro adeegga ku habboon, kadib si fudud u gudbi codsigaaga.
                  </div>
                </div>

                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/55 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_18px_55px_-25px_rgba(16,185,129,0.75)] ring-1 ring-white/10 transition hover:brightness-110"
                >
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-slate-200/70">
            © {new Date().getFullYear()} Appointify — Smart Booking System
          </div>
        </div>
      </div>
    </div>
  );
}
