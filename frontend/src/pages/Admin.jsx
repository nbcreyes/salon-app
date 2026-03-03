import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import api from "../services/api";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Scissors,
  Users,
  Search,
  Filter,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([api.get("/bookings"), api.get("/services")]).then(([b]) => {
      setBookings(Array.isArray(b) ? b : []);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleStatusUpdate = async (id, status) => {
    const data = await api.put(`/bookings/${id}/status`, { status });
    if (data._id) setBookings(bookings.map((b) => (b._id === id ? data : b)));
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

  const today = new Date().toISOString().split("T")[0];

  const stats = [
    {
      icon: Calendar,
      label: "Total",
      value: bookings.length,
      color: "text-white",
      bg: "bg-dark-700",
    },
    {
      icon: Clock,
      label: "Today",
      value: bookings.filter((b) => b.date === today).length,
      color: "text-gold-400",
      bg: "bg-dark-700",
    },
    {
      icon: Clock,
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      color: "text-gold-400",
      bg: "bg-dark-700",
    },
    {
      icon: CheckCircle,
      label: "Confirmed",
      value: bookings.filter((b) => b.status === "confirmed").length,
      color: "text-emerald-400",
      bg: "bg-dark-700",
    },
    {
      icon: XCircle,
      label: "Cancelled",
      value: bookings.filter((b) => b.status === "cancelled").length,
      color: "text-red-400",
      bg: "bg-dark-700",
    },
    {
      icon: TrendingUp,
      label: "Revenue",
      value: `$${bookings.filter((b) => b.status === "completed").reduce((sum, b) => sum + (b.service?.price || 0), 0)}`,
      color: "text-blue-400",
      bg: "bg-dark-700",
    },
  ];

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
    <div className="min-h-screen bg-dark-900">
      <nav className="bg-dark-800 border-b border-dark-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={18} className="text-gold-500" />
              <span className="text-white font-bold text-lg tracking-tight">
                LUXE <span className="text-gold-500">SALON</span>
              </span>
            </div>
            <span className="text-dark-600 text-xs border border-dark-700 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-dark-400 hover:text-gold-500 text-sm transition-colors flex items-center gap-1.5"
            >
              <ExternalLink size={13} /> View Site
            </Link>
            <span className="text-dark-500 text-sm">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-sm transition-colors flex items-center gap-1.5"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-1">
            Overview
          </p>
          <h2 className="text-3xl font-extrabold text-white">Dashboard</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className="card-dark p-5 hover:border-dark-600 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}
              >
                <Icon size={15} className={color} />
              </div>
              <p className="text-dark-400 text-xs mb-1">{label}</p>
              <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {topServices.length > 0 && (
          <div className="card-dark p-6 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={15} className="text-gold-500" />
              <p className="text-white font-bold">Top Services</p>
            </div>
            <div className="flex gap-8 flex-wrap">
              {topServices.map(([name, count], i) => (
                <div key={name} className="flex items-center gap-3">
                  <span
                    className={`text-2xl font-extrabold ${i === 0 ? "text-gold-500" : i === 1 ? "text-dark-300" : "text-dark-500"}`}
                  >
                    #{i + 1}
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold">{name}</p>
                    <p className="text-dark-400 text-xs">{count} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <Link
            to="/admin/services"
            className="card-dark px-5 py-4 flex items-center gap-3 hover:border-gold-500 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-dark-700 flex items-center justify-center group-hover:bg-gold-500 transition-colors">
              <Scissors
                size={15}
                className="text-gold-500 group-hover:text-dark-900 transition-colors"
              />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">
                Manage Services
              </p>
              <p className="text-dark-500 text-xs">Add, edit, delete</p>
            </div>
          </Link>
          <Link
            to="/admin/staff"
            className="card-dark px-5 py-4 flex items-center gap-3 hover:border-gold-500 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-dark-700 flex items-center justify-center group-hover:bg-gold-500 transition-colors">
              <Users
                size={15}
                className="text-gold-500 group-hover:text-dark-900 transition-colors"
              />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Manage Staff</p>
              <p className="text-dark-500 text-xs">Profiles, availability</p>
            </div>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500"
            />
            <input
              type="text"
              placeholder="Search by customer, service, or staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-9 w-full"
            />
          </div>
          <div className="relative">
            <Filter
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-dark pl-9 sm:w-48"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Calendar size={16} className="text-gold-500" /> All Bookings
            {filtered.length !== bookings.length && (
              <span className="text-dark-500 text-sm font-normal ml-1">
                ({filtered.length} of {bookings.length})
              </span>
            )}
          </h3>
        </div>

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <div className="card-dark p-12 text-center">
            <Search size={32} className="text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400">No bookings match your search.</p>
          </div>
        ) : (
          <div className="card-dark overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-dark-700">
                <tr>
                  {[
                    "Customer",
                    "Service",
                    "Staff",
                    "Date & Time",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-4 text-dark-500 font-semibold text-xs tracking-wider uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filtered.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-dark-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-dark-700 border border-dark-600 flex items-center justify-center text-xs text-gold-500 font-bold flex-shrink-0">
                          {booking.customer?.name?.charAt(0)}
                        </div>
                        <span className="text-white font-medium">
                          {booking.customer?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-300">
                      {booking.service?.name}
                    </td>
                    <td className="px-6 py-4 text-dark-300">
                      {booking.staff?.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-dark-400">
                        <Calendar size={12} className="text-dark-600" />
                        {booking.date}
                        <span className="text-dark-600">·</span>
                        <Clock size={12} className="text-dark-600" />
                        {booking.timeSlot}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusStyle(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking._id, "confirmed")
                              }
                              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
                            >
                              <CheckCircle size={12} /> Confirm
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking._id, "cancelled")
                              }
                              className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors flex items-center gap-1"
                            >
                              <XCircle size={12} /> Cancel
                            </button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, "completed")
                            }
                            className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1"
                          >
                            <CheckCircle size={12} /> Complete
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