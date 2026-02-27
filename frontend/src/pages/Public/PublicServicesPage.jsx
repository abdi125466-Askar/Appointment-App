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
    <section className="bg-gradient-to-br from-white to-blue-50 px-6 lg:px-20 py-16">

      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700">
          Our Services
        </h1>

        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Choose the service you need and proceed to submit your request
          quickly and efficiently.
        </p>

        <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
          Active Services: {Array.isArray(services) ? services.length : 0}
        </div>
      </div>

      {/* LOADING */}
      {servicesLoading && (
        <div className="max-w-xl mx-auto bg-white border border-blue-100 rounded-2xl p-8 shadow-lg text-center">
          <p className="text-blue-700 font-bold text-lg">
            Loading services...
          </p>
          <p className="mt-2 text-gray-500">
            Please wait while we fetch available services.
          </p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="max-w-xl mx-auto bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center font-semibold shadow-md">
          {error}
        </div>
      )}

      {/* SERVICES GRID */}
      {!servicesLoading && !error && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {services.map((service) => (
            <div
              key={service._id}
              className="group bg-white rounded-3xl border border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="p-8 flex flex-col h-full">

                {/* TITLE */}
                <h3 className="text-xl font-bold text-blue-700 mb-4">
                  {service.name}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  {service.description ||
                    "Complete your request easily by filling out the required information and submitting your application."}
                </p>

                {/* IMAGE */}
                {service.imageUrl && (
                  <div className="mt-6 rounded-2xl overflow-hidden border border-blue-100">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-[180px] object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* BUTTON */}
                <button
                  onClick={() => navigate(`/book?serviceId=${service._id}`)}
                  className="mt-8 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Apply Now
                  <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </section>
  );
}