import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-6 sm:p-8 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white/5 border border-white/10">
          <Lock className="text-blue-300" size={22} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Unauthorized
        </h1>

        <p className="mt-2 text-slate-300 font-semibold">
          Ma lihid rukhsad (permission) aad ku gasho page-kan.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-blue-600 to-blue-700 hover:brightness-110 transition"
          >
            Back to Home
          </Link>

          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl font-semibold text-slate-200
                       bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}