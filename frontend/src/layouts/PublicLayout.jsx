// white brown Baground

// import { Outlet, useLocation, Link } from "react-router-dom";
// import PublicHeader from "./PublicHeader";

// // backgrounds
// import bgHome from "../assets/landing/bg-home.png";
// import bgServices from "../assets/landing/bg-services.png";
// import bgTrack from "../assets/landing/bg-track.png";
// import bgAbout from "../assets/landing/bg-about.png";

// export default function PublicLayout() {
//   const { pathname } = useLocation();

//   const bgMap = {
//     "/": bgHome,
//     "/services": bgServices,
//     "/track": bgTrack,
//     "/about": bgAbout,
//   };

//   const currentBg = bgMap[pathname] || bgHome;

//   const overlayClass =
//     pathname === "/"
//       ? "bg-black/45 backdrop-blur-[1px]"
//       : "bg-white/30 backdrop-blur-[1px]";

//   return (
//     <div
//       className="relative min-h-screen flex flex-col overflow-hidden"
//       style={{
//         backgroundImage: `url(${currentBg})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* overlay */}
//       <div className={`absolute inset-0 pointer-events-none z-0 ${overlayClass}`} />

//       {/* Header */}
//       <div className="relative z-10">
//         <PublicHeader />
//       </div>

//       {/* Content */}
//       <main className="relative z-10 flex-1 min-h-0">
//         <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6">
//           <Outlet />
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="relative z-10 border-t border-white/10">
//         <div className="bg-gradient-to-r from-slate-950 via-slate-900/95 to-emerald-950/80 backdrop-blur-xl">
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
//                   className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-emerald-300 transition"
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


// Blue Baground

// import { Outlet, useLocation, Link } from "react-router-dom";
// import PublicHeader from "./PublicHeader";

// // backgrounds
// import bgHome from "../assets/landing/bg-home.png";
// import bgServices from "../assets/landing/bg-services.png";
// import bgTrack from "../assets/landing/bg-track.png";
// import bgAbout from "../assets/landing/bg-about.png";

// export default function PublicLayout() {
//   const { pathname } = useLocation();

//   const bgMap = {
//     "/": bgHome,
//     "/services": bgServices,
//     "/track": bgTrack,
//     "/about": bgAbout,
//   };

//   const currentBg = bgMap[pathname] || bgHome;

//   // ✅ Blue overlay: Home = dark navy, Others = blue glass
//   const overlayClass =
//     pathname === "/"
//       ? "bg-slate-950/55 backdrop-blur-[1px]"
//       : "bg-blue-950/35 backdrop-blur-[2px]";

//   return (
//     <div
//       className="relative min-h-screen flex flex-col overflow-hidden"
//       style={{
//         backgroundImage: `url(${currentBg})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* ✅ overlay (blue animated gradient) */}
//       <div className={`absolute inset-0 pointer-events-none z-0 ${overlayClass}`}>
//         <div className="absolute inset-0 publicBlueOverlayAnim" />
//       </div>

//       {/* Header */}
//       <div className="relative z-10">
//         <PublicHeader />
//       </div>

//       {/* Content */}
//       <main className="relative z-10 flex-1 min-h-0">
//         <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6">
//           <Outlet />
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="relative z-10 border-t border-white/10">
//         <div className="bg-gradient-to-r from-slate-950 via-slate-900/95 to-emerald-950/80 backdrop-blur-xl">
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
//                   className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-emerald-300 transition"
//                 >
//                   {x.t}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </footer>

//       {/* ✅ Inline CSS (si aan file kale kuu qasbin) */}
//       <style>{`
//         .publicBlueOverlayAnim{
//           background: linear-gradient(
//             120deg,
//             rgba(2,132,199,.32),
//             rgba(37,99,235,.30),
//             rgba(14,165,233,.26),
//             rgba(99,102,241,.22)
//           );
//           background-size: 300% 300%;
//           animation: publicBlueMove 10s ease-in-out infinite;
//           mix-blend-mode: screen;
//           opacity: .9;
//         }

//         @keyframes publicBlueMove{
//           0%{ background-position: 0% 50%; }
//           50%{ background-position: 100% 50%; }
//           100%{ background-position: 0% 50%; }
//         }
//       `}</style>
//     </div>
//   );
// }

// green baground

// import { Outlet, useLocation, Link } from "react-router-dom";
// import PublicHeader from "./PublicHeader";

// // backgrounds
// import bgHome from "../assets/landing/bg-home.png";
// import bgServices from "../assets/landing/bg-services.png";
// import bgTrack from "../assets/landing/bg-track.png";
// import bgAbout from "../assets/landing/bg-about.png";

// export default function PublicLayout() {
//   const { pathname } = useLocation();

//   const bgMap = {
//     "/": bgHome,
//     "/services": bgServices,
//     "/track": bgTrack,
//     "/about": bgAbout,
//   };

//   const currentBg = bgMap[pathname] || bgHome;

//   // ✅ Green overlay
//   const overlayClass =
//     pathname === "/"
//       ? "bg-emerald-950/55 backdrop-blur-[2px]"
//       : "bg-emerald-900/40 backdrop-blur-[2px]";

//   return (
//     <div
//       className="relative min-h-screen flex flex-col overflow-hidden"
//       style={{
//         backgroundImage: `url(${currentBg})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* Green overlay */}
//       <div className={`absolute inset-0 pointer-events-none z-0 ${overlayClass}`} />

//       {/* Header */}
//       <div className="relative z-10">
//         <PublicHeader />
//       </div>

//       {/* Content */}
//       <main className="relative z-10 flex-1 min-h-0">
//         <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6">
//           <Outlet />
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="relative z-10 border-t border-emerald-300/20">
//         <div className="bg-gradient-to-r from-emerald-950 via-emerald-900/90 to-teal-900/80 backdrop-blur-xl">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
//             <p className="text-xs sm:text-sm font-semibold text-emerald-200 text-center md:text-left">
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
//                   className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold text-emerald-100 bg-emerald-800/40 border border-emerald-400/30 hover:bg-emerald-700/50 hover:text-white transition"
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

// white baground

import { Outlet, useLocation, Link } from "react-router-dom";
import PublicHeader from "./PublicHeader";

// backgrounds
import bgHome from "../assets/landing/bg-home.png";
import bgServices from "../assets/landing/bg-services.png";
import bgTrack from "../assets/landing/bg-track.png";
import bgAbout from "../assets/landing/bg-about.png";

export default function PublicLayout() {
  const { pathname } = useLocation();

  const bgMap = {
    "/": bgHome,
    "/services": bgServices,
    "/track": bgTrack,
    "/about": bgAbout,
  };

  const currentBg = bgMap[pathname] || bgHome;

  // ✅ White overlay
  const overlayClass =
    pathname === "/"
      ? "bg-white/70 backdrop-blur-[2px]"
      : "bg-white/60 backdrop-blur-[2px]";

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${currentBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* White overlay */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${overlayClass}`} />

      {/* Header */}
      <div className="relative z-10">
        <PublicHeader />
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 min-h-0">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/40">
        <div className="bg-white/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm font-semibold text-slate-600 text-center md:text-left">
              © {new Date().getFullYear()} Appointify — Smart Booking System
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { t: "Privacy", to: "/privacy" },
                { t: "Terms", to: "/terms" },
                { t: "Support", to: "/support" },
              ].map((x) => (
                <Link
                  key={x.t}
                  to={x.to}
                  className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:text-blue-600 transition"
                >
                  {x.t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}