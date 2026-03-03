import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import api from '../services/api';

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/bookings/my')
      .then((data) => {
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setError('Failed to load bookings');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load bookings');
        setLoading(false);
      });
  }, []);

  const handleCancel = async (id) => {
    const data = await api.put(`/bookings/${id}/cancel`);
    if (data.booking) {
      setBookings(bookings.map((b) => (b._id === id ? data.booking : b)));
    } else {
      setError('Failed to cancel booking');
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
      <Navbar />
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

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">You have no bookings yet.</p>
            <Link
              to="/book"
              className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-700"
            >
              Make Your First Booking
            </Link>
          </div>
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
                    {booking.notes && (
                      <p className="text-sm text-gray-400 mt-1">Note: {booking.notes}</p>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-gray-700">
                    ${booking.service?.price}
                  </span>
                  {booking.status === 'pending' || booking.status === 'confirmed' ? (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Cancel Booking
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}