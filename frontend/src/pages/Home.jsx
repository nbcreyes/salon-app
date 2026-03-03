import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Salon App</h1>
        <div className="flex gap-4 items-center">
          <Link to="/services" className="text-gray-600 hover:text-gray-900">
            Services
          </Link>
          <Link to="/staff" className="text-gray-600 hover:text-gray-900">
            Staff
          </Link>
          {user ? (
            <>
              <span className="text-sm text-gray-500">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Book Your Next Appointment
        </h2>
        <p className="text-gray-500 text-lg mb-8">
          Professional haircuts, styling, and grooming services.
        </p>
        <Link
          to="/services"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700"
        >
          View Services
        </Link>
        {user && (
          <Link
            to="/book"
            className="ml-4 bg-white border border-gray-900 text-gray-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Book Now
          </Link>
        )}
      </div>
    </div>
  );
}
