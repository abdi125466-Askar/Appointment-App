import { Mail, Phone, MessageCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <main className="relative flex-1 overflow-hidden w-full">
      <div className="absolute inset-0 bg-white/35 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-8 py-10 md:py-14">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Support
          </h1>
          <p className="mt-3 text-slate-700 font-semibold max-w-2xl mx-auto">
            Haddii aad qabto dhibaato ama su’aal, halkan ka hel caawimaad.
          </p>
        </div>

        <div className="mt-8 rounded-[28px] bg-white/60 border border-white/70 backdrop-blur-xl shadow-xl shadow-slate-900/10 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-sky-500" />

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SupportCard icon={<Mail size={18} />} title="Email" text="support@appointify.com" />
              <SupportCard icon={<Phone size={18} />} title="Phone" text="+252 63 000 0000" />
              <SupportCard icon={<MessageCircle size={18} />} title="Live Help" text="Chat / Ticket (soon)" />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 p-4">
              <p className="text-sm md:text-[15px] font-semibold text-slate-700 leading-relaxed">
                Talo: Tracking page-ka waxaad gelisaa <span className="font-black">Appointment ID</span> (ObjectId),
                tusaale: <span className="font-black">69943511355485cf07518640</span>.
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
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm p-4 md:p-5">
      <div className="inline-flex items-center gap-2 text-slate-900 font-black">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/5 border border-slate-200/70">
          {icon}
        </span>
        {title}
      </div>
      <p className="mt-2 text-[13.5px] md:text-sm font-semibold text-slate-700">
        {text}
      </p>
    </div>
  );
}
