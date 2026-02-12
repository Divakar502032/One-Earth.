
import React from 'react';
import { TravelPackage } from '../types';

interface ItineraryDisplayProps {
  pkg: TravelPackage;
  onConfirm: () => void;
  isConfirming: boolean;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ pkg, onConfirm, isConfirming }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl aspect-[21/9] md:aspect-[3/1]">
        <img 
          src={`https://picsum.photos/seed/${pkg.destination}/1200/400`} 
          alt={pkg.destination} 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <span className="bg-blue-600 text-[10px] uppercase font-bold px-2 py-1 rounded mb-2 inline-block">Destination</span>
            <h1 className="text-4xl md:text-6xl font-black mb-2">{pkg.destination}</h1>
            <p className="text-slate-300 flex items-center">
              <i className="fas fa-calendar-day mr-2"></i> {pkg.itinerary.length} Day Full Experience
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-xs text-slate-300 uppercase font-bold">Total Estimated</p>
            <p className="text-3xl font-black text-white">{pkg.currency} {pkg.total_estimated_price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Accommodation & Transport */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <i className="fas fa-hotel text-blue-500 mr-2"></i> Accommodation
            </h3>
            <p className="font-semibold text-slate-700">{pkg.accommodation.name}</p>
            <p className="text-sm text-slate-500 mt-1">{pkg.currency} {pkg.accommodation.price_per_night.toLocaleString()} / night</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <i className="fas fa-plane text-blue-500 mr-2"></i> Logistics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <i className="fas fa-ticket-alt text-slate-400"></i>
                <span className="text-slate-600 font-medium">{pkg.transport.flight}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <i className="fas fa-taxi text-slate-400"></i>
                <span className="text-slate-600 font-medium">{pkg.transport.local_cab}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 rounded-2xl shadow-lg shadow-emerald-100 transition-all flex flex-col items-center justify-center space-y-1"
          >
            {isConfirming ? (
              <i className="fas fa-circle-notch fa-spin text-2xl"></i>
            ) : (
              <>
                <span className="text-lg">Confirm & Pay</span>
                <span className="text-[10px] opacity-75 font-normal tracking-wider">SECURE ONE-CLICK CHECKOUT</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-slate-400 px-4">
            Booking ID: <span className="font-mono">{pkg.booking_payload}</span>
          </p>
        </div>

        {/* Itinerary */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 px-2 flex items-center">
            <i className="fas fa-route text-blue-500 mr-2"></i> Daily Roadmap
          </h3>
          <div className="space-y-4">
            {pkg.itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-50 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mr-4">
                    {day.day}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-700 mb-3">Day {day.day} Exploration</h4>
                    <ul className="space-y-4">
                      {day.activities.map((act, idx) => (
                        <li key={idx} className="flex items-start group">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 mr-3 group-hover:bg-blue-500 transition-colors"></span>
                          <span className="text-slate-600 text-sm leading-relaxed">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
