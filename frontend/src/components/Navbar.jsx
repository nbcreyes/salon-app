import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className="bg-dark-800 border-b border-dark-700">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white tracking-tight">
          LUXE <span className="text-gold-500">SALON</span>
        </Link>

        <button
          className="sm:hidden text-dark-300"
          onClick={() => setOpen(!open)}
        >
          <div className="w-6 h-0.5 bg-dark-300 mb-1" />
          <div className="w-6 h-0.5 bg-dark-300 mb-1" />
          <div className="w-6 h-0.5 bg-dark-300" />
        </button>

        <div className="hidden sm:flex gap-6 items-center">
          <Link to="/services" className="text-dark-300 hover:text-gold-500 text-sm transition-colors">Services</Link>
          <Link to="/staff" className="text-dark-300 hover:text-gold-500 text-sm transition-colors">Staff</Link>
          {user ? (
            <>
              <Link to="/bookings" className="text-dark-300 hover:text-gold-500 text-sm transition-colors">My Bookings</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-dark-300 hover:text-gold-500 text-sm transition-colors">Admin</Link>
              )}
              <span className="text-dark-400 text-sm">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-gold text-sm px-4 py-2">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {open && (
        <div className="sm:hidden px-6 pb-4 flex flex-col gap-4 border-t border-dark-700 pt-4">
          <Link to="/services" onClick={() => setOpen(false)} className="text-dark-300 text-sm">Services</Link>
          <Link to="/staff" onClick={() => setOpen(false)} className="text-dark-300 text-sm">Staff</Link>
          {user ? (
            <>
              <Link to="/bookings" onClick={() => setOpen(false)} className="text-dark-300 text-sm">My Bookings</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setOpen(false)} className="text-dark-300 text-sm">Admin</Link>
              )}
              <span className="text-dark-400 text-sm">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-sm text-red-400 text-left">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-gold-500 text-sm font-medium">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}