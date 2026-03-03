import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Book Your Next Appointment</h2>
        <p className="text-gray-500 text-lg mb-8">Professional haircuts, styling, and grooming services.</p>
        <div className="flex justify-center gap-4">
          <Link
            to="/services"
            className="bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700"
          >
            View Services
          </Link>
          {user && (
            <Link
              to="/book"
              className="bg-white border border-gray-900 text-gray-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-100"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}