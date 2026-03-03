import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, DollarSign, Tag, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/services").then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-14">
          <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-3">
            What We Offer
          </p>
          <h2 className="text-5xl font-extrabold text-white mb-4">
            Our Services
          </h2>
          <p className="text-dark-400 max-w-xl">
            Premium grooming services tailored to your style and preferences.
          </p>
        </div>

        {loading ? (
          <Spinner />
        ) : services.length === 0 ? (
          <p className="text-dark-400">No services available.</p>
        ) : (
          categories.map((category) => (
            <div key={category} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <Tag size={14} className="text-gold-500" />
                <h3 className="text-gold-500 text-xs font-bold tracking-widest uppercase">
                  {category}
                </h3>
                <div className="flex-1 h-px bg-dark-700" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services
                  .filter((s) => s.category === category)
                  .map((service) => (
                    <div
                      key={service._id}
                      className="card-dark p-6 hover:border-gold-500 transition-all duration-200 group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-white font-bold text-lg group-hover:text-gold-400 transition-colors">
                          {service.name}
                        </h4>
                        <span className="text-gold-500 font-extrabold text-xl">
                          ${service.price}
                        </span>
                      </div>
                      <p className="text-dark-400 text-sm leading-relaxed mb-5">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-dark-500">
                          <Clock size={13} />
                          <span className="text-xs">
                            {service.duration} mins
                          </span>
                        </div>
                        <Link
                          to={user ? "/book" : "/login"}
                          className="inline-flex items-center gap-1 text-gold-500 text-xs font-semibold hover:text-gold-400 transition-colors"
                        >
                          Book this <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}