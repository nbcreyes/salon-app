import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/staff').then((data) => {
      setStaff(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Staff</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : staff.length === 0 ? (
          <p className="text-gray-500">No staff available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {staff.map((member) => (
              <div key={member._id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{member.email}</p>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((s) => (
                    <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}