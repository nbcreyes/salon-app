import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import {
  Scissors,
  Clock,
  Star,
  Shield,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Haircut & Styling",
    desc: "Precision cuts tailored to your face shape and lifestyle.",
  },
  {
    icon: Sparkles,
    title: "Color & Highlights",
    desc: "From subtle highlights to bold transformations.",
  },
  {
    icon: Shield,
    title: "Beard Grooming",
    desc: "Expert shaping and hot towel treatments.",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <section className="relative overflow-hidden border-b border-dark-800">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-600 opacity-5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 py-28 sm:py-40">
          <div className="inline-flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-gold-500 text-xs font-semibold tracking-widest uppercase">
              Now Accepting Bookings
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 leading-none tracking-tight">
            Where Style
            <br />
            <span className="text-gold-500">Meets Precision</span>
          </h1>
          <p className="text-dark-300 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">
            Premium grooming services delivered by expert stylists in a
            luxurious environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={user ? "/book" : "/login"}
              className="btn-gold inline-flex items-center gap-2"
            >
              Book Appointment <ChevronRight size={16} />
            </Link>
            <Link
              to="/services"
              className="btn-outline inline-flex items-center gap-2"
            >
              Explore Services
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-dark-800">
            {[
              { icon: Star, value: "4.9/5", label: "Client Rating" },
              { icon: Clock, value: "5+ Years", label: "In Business" },
              { icon: Scissors, value: "2,000+", label: "Clients Served" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center">
                  <Icon size={16} className="text-gold-500" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">
                    {value}
                  </p>
                  <p className="text-dark-400 text-xs mt-1">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-3">
            What We Do
          </p>
          <h2 className="text-4xl font-extrabold text-white">
            Premium Services
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card-dark p-8 hover:border-gold-500 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-dark-700 border border-dark-600 flex items-center justify-center mb-6 group-hover:bg-gold-500 group-hover:border-gold-500 transition-all duration-300">
                <Icon
                  size={20}
                  className="text-gold-500 group-hover:text-dark-900 transition-colors duration-300"
                />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-dark-800 bg-dark-800">
        <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold text-white mb-2">
              Ready to look your best?
            </h3>
            <p className="text-dark-400">
              Book your appointment in under 2 minutes.
            </p>
          </div>
          <Link
            to={user ? "/book" : "/login"}
            className="btn-gold inline-flex items-center gap-2 whitespace-nowrap"
          >
            Book Now <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-dark-800 py-8 text-center">
        <p className="text-dark-600 text-sm">
          © 2026 Luxe Salon. All rights reserved.
        </p>
      </footer>
    </div>
  );
}