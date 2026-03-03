import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services').then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-500">No services available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service) => (
              <div key={service._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                  <span className="text-gray-900 font-bold">${service.price}</span>
                </div>
                <p className="text-gray-500 text-sm mb-3">{service.description}</p>
                <span className="text-xs text-gray-400">{service.duration} mins</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}