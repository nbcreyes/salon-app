import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my').then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  const handleCancel = async (id) => {
    const data = await api.put(`/bookings/${id}/cancel`);
    if (data.booking) {
      setBookings(bookings.map((b) => (b._id === id ? data.booking : b)));
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">Salon App</Link>
        <span className="text-sm text-gray-500">Hi, {user?.name}</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Bookings</h2>
          <Link
            to="/book"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
          >
            New Booking
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{booking.service?.name}</p>
                    <p className="text-sm text-gray-500">with {booking.staff?.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking.date} at {booking.timeSlot}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>
                {booking.status === 'pending' || booking.status === 'confirmed' ? (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="mt-4 text-sm text-red-500 hover:text-red-700"
                  >
                    Cancel Booking
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}