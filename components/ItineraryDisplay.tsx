
import React, { useState } from 'react';
import { TravelPackage, TransportOption } from '../types';

interface ItineraryDisplayProps {
  pkg: TravelPackage;
  onConfirm: () => void;
  isConfirming: boolean;
}

const getTransportIcon = (mode: TransportOption['mode']) => {
  switch (mode) {
    case 'Flight': return 'fa-plane-departure';
    case 'Train': return 'fa-train';
    case 'Bus': return 'fa-bus';
    case 'Cab': return 'fa-taxi';
    default: return 'fa-location-dot';
  }
};

const getStatusColor = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('on time') || s.includes('available')) return 'text-emerald-500 bg-emerald-50';
  if (s.includes('delayed')) return 'text-amber-500 bg-amber-50';
  return 'text-blue-500 bg-blue-50';
};

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ pkg, onConfirm, isConfirming }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
      
      {/* Confirm Overly */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 glass">
          <div className="absolute inset-0 bg-slate-900/10" onClick={() => !isConfirming && setShowConfirmDialog(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-[0_48px_128px_-16px_rgba(0,0,0,0.1)] p-10 max-w-lg w-full border border-slate-100 animate-in zoom-in">
            <div className="text-center space-y-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <i className="fas fa-shield-check text-2xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">One-Click Checkout</h3>
                <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed">
                  We'll book the <span className="text-slate-900 font-bold">{pkg.accommodation.name}</span> and all transport for a total of <span className="text-blue-600 font-bold">{pkg.currency} {pkg.total_estimated_price.toLocaleString()}</span>.
                </p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between text-left">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Auth</p>
                  <p className="font-mono text-[10px] text-slate-500 truncate max-w-[200px]">{pkg.booking_payload}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway</p>
                   <p className="text-[10px] font-bold text-slate-900 uppercase">Stripe Mock</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setShowConfirmDialog(false); onConfirm(); }}
                  className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
                >
                  Purchase Everything
                </button>
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[400px]">
        <img 
          src={`https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200&h=600`} 
          alt={pkg.destination} 
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-1">
             <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] ml-1">The Journey Line</span>
             <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">{pkg.destination}</h1>
             <p className="text-white/60 text-sm font-bold uppercase tracking-widest mt-2">{pkg.departure_date} &mdash; {pkg.return_date}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] text-right min-w-[200px]">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Total Est.</p>
            <p className="text-4xl font-black text-white">{pkg.currency} {pkg.total_estimated_price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Logistics Column */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Main Booking Trigger */}
          <button
            onClick={() => setShowConfirmDialog(true)}
            disabled={isConfirming}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-black py-8 rounded-[2rem] shadow-2xl shadow-blue-200 transition-all flex flex-col items-center group active:scale-[0.98]"
          >
            {isConfirming ? (
              <i className="fas fa-circle-notch fa-spin text-2xl"></i>
            ) : (
              <>
                <span className="text-sm uppercase tracking-[0.3em]">Confirm All-In-One</span>
                <span className="text-[9px] opacity-60 font-bold uppercase tracking-widest mt-2">Book Hotels & Transport</span>
              </>
            )}
          </button>

          {/* Accommodation */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Camp</h4>
              <i className="fas fa-hotel text-slate-300"></i>
            </div>
            <div>
              <p className="text-xl font-black text-slate-800 leading-tight">{pkg.accommodation.name}</p>
              <p className="text-sm font-bold text-blue-600 mt-1">{pkg.currency} {pkg.accommodation.price_per_night} / night</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cancellation Policy</p>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">{pkg.accommodation.cancellation_policy}</p>
            </div>
          </div>

          {/* Transport Stack */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logistics Sync</h4>
            {pkg.transport.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <div className={`p-2 rounded-xl ${getStatusColor(t.status)}`}>
                    <i className={`fas ${getTransportIcon(t.mode)} text-xs`}></i>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusColor(t.status)}`}>
                    {t.status}
                  </span>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">{t.provider}</p>
                   <p className="text-sm font-black text-slate-800 mt-1">{t.origin} &rarr; {t.destination}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400">{t.departure_time}</span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{t.reference_number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap Column */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Daily Roadmap</h3>
              <div className="flex items-center space-x-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                 <i className="fas fa-route"></i>
                 <span>{pkg.itinerary.length} Days Planned</span>
              </div>
           </div>
           
           <div className="relative space-y-12">
              {/* Journey Line */}
              <div className="absolute left-[29px] top-8 bottom-8 w-[2px] bg-slate-100"></div>
              
              {pkg.itinerary.map((day) => (
                <div key={day.day} className="relative pl-20 group">
                  <div className="absolute left-0 top-1 w-[60px] h-[60px] bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-black text-lg shadow-sm group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all z-10">
                    {day.day}
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">Morning through Night</h4>
                    <div className="grid grid-cols-1 gap-4">
                       {day.activities.map((act, idx) => (
                         <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-blue-100 hover:shadow-xl transition-all flex items-start space-x-4">
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500/20 flex-shrink-0"></div>
                            <p className="text-slate-600 font-medium leading-relaxed">{act}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              ))}
           </div>

           {pkg.grounding_sources && pkg.grounding_sources.length > 0 && (
             <div className="mt-20 p-10 bg-slate-900 rounded-[3rem] text-white">
                <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">Grounding Assets</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {pkg.grounding_sources.slice(0, 4).map((s, idx) => (
                    <a key={idx} href={s.uri} target="_blank" className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <i className="fas fa-link text-[10px] text-white/40"></i>
                      </div>
                      <span className="text-xs font-bold text-white/80 truncate">{s.title}</span>
                    </a>
                  ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
