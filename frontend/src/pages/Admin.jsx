import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import api from "../services/api";

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

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

  const filtered = bookings.filter((b) => {
    const matchesFilter = filter === "all" || b.status === filter;
    const matchesSearch =
      search === "" ||
      b.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.service?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.staff?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            View Site
          </Link>
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
          {[
            { label: "Total", value: stats.total, color: "text-gray-900" },
            { label: "Today", value: stats.today, color: "text-gray-900" },
            {
              label: "Pending",
              value: stats.pending,
              color: "text-yellow-500",
            },
            {
              label: "Confirmed",
              value: stats.confirmed,
              color: "text-green-500",
            },
            {
              label: "Cancelled",
              value: stats.cancelled,
              color: "text-red-500",
            },
            {
              label: "Revenue",
              value: `$${stats.revenue}`,
              color: "text-blue-500",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-lg shadow p-5">
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
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

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by customer, service, or staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 flex-1"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          All Bookings
          {filtered.length !== bookings.length && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filtered.length} of {bookings.length})
            </span>
          )}
        </h2>

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No bookings match your search.</p>
          </div>
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
                {filtered.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
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