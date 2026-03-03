import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const emptyForm = { name: '', email: '', specialties: '', daysOff: '' };

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    <div className="min-h-screen bg-dark-900">
      <nav className="bg-dark-800 border-b border-dark-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Manage Staff</h1>
        <Link to="/admin" className="text-sm text-dark-400 hover:text-gold-500 transition-colors">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">All Staff</h2>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="btn-gold text-sm px-4 py-2"
          >
            Add Staff
          </button>
        </div>

        {showForm && (
          <div className="card-dark p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">
              {editingId ? 'Edit Staff' : 'New Staff Member'}
            </h3>
            {error && (
              <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-dark">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-dark" />
              </div>
              <div>
                <label className="label-dark">Email</label>
                <input name="email" value={form.email} onChange={handleChange} className="input-dark" />
              </div>
              <div>
                <label className="label-dark">Specialties (comma separated)</label>
                <input name="specialties" value={form.specialties} onChange={handleChange} placeholder="Haircut, Coloring" className="input-dark" />
              </div>
              <div>
                <label className="label-dark">Days Off (comma separated)</label>
                <input name="daysOff" value={form.daysOff} onChange={handleChange} placeholder="Sat, Sun" className="input-dark" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSubmit} className="btn-gold text-sm px-4 py-2">
                {editingId ? 'Save Changes' : 'Create Staff'}
              </button>
              <button onClick={resetForm} className="text-sm text-dark-400 hover:text-gold-500 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="card-dark overflow-hidden overflow-x-auto mb-10">
          <table className="w-full text-sm">
            <thead className="border-b border-dark-700">
              <tr>
                {['Name', 'Email', 'Specialties', 'Days Off', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-dark-400 font-medium text-xs tracking-wider uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {staff.map((member) => (
                <tr key={member._id} className="hover:bg-dark-700 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{member.name}</td>
                  <td className="px-6 py-4 text-dark-400">{member.email}</td>
                  <td className="px-6 py-4 text-dark-400">{member.specialties.join(', ')}</td>
                  <td className="px-6 py-4 text-dark-400">{member.daysOff.join(', ')}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-xs text-gold-500 hover:text-gold-400 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setSelectedStaff(member)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                      >
                        Set Availability
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
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
          <div className="card-dark p-6">
            <h3 className="text-white font-semibold mb-2">
              Set Availability for {selectedStaff.name}
            </h3>
            <p className="text-dark-400 text-sm mb-4">
              Enter a date and comma-separated time slots in HH:MM format.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-dark">Date</label>
                <input
                  type="date"
                  value={availability.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setAvailability({ ...availability, date: e.target.value })}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="label-dark">Time Slots (comma separated)</label>
                <input
                  value={availability.slots}
                  onChange={(e) => setAvailability({ ...availability, slots: e.target.value })}
                  placeholder="09:00, 09:30, 10:00"
                  className="input-dark"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSetAvailability} className="btn-gold text-sm px-4 py-2">
                Save Availability
              </button>
              <button
                onClick={() => setSelectedStaff(null)}
                className="text-sm text-dark-400 hover:text-gold-500 transition-colors"
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