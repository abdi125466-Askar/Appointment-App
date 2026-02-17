import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import bg from "../../assets/landing/bg.png";
import api from "../../utils/axios";

export default function PublicServicesPage() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch services from backend
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const res = await api.get("/public/services");
        setServices(res.data?.data || []);
      } catch (err) {
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // 🔹 Handle click → go to booking with selected service
  const handleApply = (service) => {
    navigate("/book", {
      state: {
        selectedService: service,
      },
    });
  };

  return (
    <main
      className="relative min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/40" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-14">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Services
          </h2>
          <p className="mt-2 text-slate-600">
            Choose the service you need and continue to the application form.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="mt-10 text-center font-semibold text-slate-600">
            Loading services...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="mt-10 text-center font-semibold text-red-600">
            {error}
          </p>
        )}

        {/* SERVICES GRID */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((s) => (
            <div
              key={s._id}
              className="rounded-[26px] bg-white/55 border border-white/70 backdrop-blur-xl shadow-sm p-6 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-xl font-black text-slate-900">
                  {s.name}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {s.description || "Continue to apply for this service."}
                </p>
              </div>

              <button
                onClick={() => handleApply(s)}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-black shadow-sm hover:brightness-95 transition"
              >
                Apply <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

