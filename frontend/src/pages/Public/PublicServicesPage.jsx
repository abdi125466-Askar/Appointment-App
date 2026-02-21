// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { ArrowRight } from "lucide-react";
// import { fetchActiveServices } from "../../Redux/slices/PublicSlice/publicAppointmentSlice";

// export default function PublicServicesPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { services, servicesLoading, error } = useSelector(
//     (state) => state.publicAppointment
//   );

//   useEffect(() => {
//     dispatch(fetchActiveServices());
//   }, [dispatch]);

//   return (
//     <section className="relative min-h-screen bg-slate-950 px-4 md:px-8 py-12">
//       {/* HEADER */}
//       <div className="text-center mb-12">
//         <h1 className="inline-block text-4xl md:text-5xl font-black text-white px-8 py-3 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-xl">
//           Services
//         </h1>

//         <p className="mt-6 max-w-2xl mx-auto text-slate-300 font-semibold">
//           Dooro adeegga aad u baahan tahay, kadib si fudud ugu gudub foomka
//           codsiga.
//         </p>
//       </div>

//       {/* LOADING */}
//       {servicesLoading && (
//         <div className="text-center text-white font-semibold">
//           Loading services...
//         </div>
//       )}

//       {/* ERROR */}
//       {error && (
//         <div className="max-w-xl mx-auto bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center font-semibold">
//           {error}
//         </div>
//       )}

//       {/* SERVICES GRID */}
//       {!servicesLoading && !error && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {services.map((service) => (
//             <div
//               key={service._id}
//               className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-blue-600/40 to-white/10 shadow-[0_25px_60px_rgba(0,0,0,.35)] transition-all duration-300 hover:-translate-y-2"
//             >
//               <div className="rounded-3xl bg-slate-900/70 backdrop-blur-xl p-6 flex flex-col h-full border border-white/10">
//                 {/* TITLE + BUTTON */}
//                 <div className="flex items-start justify-between gap-4">
//                   <h3 className="text-xl font-black text-white leading-snug">
//                     {service.name}
//                   </h3>

//                   <button
//                     onClick={() =>
//                       navigate(`/book?serviceId=${service._id}`)
//                     }
//                     className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold shadow-lg hover:brightness-110 hover:-translate-y-[2px] transition"
//                   >
//                     Apply
//                     <ArrowRight size={16} />
//                   </button>
//                 </div>

//                 {/* DESCRIPTION */}
//                 <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-300 text-sm font-semibold leading-relaxed min-h-[120px]">
//                   {service.description ||
//                     "Buuxi xogta, ku lifaaq dukumentiyada, kadibna gudbi codsiga."}
//                 </div>

//                 {/* OPTIONAL IMAGE FROM BACKEND */}
//                 {service.imageUrl && (
//                   <div className="mt-6 rounded-2xl overflow-hidden border border-white/10">
//                     <img
//                       src={service.imageUrl}
//                       alt={service.name}
//                       className="w-full h-[180px] object-cover transition duration-300 group-hover:scale-105"
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchActiveServices } from "../../Redux/slices/PublicSlice/publicAppointmentSlice";

export default function PublicServicesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { services, servicesLoading, error } = useSelector(
    (state) => state.publicAppointment
  );

  useEffect(() => {
    dispatch(fetchActiveServices());
  }, [dispatch]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 md:px-10 py-16 overflow-hidden">
      
      {/* Soft background glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(37,99,235,.25),transparent_50%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,.20),transparent_50%)]" />

      {/* HEADER */}
      <div className="relative text-center mb-16">
        <h1 className="inline-block text-4xl md:text-6xl font-black text-white px-10 py-4 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-2xl shadow-2xl tracking-tight">
          Services
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-slate-300 font-semibold text-lg leading-relaxed">
          Dooro adeegga aad u baahan tahay, kadib si fudud ugu gudub foomka
          codsiga.
        </p>
      </div>

      {/* LOADING */}
      {servicesLoading && (
        <div className="text-center text-white font-semibold text-lg">
          Loading services...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="max-w-xl mx-auto bg-red-500/10 border border-red-500/40 text-red-400 p-5 rounded-2xl text-center font-semibold shadow-lg">
          {error}
        </div>
      )}

      {/* SERVICES GRID */}
      {!servicesLoading && !error && (
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => (
            <div
              key={service._id}
              className="group relative rounded-[28px] p-[1px] bg-gradient-to-br from-blue-600/40 via-blue-500/20 to-white/10 shadow-[0_30px_70px_rgba(0,0,0,.45)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_35px_90px_rgba(37,99,235,.35)]"
            >
              <div className="rounded-[27px] bg-slate-900/80 backdrop-blur-2xl p-7 flex flex-col h-full border border-white/10">

                {/* TOP */}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-black text-white leading-snug tracking-tight">
                    {service.name}
                  </h3>

                  <button
                    onClick={() =>
                      navigate(`/book?serviceId=${service._id}`)
                    }
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold shadow-xl hover:brightness-110 hover:-translate-y-[2px] transition-all duration-300"
                  >
                    Apply
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5 text-slate-300 text-sm font-medium leading-relaxed min-h-[130px]">
                  {service.description ||
                    "Buuxi xogta, ku lifaaq dukumentiyada, kadibna gudbi codsiga."}
                </div>

                {/* IMAGE */}
                {service.imageUrl && (
                  <div className="mt-7 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-[190px] object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}