// import { Link } from "react-router-dom";
// import { CalendarDays, Search } from "lucide-react";
// import hero from "../../assets/landing/hero.png";

// export default function LandingPage() {
//   return (
//     <section className="relative h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-hidden">

//       {/* Soft overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-800/40 to-emerald-900/30 pointer-events-none" />

//       {/* Center Wrapper */}
//       <div className="relative w-full max-w-7xl px-6 translate-y-3">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

//           {/* LEFT BOX */}
//           <div className="rounded-[32px] bg-gradient-to-br from-sky-500 via-blue-600 to-emerald-500
//                           border border-white/20 backdrop-blur-2xl 
//                           shadow-2xl p-8 md:p-10 h-[430px] flex flex-col justify-center">

//             {/* Title */}
//             <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
//               Ballan Casri ah
//             </h1>

//             <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white/90">
//               Adeegyada Dowladda
//             </h2>

//             {/* Sub Text */}
//             <p className="mt-5 text-white font-semibold text-base border border-black/30 
//                           bg-black/20 rounded-xl px-4 py-2 backdrop-blur-md">
//               Si ammaan ah u qabso ballan — la soco codsigaaga Tracking ID.
//             </p>

//             {/* FEATURE CHIPS */}
//             <div className="mt-5 flex flex-wrap gap-3">

//               {/* Ballan */}
//               <span className="px-4 py-2 rounded-xl bg-sky-500/20 border border-sky-300/30 
//                                text-sky-100 font-bold text-sm backdrop-blur-xl shadow-md">
//                 ● Ballan
//               </span>

//               {/* Degdeg */}
//               <span className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-300/30 
//                                text-amber-200 font-bold text-sm backdrop-blur-xl shadow-md">
//                 ● Degdeg
//               </span>

//               {/* Ammaan */}
//               <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-300/30 
//                                text-emerald-200 font-bold text-sm backdrop-blur-xl shadow-md">
//                 ● Ammaan
//               </span>

//               {/* La socod */}
//               <span className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-300/30 
//                                text-indigo-200 font-bold text-sm backdrop-blur-xl shadow-md">
//                 ● La socod
//               </span>

//             </div>

//             {/* BUTTONS */}
//             <div className="mt-7 flex gap-4">

//               {/* Book */}
//               <Link
//                 to="/book"
//                 className="flex items-center gap-2 px-6 py-3 rounded-xl 
//                            bg-blue-700 hover:bg-blue-600
//                            border border-black/40
//                            text-white font-bold shadow-lg transition"
//               >
//                 <CalendarDays size={18} />
//                 Book Appointment
//               </Link>

//               {/* Track */}
//               <Link
//                 to="/track"
//                 className="flex items-center gap-2 px-6 py-3 rounded-xl 
//                            bg-emerald-700 hover:bg-emerald-600
//                            border border-black/40
//                            text-white font-bold shadow-lg transition"
//               >
//                 <Search size={18} />
//                 Track Appointment
//               </Link>

//             </div>
//           </div>

//           {/* RIGHT BOX */}
//           <div className="rounded-[32px] bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600
//                           border border-white/20 backdrop-blur-2xl 
//                           shadow-2xl p-8 flex items-center justify-center h-[430px]">

//             <img
//               src={hero}
//               alt="Appointment Illustration"
//               className="w-[430px] md:w-[500px] object-contain drop-shadow-2xl"
//             />

//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }

import { Link } from "react-router-dom";
import { Search, FileText, ArrowRight, ShieldCheck, Timer } from "lucide-react";
import "./landing.css";

export default function LandingPage() {
  return (
    <section className="landingHero">
      <div className="landingOverlay" />

      <div className="heroWrap">
        <div className="heroGrid">
          {/* LEFT BOX */}
          <div className="glassOuter heroLeft heroH">
            <div className="innerPad">
              <div className="glassInner h-full flex flex-col justify-center">
                {/* ✅ Title with border */}
                <h1 className="heroTitle titleFrame">Ballan Casri ah</h1>

                <p className="heroNote">
                  Si fudud u qabso ballantaada — mar kasta la soco codsigaaga.
                </p>

                <div className="pillRow">
                  <span className="pill">Degdeg</span>
                  <span className="pill">Ammaan</span>
                  <span className="pill">La socod</span>
                </div>

                <div className="btnRow">
                  <Link to="/services" className="btnPrimary btnBlue">
                    <FileText size={18} />
                    Services
                    <ArrowRight size={16} className="btnArrow" />
                  </Link>

                  <Link to="/track" className="btnPrimary btnGreen">
                    <Search size={18} />
                    Track
                    <ArrowRight size={16} className="btnArrow" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT BOX */}
          <div className="glassOuter heroRight heroH">
            <div className="innerPad">
              <div className="glassInner h-full flex flex-col justify-between">
                <div>
                  {/* ✅ Title with border */}
                  <h2 className="heroTitleSmall titleFrame">Nidaam Hufan</h2>

                  <p className="heroNote">
                    Hal meel ku dhammee codsiga, jadwalka, iyo hubinta.
                  </p>

                  <div className="featureStack">
                    <div className="textFrame">
                      <div className="frameRow">
                        <div className="iconBox sky">
                          <Timer className="text-sky-100" size={20} />
                        </div>
                        <div>
                          <p className="frameTitle">Waqti la qorsheeyey</p>
                          <p className="frameDesc">Jadwal cad, sugitaan yar.</p>
                        </div>
                      </div>
                    </div>

                    <div className="textFrame">
                      <div className="frameRow">
                        <div className="iconBox">
                          <ShieldCheck className="text-emerald-100" size={20} />
                        </div>

                        <div>
                          <p className="frameTitle">Xaalad Cad</p>

                          <div className="statusRow">
                            <span className="statusPill pending">Pending</span>
                            <span className="statusArrow">→</span>
                            <span className="statusPill approved">Approved</span>
                            <span className="statusArrow">→</span>
                            <span className="statusPill completed">Completed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="ctaWrap">
                  {/* ✅ Start Request WITHOUT white mini background */}
                  <Link to="/book" className="btnPrimary btnGhost w-fit">
                    Start Request
                    <ArrowRight size={16} className="btnArrow" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* END */}
        </div>
      </div>
    </section>
  );
}