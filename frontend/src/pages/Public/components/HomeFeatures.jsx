import { CheckCircle2, MapPin, Radar, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Ballan Degdeg ah",
    desc: "Dooro adeegga, buuxi foomka, kadibna hel ballan jadwal cad leh.",
    icon: CheckCircle2,
  },
  {
    title: "Meel & Waqti La Qorsheeyey",
    desc: "Appointify waxay kuu qorshaysaa waqtiga saxda ah ee aad imanayso.",
    icon: MapPin,
  },
  {
    title: "Tracking ID",
    desc: "La soco codsigaaga adigoo adeegsanaya Tracking ID (Track page).",
    icon: Radar,
  },
  {
    title: "Hab-maamul Nadiif ah",
    desc: "Nidaam cad: Pending → Approved → Completed (si hufan).",
    icon: ShieldCheck,
  },
];

export default function HomeFeatures() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
      {features.map((f, i) => {
        const Icon = f.icon;
        return (
          <div
            key={i}
            className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl shadow-xl p-6
                       hover:bg-white/12 transition hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-200/20 flex items-center justify-center shrink-0">
                <Icon className="text-emerald-100" size={22} />
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-extrabold text-white">
                  {f.title}
                </h3>
                <p className="mt-1 text-white/80 font-semibold text-sm md:text-base leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}