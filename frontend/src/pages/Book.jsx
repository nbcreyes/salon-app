import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const STEPS = ['Service', 'Staff', 'Date & Time', 'Confirm'];

export default function Book() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState({
    service: null,
    staff: null,
    date: '',
    timeSlot: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/services').then(setServices);
    api.get('/staff').then(setStaff);
  }, []);

  useEffect(() => {
    if (selected.staff && selected.date) {
      api
        .get(`/availability?staffId=${selected.staff._id}&date=${selected.date}`)
        .then((data) => setSlots(data.openSlots || []));
    }
  }, [selected.staff, selected.date]);

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    const data = await api.post('/bookings', {
      staff: selected.staff._id,
      service: selected.service._id,
      date: selected.date,
      timeSlot: selected.timeSlot,
      notes: selected.notes,
    });
    setLoading(false);

    if (data._id) {
      navigate('/bookings');
    } else {
      setError(data.message || 'Booking failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <span
          onClick={() => navigate('/')}
          className="text-xl font-bold text-gray-800 cursor-pointer"
        >
          Salon App
        </span>
        <span className="text-sm text-gray-500">Hi, {user?.name}</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1}
              </div>
              <span className={`ml-2 text-sm ${i === step ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-gray-300 mx-3" />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Service</h3>
            <div className="grid grid-cols-1 gap-3">
              {services.map((service) => (
                <div
                  key={service._id}
                  onClick={() => {
                    setSelected({ ...selected, service });
                    setStep(1);
                  }}
                  className={`bg-white rounded-lg shadow p-4 cursor-pointer border-2 ${
                    selected.service?._id === service._id
                      ? 'border-gray-900'
                      : 'border-transparent'
                  } hover:border-gray-400`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.duration} mins</p>
                    </div>
                    <span className="font-bold text-gray-900">${service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Staff Member</h3>
            <div className="grid grid-cols-1 gap-3">
              {staff.map((member) => (
                <div
                  key={member._id}
                  onClick={() => {
                    setSelected({ ...selected, staff: member });
                    setStep(2);
                  }}
                  className={`bg-white rounded-lg shadow p-4 cursor-pointer border-2 ${
                    selected.staff?._id === member._id
                      ? 'border-gray-900'
                      : 'border-transparent'
                  } hover:border-gray-400`}
                >
                  <p className="font-medium text-gray-800">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.specialties.join(', ')}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(0)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Back
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pick a Date and Time</h3>
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selected.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setSelected({ ...selected, date: e.target.value, timeSlot: '' })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              {selected.date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Slots
                  </label>
                  {slots.length === 0 ? (
                    <p className="text-sm text-gray-500">No available slots for this date.</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelected({ ...selected, timeSlot: slot })}
                          className={`py-2 text-sm rounded-lg border ${
                            selected.timeSlot === slot
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={selected.notes}
                  onChange={(e) => setSelected({ ...selected, notes: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selected.date || !selected.timeSlot}
                  className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Booking</h3>
            <div className="bg-white rounded-lg shadow p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service</span>
                <span className="font-medium text-gray-800">{selected.service?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Staff</span>
                <span className="font-medium text-gray-800">{selected.staff?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-800">{selected.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time</span>
                <span className="font-medium text-gray-800">{selected.timeSlot}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price</span>
                <span className="font-bold text-gray-900">${selected.service?.price}</span>
              </div>
              {selected.notes && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Notes</span>
                  <span className="font-medium text-gray-800">{selected.notes}</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}