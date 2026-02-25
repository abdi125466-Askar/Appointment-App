// import { Link } from "react-router-dom";
// import { Search, FileText, ArrowRight } from "lucide-react";

// export default function LandingPage() {
//   return (
//     <section className="relative min-h-[calc(100vh-80px-56px)] flex items-center justify-center px-6 bg-slate-950 overflow-hidden">
//       {/* Soft Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,.28),transparent_55%)] pointer-events-none" />
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,.18),transparent_60%)] pointer-events-none" />

//       {/* Center Card */}
//       <div className="relative z-10 w-full max-w-3xl">
//         <div className="rounded-[28px] p-[1px] bg-gradient-to-br from-blue-600/35 to-white/10 shadow-[0_30px_70px_rgba(0,0,0,.45)]">
//           <div className="rounded-[27px] bg-white/5 border border-white/10 backdrop-blur-2xl p-8 md:p-12 text-center">
//             {/* Small badge */}
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/15 border border-blue-400/25 text-blue-100 font-bold text-sm mb-6">
//               <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
//               Appointment System
//             </div>

//             {/* TITLE */}
//             <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
//               KA QABSO BALANTAADA HALKAN 
//             </h1>

//             {/* SUBTITLE */}
//             <p className="mt-5 text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
//               Si fudud u qabso ballantaada, lana soco dhaqdhaqaaqa codsigaaga.
//             </p>

//             {/* BUTTONS */}
//             <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
//               <Link
//                 to="/services"
//                 className="
//                   group inline-flex items-center justify-center gap-2
//                   px-7 py-4 rounded-2xl
//                   bg-gradient-to-r from-blue-600 to-blue-700
//                   text-white font-extrabold text-lg
//                   shadow-lg shadow-blue-600/20
//                   transition-all duration-300
//                   hover:-translate-y-1 hover:brightness-110
//                   focus:outline-none focus:ring-2 focus:ring-blue-400/60
//                 "
//               >
//                 <FileText size={20} />
//                 Services
//                 <ArrowRight
//                   size={18}
//                   className="transition-transform duration-300 group-hover:translate-x-1"
//                 />
//               </Link>

//               <Link
//                 to="/track"
//                 className="
//                   group inline-flex items-center justify-center gap-2
//                   px-7 py-4 rounded-2xl
//                   border border-white/20 bg-white/5
//                   text-white font-extrabold text-lg
//                   transition-all duration-300
//                   hover:-translate-y-1 hover:bg-white/10
//                   focus:outline-none focus:ring-2 focus:ring-white/30
//                 "
//               >
//                 <Search size={20} />
//                 Track
//                 <ArrowRight
//                   size={18}
//                   className="transition-transform duration-300 group-hover:translate-x-1"
//                 />
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Small footer hint (optional, simple) */}
//         <p className="mt-6 text-center text-slate-400 font-semibold text-sm">
//           Door “Services” si aad u bilowdo, ama “Track” si aad u hubiso status-ka.
//         </p>
//       </div>
//     </section>
//   );
// }

import { Link } from "react-router-dom";
import { Search, FileText, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 bg-transparent overflow-hidden">
      {/* Container - Slightly lifted upward for perfect center balance */}
      <div className="relative z-10 w-full max-w-5xl text-center -mt-10 sm:-mt-14 md:-mt-16">
        {/* Hero Panel (only background area) */}
        <div
          className="
            relative mx-auto w-full max-w-3xl
            rounded-2xl
            bg-[#0F172A]/22 backdrop-blur-md
            border border-white/10
            shadow-xl
            px-5 sm:px-10 py-10 sm:py-12
          "
        >
          {/* Corner accents */}
          <span className="pointer-events-none absolute -top-[1px] -left-[1px] h-9 w-9 border-t border-l border-white/20 rounded-tl-2xl" />
          <span className="pointer-events-none absolute -top-[1px] -right-[1px] h-9 w-9 border-t border-r border-white/20 rounded-tr-2xl" />
          <span className="pointer-events-none absolute -bottom-[1px] -left-[1px] h-9 w-9 border-b border-l border-white/20 rounded-bl-2xl" />
          <span className="pointer-events-none absolute -bottom-[1px] -right-[1px] h-9 w-9 border-b border-r border-white/20 rounded-br-2xl" />

          {/* Title */}
          <h1 className="title-message text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#F8FAFC] tracking-tight">
            BOOK YOUR APPOINTMENT HERE
          </h1>

          {/* Subtitle */}
          <div className="mt-5 sm:mt-6 flex justify-center">
            <p
              className="
                inline-flex items-center justify-center
                px-4 sm:px-6 py-3 rounded-2xl
                border border-white/15
                bg-white/5
                text-[#E2E8F0] text-sm sm:text-base md:text-lg
                font-medium leading-relaxed
                max-w-2xl
              "
            >
              Easily book your appointment and track your request status.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
            {/* Services */}
            <Link
              to="/services"
              className="
                group relative inline-flex items-center justify-center gap-2
                h-12 px-7 sm:px-8 rounded-2xl
                bg-[#2563EB] hover:bg-[#1D4ED8]
                text-white font-extrabold text-sm sm:text-base
                shadow-xl shadow-[#2563EB]/25
                transition-all duration-300 ease-out
                hover:scale-[1.03]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]
              "
            >
              <span className="pointer-events-none absolute -inset-[1px] rounded-2xl border border-white/25" />
              <FileText size={18} />
              View Services
              <ArrowRight
                size={18}
                className="arrow-float transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* Track */}
            <Link
              to="/track"
              className="
                group relative inline-flex items-center justify-center gap-2
                h-12 px-7 sm:px-8 rounded-2xl
                bg-white/5 hover:bg-white/10
                border border-white/20
                text-white font-extrabold text-sm sm:text-base
                backdrop-blur-md
                transition-all duration-300 ease-out
                hover:scale-[1.03]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]
              "
            >
              <span className="pointer-events-none absolute -inset-[1px] rounded-2xl border border-white/25" />
              <Search size={18} />
              Track Appointment
              <ArrowRight
                size={18}
                className="arrow-float transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Tracking & Status */}
          <div className="mt-7 sm:mt-8 flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/12 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
              <span className="text-xs text-[#94A3B8] font-semibold">
                Tracking ID
              </span>
              <span className="text-xs text-[#F8FAFC] font-bold">
                APP-2026-001
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/12 backdrop-blur-md flex-wrap justify-center">
              <span className="text-xs text-[#94A3B8] font-semibold">Status</span>

              <span className="status-pulse px-3 py-1 text-[11px] rounded-full bg-white/10 text-[#F8FAFC] border border-white/15 font-bold">
                Pending
              </span>

              <span className="status-pulse-approved px-3 py-1 text-[11px] rounded-full bg-[#10B981]/18 text-[#10B981] border border-[#10B981]/35 font-bold">
                Approved
              </span>

              <span className="status-pulse-completed px-3 py-1 text-[11px] rounded-full bg-[#2563EB]/16 text-[#3B82F6] border border-[#2563EB]/30 font-bold">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          .title-message {
            animation: apMessageIn 650ms ease-out both;
          }
          @keyframes apMessageIn {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .arrow-float {
            animation: apArrow 1.8s ease-in-out infinite;
          }
          @keyframes apArrow {
            0%,100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
          }

          .status-pulse,
          .status-pulse-approved,
          .status-pulse-completed {
            animation: apPulseGlow 1.6s ease-in-out infinite;
          }

          @keyframes apPulseGlow {
            0%,100% { filter: brightness(1); }
            50% { filter: brightness(1.3); }
          }

          @media (prefers-reduced-motion: reduce) {
            .title-message,
            .arrow-float,
            .status-pulse,
            .status-pulse-approved,
            .status-pulse-completed {
              animation: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}