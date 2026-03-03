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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    <div className="min-h-screen bg-dark-900">
      <nav className="bg-dark-800 border-b border-dark-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Manage Services</h1>
        <Link to="/admin" className="text-sm text-dark-400 hover:text-gold-500 transition-colors">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">All Services</h2>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="btn-gold text-sm px-4 py-2"
          >
            Add Service
          </button>
        </div>

        {showForm && (
          <div className="card-dark p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">
              {editingId ? 'Edit Service' : 'New Service'}
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
                <label className="label-dark">Category</label>
                <input name="category" value={form.category} onChange={handleChange} className="input-dark" />
              </div>
              <div>
                <label className="label-dark">Price ($)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} className="input-dark" />
              </div>
              <div>
                <label className="label-dark">Duration (mins)</label>
                <input name="duration" type="number" value={form.duration} onChange={handleChange} className="input-dark" />
              </div>
              <div className="col-span-2">
                <label className="label-dark">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="input-dark resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSubmit} className="btn-gold text-sm px-4 py-2">
                {editingId ? 'Save Changes' : 'Create Service'}
              </button>
              <button onClick={resetForm} className="text-sm text-dark-400 hover:text-gold-500 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="card-dark overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-dark-700">
              <tr>
                {['Name', 'Category', 'Price', 'Duration', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-dark-400 font-medium text-xs tracking-wider uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-dark-700 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{service.name}</td>
                  <td className="px-6 py-4 text-dark-400">{service.category}</td>
                  <td className="px-6 py-4 text-gold-500 font-semibold">${service.price}</td>
                  <td className="px-6 py-4 text-dark-400">{service.duration} mins</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-xs text-gold-500 hover:text-gold-400 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
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
      </div>
    </div>
  );
}