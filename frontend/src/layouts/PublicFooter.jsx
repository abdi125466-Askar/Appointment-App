export default function PublicFooter() {
  return (
    <footer className="mt-auto">
      <div className="h-[2px] bg-gradient-to-r from-emerald-400 via-sky-400 to-blue-600 opacity-70" />

      <div className="bg-white/60 backdrop-blur-md border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs font-bold text-slate-500">
          <p>© {new Date().getFullYear()} Appointify. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="hover:text-slate-700 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-700 cursor-pointer">Terms</span>
            <span className="hover:text-slate-700 cursor-pointer">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
