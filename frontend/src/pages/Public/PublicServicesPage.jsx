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
    <section className="relative px-4 md:px-10 py-10 overflow-hidden">
      {/* subtle blue-only glows */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_28%,rgba(37,99,235,.14),transparent_55%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_82%_72%,rgba(59,130,246,.10),transparent_55%)]" />

      {/* HEADER */}
      <div className="relative text-center mb-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#0F172A]/75 backdrop-blur-xl border border-white/15 shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Services
          </h1>

          <span className="ml-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-white/5 border border-white/10 text-[#94A3B8]">
            Active: {Array.isArray(services) ? services.length : 0}
          </span>
        </div>

        <div className="mt-4 flex justify-center">
          <p className="max-w-2xl px-5 py-3 rounded-2xl bg-[#0F172A]/70 backdrop-blur-xl border border-white/10 shadow-lg text-[#94A3B8] font-semibold text-sm sm:text-base leading-relaxed">
            Dooro adeegga aad u baahan tahay, kadib si fudud ugu gudub foomka
            codsiga.
          </p>
        </div>
      </div>

      {/* LOADING */}
      {servicesLoading && (
        <div className="relative max-w-xl mx-auto">
          <div className="rounded-2xl bg-[#0F172A]/70 border border-white/10 backdrop-blur-xl p-6 text-center shadow-xl">
            <p className="text-[#F8FAFC] font-extrabold text-base">
              Loading services...
            </p>
            <p className="mt-2 text-[#94A3B8] text-sm font-semibold">
              Please wait while we fetch active services.
            </p>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="relative max-w-xl mx-auto bg-red-500/10 border border-red-500/35 text-red-300 p-5 rounded-2xl text-center font-semibold shadow-xl">
          {error}
        </div>
      )}

      {/* GRID */}
      {!servicesLoading && !error && (
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="
                pulse-card group relative rounded-2xl
                bg-[#0F172A]/65 backdrop-blur-xl
                border border-white/10
                shadow-xl
                transition-all duration-300 ease-out
                hover:-translate-y-2
              "
            >
              {/* corner accents */}
              <span className="pointer-events-none absolute -top-[1px] -left-[1px] h-8 w-8 border-t border-l border-white/20 rounded-tl-2xl opacity-70" />
              <span className="pointer-events-none absolute -top-[1px] -right-[1px] h-8 w-8 border-t border-r border-white/20 rounded-tr-2xl opacity-70" />
              <span className="pointer-events-none absolute -bottom-[1px] -left-[1px] h-8 w-8 border-b border-l border-white/20 rounded-bl-2xl opacity-70" />
              <span className="pointer-events-none absolute -bottom-[1px] -right-[1px] h-8 w-8 border-b border-r border-white/20 rounded-br-2xl opacity-70" />

              <div className="p-5 flex flex-col h-full">
                {/* TOP */}
                <div className="flex items-start justify-between gap-4">
                  {/* ✅ Title badge: subtle WHITE pulse */}
                  <div className="pulse-white inline-flex items-center rounded-2xl bg-[#020617]/55 border border-white/15 px-4 py-3">
                    <h3
                      className="
                        text-[14px] sm:text-[15px]
                        font-extrabold text-[#F8FAFC]
                        leading-snug tracking-tight
                        max-w-[200px]
                      "
                      style={{ wordBreak: "break-word" }}
                    >
                      {service.name}
                    </h3>
                  </div>

                  {/* ✅ Apply: subtle WHITE pulse */}
                  <button
                    onClick={() => navigate(`/book?serviceId=${service._id}`)}
                    className="
                      pulse-white relative inline-flex items-center gap-2
                      h-10 px-5 rounded-2xl
                      bg-[#2563EB] hover:bg-[#1D4ED8]
                      text-white text-sm font-extrabold
                      shadow-xl shadow-[#2563EB]/25
                      transition-all duration-300 ease-out
                      hover:scale-[1.03]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]
                    "
                  >
                    Apply
                    <ArrowRight
                      size={16}
                      className="arrow-float transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>

                {/* ✅ Description: subtle WHITE pulse */}
                <div
                  className="
                    pulse-white mt-4 rounded-2xl
                    bg-[#020617]/60
                    border border-white/12
                    p-5
                    text-[#E2E8F0]
                    text-sm font-semibold leading-relaxed
                    min-h-[108px]
                  "
                >
                  {service.description ||
                    "Buuxi xogta, ku lifaaq dukumentiyada, kadibna gudbi codsiga."}
                </div>

                {/* IMAGE */}
                {service.imageUrl && (
                  <div className="mt-5 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#020617]/30">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-[180px] object-cover transition duration-500 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          /* arrow motion */
          .arrow-float { animation: apArrow 1.7s ease-in-out infinite; }
          @keyframes apArrow {
            0%,100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
          }

          /* card subtle pulse (very light) */
          .pulse-card {
            animation: apCardPulse 2.6s ease-in-out infinite;
          }
          @keyframes apCardPulse {
            0%,100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.06); }
            50% { box-shadow: 0 0 0 1px rgba(255,255,255,0.10), 0 0 22px rgba(255,255,255,0.04); }
          }

          /* ✅ Subtle WHITE pulse (thin + light) */
          .pulse-white {
            animation: apWhitePulse 2.2s ease-in-out infinite;
          }
          @keyframes apWhitePulse {
            0%,100% {
              box-shadow: 0 0 0 1px rgba(255,255,255,0.14),
                          0 0 10px rgba(255,255,255,0.04);
            }
            50% {
              box-shadow: 0 0 0 1px rgba(255,255,255,0.26),
                          0 0 18px rgba(255,255,255,0.08);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .arrow-float, .pulse-card, .pulse-white { animation: none !important; }
          }
        `}
      </style>
    </section>
  );
}