import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const data = await api.post('/auth/login', form);
    setLoading(false);
    if (data.token) {
      login(data.token, data.user);
      data.user.role === 'admin' ? navigate('/admin') : navigate('/');
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            LUXE <span className="text-gold-500">SALON</span>
          </h1>
          <p className="text-dark-400 text-sm">Sign in to your account</p>
        </div>

        <div className="card-dark p-8">
          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-dark">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="input-dark"
              />
            </div>
            <div>
              <label className="label-dark">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="input-dark"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full text-center disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-dark-400 text-sm mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gold-500 hover:text-gold-400 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}