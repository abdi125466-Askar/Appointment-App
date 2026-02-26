// import { Outlet, useLocation, Link } from "react-router-dom";
// import PublicHeader from "./PublicHeader";

// // backgrounds (✅ mp4)
// import bgHome from "../assets/landing/bg-home.mp4";
// import bgServices from "../assets/landing/bg-services.mp4";
// import bgTrack from "../assets/landing/bg-track.mp4";
// import bgAbout from "../assets/landing/bg-about.mp4";

// export default function PublicLayout() {
//   const { pathname } = useLocation();

//   const bgMap = {
//     "/": bgHome,
//     "/services": bgServices,
//     "/track": bgTrack,
//     "/about": bgAbout,
//     "/privacy": bgAbout,
//     "/terms": bgAbout,
//     "/support": bgAbout,
//     "/unauthorized": bgAbout,
//     "/book": bgServices,
//   };

//   const currentBg = bgMap[pathname] || bgHome;

//   return (
//     <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#020617] text-slate-100">
//       {/* ✅ VIDEO BACKGROUND */}
//       <video
//         key={currentBg} // ✅ refresh video when route changes
//         className="absolute inset-0 w-full h-full object-cover z-0"
//         src={currentBg}
//         autoPlay
//         muted
//         loop
//         playsInline
//       />

//       {/* Dark premium overlay */}
//       <div className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/90" />

//       {/* Soft vignette / glow */}
//       <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none z-[1]" />
//       <div className="absolute -bottom-28 -left-28 w-[520px] h-[520px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none z-[1]" />

//       {/* Header */}
//       <div className="relative z-10">
//         <PublicHeader />
//       </div>

//       {/* Content */}
//       <main className="relative z-10 flex-1 min-h-0">
//         <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 py-10 sm:py-12">
//           <Outlet />
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="relative z-10 border-t border-white/10">
//         <div className="bg-slate-950/70 backdrop-blur-xl">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
//             <p className="text-xs sm:text-sm font-semibold text-slate-300 text-center md:text-left">
//               © {new Date().getFullYear()} Appointify — Smart Booking System
//             </p>

//             <div className="flex flex-wrap items-center justify-center gap-2">
//               {[
//                 { t: "Privacy", to: "/privacy" },
//                 { t: "Terms", to: "/terms" },
//                 { t: "Support", to: "/support" },
//               ].map((x) => (
//                 <Link
//                   key={x.t}
//                   to={x.to}
//                   className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold
//                              text-slate-200 bg-white/5 border border-white/10
//                              hover:bg-white/10 hover:text-blue-300 transition"
//                 >
//                   {x.t}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

import { Outlet, Link } from "react-router-dom";
import PublicHeader from "./PublicHeader";

export default function PublicLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">

      {/* Header */}
      <div className="bg-[#4B5563] shrink-0">
        <PublicHeader />
      </div>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#4B5563] shrink-0">
        <div className="mx-auto max-w-[1600px] px-8 sm:px-12 lg:px-20 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <p className="text-sm font-semibold text-white">
            © {new Date().getFullYear()} Appointify — Smart Booking System
          </p>

          <div className="flex items-center gap-6">
            {[
              { t: "Privacy", to: "/privacy" },
              { t: "Terms", to: "/terms" },
              { t: "Support", to: "/support" },
            ].map((x) => (
              <Link
                key={x.t}
                to={x.to}
                className="text-sm font-semibold text-white hover:text-blue-300 transition"
              >
                {x.t}
              </Link>
            ))}
          </div>

        </div>
      </footer>
    </div>
  );
}