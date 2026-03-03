import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/bookings"), api.get("/services")]).then(([b, s]) => {
      setBookings(Array.isArray(b) ? b : []);
      setServices(Array.isArray(s) ? s : []);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleStatusUpdate = async (id, status) => {
    const data = await api.put(`/bookings/${id}/status`, { status });
    if (data._id) {
      setBookings(bookings.map((b) => (b._id === id ? data : b)));
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      case "completed":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-yellow-600 bg-yellow-50";
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const stats = {
    total: bookings.length,
    today: bookings.filter((b) => b.date === today).length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    revenue: bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + (b.service?.price || 0), 0),
  };

  const serviceCounts = bookings.reduce((acc, b) => {
    const name = b.service?.name;
    if (name) acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats.today}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-3xl font-bold text-yellow-500 mt-1">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-3xl font-bold text-green-500 mt-1">
              {stats.confirmed}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="text-3xl font-bold text-red-500 mt-1">
              {stats.cancelled}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-3xl font-bold text-blue-500 mt-1">
              ${stats.revenue}
            </p>
          </div>
        </div>

        {topServices.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-md font-semibold text-gray-800 mb-4">
              Top Services
            </h3>
            <div className="flex gap-6">
              {topServices.map(([name, count]) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">
                    {name}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {count} bookings
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <Link
            to="/admin/services"
            className="bg-white border border-gray-200 rounded-lg shadow px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Manage Services
          </Link>
          <Link
            to="/admin/staff"
            className="bg-white border border-gray-200 rounded-lg shadow px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Manage Staff
          </Link>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">All Bookings</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Service
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Staff
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Date & Time
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 text-gray-800">
                      {booking.customer?.name}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {booking.service?.name}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {booking.staff?.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {booking.date} at {booking.timeSlot}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking._id, "confirmed")
                              }
                              className="text-xs text-green-600 hover:text-green-800 font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking._id, "cancelled")
                              }
                              className="text-xs text-red-500 hover:text-red-700 font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, "completed")
                            }
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}