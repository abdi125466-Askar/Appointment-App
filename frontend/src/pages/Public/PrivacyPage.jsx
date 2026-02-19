export default function PrivacyPage() {
  return (
    <main className="relative flex-1 w-full overflow-hidden">
      <div className="absolute inset-0 bg-white/35 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-8 py-10 md:py-14">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="mt-3 text-white/80 font-semibold max-w-2xl mx-auto">
            Waxaan ilaalinaa xogtaada si ammaan ah oo waafaqsan nidaamka Appointify.
          </p>
        </div>

        <div className="mt-8 rounded-[28px] bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl shadow-black/20 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-500" />
          <div className="p-6 md:p-8 text-white/85">
            <h2 className="text-xl md:text-2xl font-black text-white">Sida aan u maareyno xogta</h2>
            <p className="mt-3 font-semibold text-white/80">
              (Halkaan ku qor faahfaahintaada haddii aad rabto.)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
