import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const emptyForm = {
  name: '',
  email: '',
  specialties: '',
  daysOff: '',
};

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [availability, setAvailability] = useState({ date: '', slots: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/staff').then(setStaff);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    const payload = {
      name: form.name,
      email: form.email,
      specialties: form.specialties.split(',').map((s) => s.trim()).filter(Boolean),
      daysOff: form.daysOff.split(',').map((s) => s.trim()).filter(Boolean),
    };

    if (editingId) {
      const data = await api.put(`/staff/${editingId}`, payload);
      if (data._id) {
        setStaff(staff.map((s) => (s._id === editingId ? data : s)));
        resetForm();
      } else {
        setError(data.message || 'Update failed');
      }
    } else {
      const data = await api.post('/staff', payload);
      if (data._id) {
        setStaff([...staff, data]);
        resetForm();
      } else {
        setError(data.message || 'Create failed');
      }
    }
  };

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      email: member.email,
      specialties: member.specialties.join(', '),
      daysOff: member.daysOff.join(', '),
    });
    setEditingId(member._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const data = await api.del(`/staff/${id}`);
    if (data.message === 'Staff deleted') {
      setStaff(staff.filter((s) => s._id !== id));
    }
  };

  const handleSetAvailability = async () => {
    if (!selectedStaff || !availability.date || !availability.slots) return;
    const slots = availability.slots.split(',').map((s) => s.trim()).filter(Boolean);
    const data = await api.post('/availability', {
      staff: selectedStaff._id,
      date: availability.date,
      slots,
    });
    if (data._id) {
      alert(`Availability set for ${selectedStaff.name} on ${availability.date}`);
      setAvailability({ date: '', slots: '' });
      setSelectedStaff(null);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Manage Staff</h1>
        <Link to="/admin" className="text-sm text-gray-500 hover:text-gray-700">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">All Staff</h2>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
          >
            Add Staff
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">
              {editingId ? 'Edit Staff' : 'New Staff Member'}
            </h3>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded mb-4">{error}</div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialties (comma separated)
                </label>
                <input
                  name="specialties"
                  value={form.specialties}
                  onChange={handleChange}
                  placeholder="Haircut, Coloring"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days Off (comma separated)
                </label>
                <input
                  name="daysOff"
                  value={form.daysOff}
                  onChange={handleChange}
                  placeholder="Sat, Sun"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
              >
                {editingId ? 'Save Changes' : 'Create Staff'}
              </button>
              <button
                onClick={resetForm}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden mb-10">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Specialties</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Days Off</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((member) => (
                <tr key={member._id}>
                  <td className="px-6 py-4 text-gray-800">{member.name}</td>
                  <td className="px-6 py-4 text-gray-500">{member.email}</td>
                  <td className="px-6 py-4 text-gray-500">{member.specialties.join(', ')}</td>
                  <td className="px-6 py-4 text-gray-500">{member.daysOff.join(', ')}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setSelectedStaff(member)}
                        className="text-xs text-green-600 hover:text-green-800 font-medium"
                      >
                        Set Availability
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedStaff && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">
              Set Availability for {selectedStaff.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter a date and comma-separated time slots in HH:MM format.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={availability.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setAvailability({ ...availability, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Slots (comma separated)
                </label>
                <input
                  value={availability.slots}
                  onChange={(e) => setAvailability({ ...availability, slots: e.target.value })}
                  placeholder="09:00, 09:30, 10:00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSetAvailability}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
              >
                Save Availability
              </button>
              <button
                onClick={() => setSelectedStaff(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}