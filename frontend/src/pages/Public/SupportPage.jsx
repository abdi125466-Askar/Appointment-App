import { Mail, Phone, MessageCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <main className="relative flex-1 overflow-hidden w-full">
      <div className="absolute inset-0 bg-slate-950/55 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-8 py-10 md:py-14">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Support
          </h1>
          <p className="mt-3 text-slate-200/85 font-semibold max-w-2xl mx-auto">
            Haddii aad qabto dhibaato ama su’aal, halkan ka hel caawimaad.
          </p>
        </div>

        <div className="mt-8 rounded-[28px] bg-white/5 border border-white/12 backdrop-blur-2xl shadow-2xl shadow-black/35 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-700 to-indigo-600" />

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SupportCard
                icon={<Mail size={18} />}
                title="Email"
                text="support@appointify.com"
              />
              <SupportCard
                icon={<Phone size={18} />}
                title="Phone"
                text="+252 63 000 0000"
              />
              <SupportCard
                icon={<MessageCircle size={18} />}
                title="Live Help"
                text="Chat / Ticket (soon)"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-[0_22px_70px_-55px_rgba(37,99,235,0.40)]">
              <p className="text-sm md:text-[15px] font-semibold text-slate-200/85 leading-relaxed">
                Talo: Track page-ka waxaad gelisaa{" "}
                <span className="font-black text-white">Appointment ID</span>{" "}
                (ObjectId), tusaale:{" "}
                <span className="font-black text-white">69943511355485cf07518640</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SupportCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_22px_70px_-55px_rgba(37,99,235,0.45)] p-4 md:p-5 transition hover:bg-white/7 hover:border-white/14">
      <div className="inline-flex items-center gap-2 text-white font-black">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10">
          <span className="text-blue-200">{icon}</span>
        </span>
        {title}
      </div>
      <p className="mt-2 text-[13.5px] md:text-sm font-semibold text-slate-200/85">
        {text}
      </p>
    </div>
  );
}