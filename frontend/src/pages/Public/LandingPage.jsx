// // import { Link } from "react-router-dom";
// // import { Search, FileText, ArrowRight } from "lucide-react";

// // export default function LandingPage() {
// //   return (
// //     <section className="relative min-h-[calc(100vh-80px-56px)] flex items-center justify-center px-6 bg-slate-950 overflow-hidden">
// //       {/* Soft Background */}
// //       <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
// //       <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,.28),transparent_55%)] pointer-events-none" />
// //       <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,.18),transparent_60%)] pointer-events-none" />

// //       {/* Center Card */}
// //       <div className="relative z-10 w-full max-w-3xl">
// //         <div className="rounded-[28px] p-[1px] bg-gradient-to-br from-blue-600/35 to-white/10 shadow-[0_30px_70px_rgba(0,0,0,.45)]">
// //           <div className="rounded-[27px] bg-white/5 border border-white/10 backdrop-blur-2xl p-8 md:p-12 text-center">
// //             {/* Small badge */}
// //             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/15 border border-blue-400/25 text-blue-100 font-bold text-sm mb-6">
// //               <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
// //               Appointment System
// //             </div>

// //             {/* TITLE */}
// //             <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
// //               KA QABSO BALANTAADA HALKAN 
// //             </h1>

// //             {/* SUBTITLE */}
// //             <p className="mt-5 text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
// //               Si fudud u qabso ballantaada, lana soco dhaqdhaqaaqa codsigaaga.
// //             </p>

// //             {/* BUTTONS */}
// //             <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
// //               <Link
// //                 to="/services"
// //                 className="
// //                   group inline-flex items-center justify-center gap-2
// //                   px-7 py-4 rounded-2xl
// //                   bg-gradient-to-r from-blue-600 to-blue-700
// //                   text-white font-extrabold text-lg
// //                   shadow-lg shadow-blue-600/20
// //                   transition-all duration-300
// //                   hover:-translate-y-1 hover:brightness-110
// //                   focus:outline-none focus:ring-2 focus:ring-blue-400/60
// //                 "
// //               >
// //                 <FileText size={20} />
// //                 Services
// //                 <ArrowRight
// //                   size={18}
// //                   className="transition-transform duration-300 group-hover:translate-x-1"
// //                 />
// //               </Link>

// //               <Link
// //                 to="/track"
// //                 className="
// //                   group inline-flex items-center justify-center gap-2
// //                   px-7 py-4 rounded-2xl
// //                   border border-white/20 bg-white/5
// //                   text-white font-extrabold text-lg
// //                   transition-all duration-300
// //                   hover:-translate-y-1 hover:bg-white/10
// //                   focus:outline-none focus:ring-2 focus:ring-white/30
// //                 "
// //               >
// //                 <Search size={20} />
// //                 Track
// //                 <ArrowRight
// //                   size={18}
// //                   className="transition-transform duration-300 group-hover:translate-x-1"
// //                 />
// //               </Link>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Small footer hint (optional, simple) */}
// //         <p className="mt-6 text-center text-slate-400 font-semibold text-sm">
// //           Door “Services” si aad u bilowdo, ama “Track” si aad u hubiso status-ka.
// //         </p>
// //       </div>
// //     </section>
// //   );
// // }

// import { Link, useLocation } from "react-router-dom";
// import { useEffect } from "react";

// import girlImg from "../../assets/landing/landing-page.png";
// import bgVideo from "../../assets/landing/bg-home.mp4";

// export default function LandingPage() {
//   const location = useLocation();

//   useEffect(() => {
//     if (location.pathname === "/") document.body.style.overflow = "hidden";
//     return () => (document.body.style.overflow = "");
//   }, [location.pathname]);

//   return (
//     <section className="hero-glow relative w-full h-full overflow-hidden">
//       {/* Background video */}
//       <video
//         className="absolute inset-0 w-full h-full object-cover -z-30 scale-[1.05]"
//         src={bgVideo}
//         autoPlay
//         loop
//         muted
//         playsInline
//       />

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/35 -z-20" />

//       <div className="relative z-10 w-full h-full px-6 sm:px-10 lg:px-16">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full items-end">

//           {/* Left */}
//           <div className="space-y-7 lg:pb-16">
//             <div className="pt-1 relative z-20">
//               <Link
//                 to="/services"
//                 className="
//                   btn-glow relative inline-flex items-center justify-center rounded-full
//                   px-12 py-4 text-xl font-extrabold text-white
//                   bg-[#2563EB]/30 border border-[#3B82F6]/45
//                   shadow-xl shadow-[#2563EB]/30
//                   transition
//                 "
//               >
//                 <span className="absolute -inset-[3px] rounded-full glow-ring" />
//                 <span className="btn-shine absolute inset-0 rounded-full" />
//                 <span className="relative z-10">Book Now!</span>
//               </Link>
//             </div>
//           </div>

//           {/* Right */}
//           <div className="relative h-full flex justify-center lg:justify-end items-end">
//             <div
//               className="absolute -z-10 right-0 bottom-28 h-[560px] w-[560px] rounded-full blur-3xl opacity-70 animate-pulse-soft"
//               style={{
//                 background:
//                   "radial-gradient(circle at 40% 35%, rgba(59,130,246,0.55), transparent 65%)",
//               }}
//             />

//             <img
//               src={girlImg}
//               alt="Hero"
//               draggable="false"
//               className="relative object-contain max-w-none pointer-events-none"
//               style={{
//                 width: "1100px",
//                 transform: "translateX(90px)",
//                 marginBottom: "8px",
//               }}
//             />

//             <div
//               className="
//                 absolute bottom-0 left-1/2 -translate-x-1/2
//                 w-[1000px] h-24
//                 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55),transparent_72%)]
//                 blur-2xl opacity-70
//               "
//             />
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .hero-glow {
//           position: relative;
//         }

//         .hero-glow::before {
//           content: "";
//           position: absolute;
//           inset: 8px;
//           border-radius: 18px;
//           border: 1px solid rgba(59,130,246,0.35);
//           box-shadow:
//             0 0 20px rgba(59,130,246,0.3),
//             0 0 80px rgba(59,130,246,0.2);
//           pointer-events: none;
//           animation: borderGlow 3s ease-in-out infinite;
//         }

//         @keyframes borderGlow {
//           0%,100% {
//             box-shadow:
//               0 0 10px rgba(59,130,246,0.2),
//               0 0 40px rgba(59,130,246,0.15);
//           }
//           50% {
//             box-shadow:
//               0 0 35px rgba(96,165,250,0.7),
//               0 0 120px rgba(59,130,246,0.35);
//           }
//         }

//         /* Button hover */
//         .btn-glow {
//           transform: translateY(0);
//           transition: transform .25s ease, box-shadow .25s ease, background .25s ease, border-color .25s ease;
//           overflow: hidden;
//         }

//         .btn-glow:hover {
//           transform: translateY(-2px) scale(1.03);
//           background: rgba(37, 99, 235, 0.40);
//           border-color: rgba(96,165,250,0.75);
//           box-shadow:
//             0 18px 45px rgba(37,99,235,0.35),
//             0 0 28px rgba(96,165,250,0.45);
//         }

//         .btn-shine {
//           pointer-events: none;
//           background: linear-gradient(110deg,
//             transparent 0%,
//             rgba(255,255,255,0.15) 35%,
//             rgba(255,255,255,0.25) 50%,
//             rgba(255,255,255,0.12) 65%,
//             transparent 100%);
//           transform: translateX(-120%);
//           transition: transform .6s ease;
//           opacity: 0.9;
//         }

//         .btn-glow:hover .btn-shine {
//           transform: translateX(120%);
//         }

//         .glow-ring {
//           pointer-events: none;
//           border: 2px solid rgba(59,130,246,0.35);
//           animation: ringPulse 1.7s ease-in-out infinite;
//         }

//         @keyframes ringPulse {
//           0%,100% { opacity: 0.35; }
//           50% { opacity: 1; box-shadow: 0 0 25px rgba(59,130,246,0.6); }
//         }

//         @keyframes pulseSoft {
//           0%,100% { opacity: 0.7; transform: scale(1); }
//           50% { opacity: 1; transform: scale(1.04); }
//         }

//         .animate-pulse-soft {
//           animation: pulseSoft 3.2s ease-in-out infinite;
//         }

//         @media (prefers-reduced-motion: reduce) {
//           * {
//             animation: none !important;
//             transition: none !important;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }

import { Link } from "react-router-dom";
import girlImg from "../../assets/landing/landing-page.png";
import arrowImg from "../../assets/landing/arrow.png";

export default function LandingPage() {
  return (
    <section className="relative min-h-screen w-full bg-gradient-to-br from-[#EAF2FF] via-[#F5F9FF] to-white overflow-hidden">

      {/* Soft background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-20 flex items-center min-h-screen">

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center w-full">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-6 space-y-8 z-10">

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1] tracking-tight text-[#2563EB]">
              Easy <br />
              scheduling <br />
              ahead
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-[520px] leading-relaxed font-medium">
              Book your appointment effortlessly and monitor the progress of your application in real time.
            </p>

            <Link
              to="/services"
              className="inline-flex items-center justify-center px-10 py-4 rounded-2xl
                         text-lg font-bold text-white bg-gradient-to-r 
                         from-[#2563EB] to-[#4F46E5]
                         shadow-xl hover:shadow-2xl 
                         transition-all duration-300 hover:scale-105"
            >
              Book Now!
            </Link>

          </div>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="absolute bottom-0 right-0 h-full flex items-end">

        <img
          src={arrowImg}
          alt=""
          className="absolute right-[20%] top-[15%] w-[400px] opacity-20 pointer-events-none"
        />

        <img
          src={girlImg}
          alt="Hero"
          draggable="false"
          className="h-[95%] object-contain drop-shadow-2xl"
        />
      </div>

    </section>
  );
}