import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Salon App</h1>
        <div className="flex gap-4">
          <Link to="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
          <Link to="/staff" className="text-gray-600 hover:text-gray-900">Staff</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Book Your Next Appointment</h2>
        <p className="text-gray-500 text-lg mb-8">Professional haircuts, styling, and grooming services.</p>
        <Link
          to="/services"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700"
        >
          View Services
        </Link>
      </div>
    </div>
  );
}