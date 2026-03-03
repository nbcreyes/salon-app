import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, DollarSign, User, Plus, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import api from "../services/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/bookings/my")
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load bookings");
        setLoading(false);
      });
  }, []);

  const handleCancel = async (id) => {
    const data = await api.put(`/bookings/${id}/cancel`);
    if (data.booking)
      setBookings(bookings.map((b) => (b._id === id ? data.booking : b)));
  };

  const statusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "text-emerald-400 bg-emerald-900 bg-opacity-30 border-emerald-800";
      case "cancelled":
        return "text-red-400 bg-red-900 bg-opacity-30 border-red-800";
      case "completed":
        return "text-blue-400 bg-blue-900 bg-opacity-30 border-blue-800";
      default:
        return "text-gold-400 bg-gold-900 bg-opacity-20 border-gold-800";
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-2">
              Your Schedule
            </p>
            <h2 className="text-4xl font-extrabold text-white">My Bookings</h2>
          </div>
          <Link
            to="/book"
            className="btn-gold inline-flex items-center gap-2 text-sm px-4 py-2.5"
          >
            <Plus size={15} /> New Booking
          </Link>
        </div>

        {error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : bookings.length === 0 ? (
          <div className="card-dark p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-dark-700 border border-dark-600 flex items-center justify-center mx-auto mb-6">
              <Calendar size={28} className="text-dark-500" />
            </div>
            <p className="text-white font-bold text-xl mb-2">No bookings yet</p>
            <p className="text-dark-400 text-sm mb-8">
              Book your first appointment and get started.
            </p>
            <Link
              to="/book"
              className="btn-gold inline-flex items-center gap-2"
            >
              <Plus size={15} /> Make Your First Booking
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="card-dark p-6 hover:border-dark-600 transition-colors"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-dark-700 border border-dark-600 flex items-center justify-center flex-shrink-0">
                      <Calendar size={20} className="text-gold-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {booking.service?.name}
                      </h3>
                      <p className="text-dark-400 text-sm flex items-center gap-1.5 mt-0.5">
                        <User size={12} /> {booking.staff?.name}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusStyle(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 bg-dark-700 rounded-xl p-4 mb-4">
                  <div>
                    <p className="text-dark-500 text-xs flex items-center gap-1 mb-1">
                      <Calendar size={10} /> Date
                    </p>
                    <p className="text-white text-sm font-semibold">
                      {booking.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark-500 text-xs flex items-center gap-1 mb-1">
                      <Clock size={10} /> Time
                    </p>
                    <p className="text-white text-sm font-semibold">
                      {booking.timeSlot}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark-500 text-xs flex items-center gap-1 mb-1">
                      <DollarSign size={10} /> Price
                    </p>
                    <p className="text-gold-500 text-sm font-bold">
                      ${booking.service?.price}
                    </p>
                  </div>
                </div>

                {booking.notes && (
                  <p className="text-dark-500 text-xs italic mb-4">
                    "{booking.notes}"
                  </p>
                )}

                {(booking.status === "pending" ||
                  booking.status === "confirmed") && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <XCircle size={14} /> Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}