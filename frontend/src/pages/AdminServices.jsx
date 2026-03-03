import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const empty = { name: '', description: '', price: '', duration: '', category: '' };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/services').then(setServices);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    const payload = { ...form, price: Number(form.price), duration: Number(form.duration) };

    if (editingId) {
      const data = await api.put(`/services/${editingId}`, payload);
      if (data._id) {
        setServices(services.map((s) => (s._id === editingId ? data : s)));
        resetForm();
      } else {
        setError(data.message || 'Update failed');
      }
    } else {
      const data = await api.post('/services', payload);
      if (data._id) {
        setServices([...services, data]);
        resetForm();
      } else {
        setError(data.message || 'Create failed');
      }
    }
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
    });
    setEditingId(service._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const data = await api.del(`/services/${id}`);
    if (data.message === 'Service deleted') {
      setServices(services.filter((s) => s._id !== id));
    }
  };

  const resetForm = () => {
    setForm(empty);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Manage Services</h1>
        <Link to="/admin" className="text-sm text-gray-500 hover:text-gray-700">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">All Services</h2>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
          >
            Add Service
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">
              {editingId ? 'Edit Service' : 'New Service'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                <input
                  name="duration"
                  type="number"
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
              >
                {editingId ? 'Save Changes' : 'Create Service'}
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

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Category</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Price</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Duration</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((service) => (
                <tr key={service._id}>
                  <td className="px-6 py-4 text-gray-800">{service.name}</td>
                  <td className="px-6 py-4 text-gray-500">{service.category}</td>
                  <td className="px-6 py-4 text-gray-800">${service.price}</td>
                  <td className="px-6 py-4 text-gray-500">{service.duration} mins</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
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
      </div>
    </div>
  );
}