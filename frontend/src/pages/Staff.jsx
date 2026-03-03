import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Scissors, Calendar, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/staff").then((data) => {
      setStaff(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-14">
          <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-3">
            The Team
          </p>
          <h2 className="text-5xl font-extrabold text-white mb-4">
            Meet Our Stylists
          </h2>
          <p className="text-dark-400 max-w-xl">
            Expert professionals dedicated to making you look and feel your
            best.
          </p>
        </div>

        {loading ? (
          <Spinner />
        ) : staff.length === 0 ? (
          <p className="text-dark-400">No staff available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {staff.map((member) => (
              <div
                key={member._id}
                className="card-dark p-8 hover:border-gold-500 transition-all duration-200 group"
              >
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-dark-700 border-2 border-gold-500 flex items-center justify-center text-gold-500 font-extrabold text-2xl flex-shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl group-hover:text-gold-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-dark-500 text-sm">{member.email}</p>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Scissors size={13} className="text-gold-500" />
                    <span className="text-dark-400 text-xs font-semibold uppercase tracking-wider">
                      Specialties
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((s) => (
                      <span
                        key={s}
                        className="bg-dark-700 border border-dark-600 text-gold-400 text-xs px-3 py-1.5 rounded-full font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {member.daysOff.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={13} className="text-dark-500" />
                      <span className="text-dark-500 text-xs font-semibold uppercase tracking-wider">
                        Days Off
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.daysOff.map((day) => (
                        <span
                          key={day}
                          className="text-dark-500 text-xs border border-dark-700 px-2 py-1 rounded"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  to={user ? "/book" : "/login"}
                  className="inline-flex items-center gap-2 text-gold-500 text-sm font-semibold hover:text-gold-400 transition-colors border-t border-dark-700 pt-5 w-full"
                >
                  Book with {member.name.split(" ")[0]}{" "}
                  <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}