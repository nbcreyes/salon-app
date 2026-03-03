import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import api from "../services/api";
import {
  Clock,
  DollarSign,
  User,
  Scissors,
  Calendar,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

const STEPS = ["Service", "Staff", "Date & Time", "Confirm"];

export default function Book() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState({
    service: null,
    staff: null,
    date: "",
    timeSlot: "",
    notes: "",
  });

  useEffect(() => {
    api.get("/services").then(setServices);
    api.get("/staff").then(setStaff);
  }, []);

  useEffect(() => {
    if (selected.staff && selected.date) {
      setFetchingSlots(true);
      api
        .get(
          `/availability?staffId=${selected.staff._id}&date=${selected.date}`,
        )
        .then((data) => {
          setSlots(data.openSlots || []);
          setFetchingSlots(false);
        });
    }
  }, [selected.staff, selected.date]);

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    const data = await api.post("/bookings", {
      staff: selected.staff._id,
      service: selected.service._id,
      date: selected.date,
      timeSlot: selected.timeSlot,
      notes: selected.notes,
    });
    setLoading(false);
    if (data._id) {
      navigate("/bookings");
    } else {
      setError(data.message || "Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-2">
            New Appointment
          </p>
          <h2 className="text-4xl font-extrabold text-white">Book a Service</h2>
        </div>

        <div className="flex items-center mb-10">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    i < step
                      ? "bg-gold-500 border-gold-500 text-dark-900"
                      : i === step
                        ? "border-gold-500 text-gold-500"
                        : "border-dark-600 text-dark-500"
                  }`}
                >
                  {i < step ? <CheckCircle size={18} /> : i + 1}
                </div>
                <span
                  className={`text-xs mt-1.5 font-medium ${i === step ? "text-gold-500" : "text-dark-500"}`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 mb-4 transition-all ${i < step ? "bg-gold-500" : "bg-dark-700"}`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <Scissors size={18} className="text-gold-500" /> Select a Service
            </h3>
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service._id}
                  onClick={() => {
                    setSelected({ ...selected, service });
                    setStep(1);
                  }}
                  className={`card-dark p-5 cursor-pointer transition-all duration-200 hover:border-gold-500 group ${
                    selected.service?._id === service._id
                      ? "border-gold-500"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold group-hover:text-gold-400 transition-colors">
                        {service.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-dark-500 text-xs">
                          <Clock size={11} /> {service.duration} mins
                        </span>
                        <span className="text-dark-600 text-xs">
                          {service.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-gold-500 font-extrabold text-xl">
                        ${service.price}
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-dark-600 group-hover:text-gold-500 transition-colors ml-auto mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <User size={18} className="text-gold-500" /> Select a Staff Member
            </h3>
            <div className="space-y-3">
              {staff.map((member) => (
                <div
                  key={member._id}
                  onClick={() => {
                    setSelected({ ...selected, staff: member });
                    setStep(2);
                  }}
                  className={`card-dark p-5 cursor-pointer transition-all duration-200 hover:border-gold-500 group ${
                    selected.staff?._id === member._id ? "border-gold-500" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-dark-700 border-2 border-gold-500 flex items-center justify-center text-gold-500 font-extrabold text-lg flex-shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold group-hover:text-gold-400 transition-colors">
                        {member.name}
                      </p>
                      <p className="text-dark-400 text-sm mt-0.5">
                        {member.specialties.join(", ")}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-dark-600 group-hover:text-gold-500 transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(0)}
              className="mt-6 text-dark-400 hover:text-gold-500 text-sm transition-colors flex items-center gap-1"
            >
              ← Back
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <Calendar size={18} className="text-gold-500" /> Pick a Date and
              Time
            </h3>
            <div className="card-dark p-6 space-y-6">
              <div>
                <label className="label-dark flex items-center gap-1.5">
                  <Calendar size={13} className="text-gold-500" /> Date
                </label>
                <input
                  type="date"
                  value={selected.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      date: e.target.value,
                      timeSlot: "",
                    })
                  }
                  className="input-dark"
                />
              </div>

              {selected.date && (
                <div>
                  <label className="label-dark flex items-center gap-1.5">
                    <Clock size={13} className="text-gold-500" /> Available
                    Slots
                  </label>
                  {fetchingSlots ? (
                    <Spinner />
                  ) : slots.length === 0 ? (
                    <p className="text-dark-400 text-sm py-4 text-center border border-dark-700 rounded-lg">
                      No available slots for this date.
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() =>
                            setSelected({ ...selected, timeSlot: slot })
                          }
                          className={`py-2.5 text-sm rounded-lg border font-medium transition-all ${
                            selected.timeSlot === slot
                              ? "bg-gold-500 text-dark-900 border-gold-500"
                              : "bg-transparent text-dark-300 border-dark-600 hover:border-gold-500 hover:text-gold-500"
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
                <label className="label-dark">Notes (optional)</label>
                <textarea
                  value={selected.notes}
                  onChange={(e) =>
                    setSelected({ ...selected, notes: e.target.value })
                  }
                  rows={3}
                  placeholder="Any special requests..."
                  className="input-dark resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-dark-700">
                <button
                  onClick={() => setStep(1)}
                  className="text-dark-400 hover:text-gold-500 text-sm transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selected.date || !selected.timeSlot}
                  className="btn-gold disabled:opacity-40 inline-flex items-center gap-2"
                >
                  Continue <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <CheckCircle size={18} className="text-gold-500" /> Confirm
              Booking
            </h3>
            <div className="card-dark p-6 mb-4">
              <div className="flex items-center gap-4 pb-5 mb-5 border-b border-dark-700">
                <div className="w-12 h-12 rounded-xl bg-dark-700 border border-dark-600 flex items-center justify-center">
                  <Scissors size={20} className="text-gold-500" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">
                    {selected.service?.name}
                  </p>
                  <p className="text-dark-400 text-sm">
                    with {selected.staff?.name}
                  </p>
                </div>
              </div>

              {[
                { icon: Calendar, label: "Date", value: selected.date },
                { icon: Clock, label: "Time", value: selected.timeSlot },
                {
                  icon: Clock,
                  label: "Duration",
                  value: `${selected.service?.duration} mins`,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-3 border-b border-dark-700 last:border-0"
                >
                  <span className="flex items-center gap-2 text-dark-400 text-sm">
                    <Icon size={14} className="text-dark-500" /> {label}
                  </span>
                  <span className="text-white text-sm font-medium">
                    {value}
                  </span>
                </div>
              ))}

              <div className="flex justify-between items-center pt-5 mt-2">
                <span className="flex items-center gap-2 text-dark-300 font-semibold">
                  <DollarSign size={16} className="text-gold-500" /> Total
                </span>
                <span className="text-gold-500 font-extrabold text-2xl">
                  ${selected.service?.price}
                </span>
              </div>
            </div>

            {selected.notes && (
              <div className="card-dark p-4 mb-4">
                <p className="text-dark-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  Notes
                </p>
                <p className="text-dark-300 text-sm">{selected.notes}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep(2)}
                className="text-dark-400 hover:text-gold-500 text-sm transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="btn-gold disabled:opacity-40 inline-flex items-center gap-2"
              >
                {loading ? (
                  "Confirming..."
                ) : (
                  <>
                    <CheckCircle size={16} /> Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}