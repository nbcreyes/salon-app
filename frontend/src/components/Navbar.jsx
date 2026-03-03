import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-gray-800">Salon App</Link>
      <div className="flex gap-4 items-center">
        <Link to="/services" className="text-gray-600 hover:text-gray-900 text-sm">Services</Link>
        <Link to="/staff" className="text-gray-600 hover:text-gray-900 text-sm">Staff</Link>
        {user ? (
          <>
            <Link to="/bookings" className="text-gray-600 hover:text-gray-900 text-sm">My Bookings</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-gray-900 text-sm">Admin</Link>
            )}
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
  );
}