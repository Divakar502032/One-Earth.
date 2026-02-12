
import React, { useState } from 'react';
import { TravelPackage, TransportOption } from '../types';

interface ItineraryDisplayProps {
  pkg: TravelPackage;
  onConfirm: () => void;
  isConfirming: boolean;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ pkg, onConfirm, isConfirming }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const getTransportIcon = (mode: TransportOption['mode']) => {
    switch (mode) {
      case 'Flight': return 'fa-plane';
      case 'Train': return 'fa-train';
      case 'Bus': return 'fa-bus-simple';
      case 'Cab': return 'fa-taxi';
      default: return 'fa-location-arrow';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Confirm Drawer (Mobile-style Overlay) */}
      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isConfirming && setShowConfirm(false)}></div>
          <div className="relative bg-white w-full rounded-t-[2.5rem] p-10 space-y-8 animate-in slide-in-from-bottom duration-500 shadow-2xl safe-bottom max-w-2xl">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-2"></div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black tracking-tight">Purchase Package</h3>
              <p className="text-slate-400 text-sm font-medium">Finalizing architecture for {pkg.destination}</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Secure Amount</p>
                <p className="text-2xl font-black text-slate-900">{pkg.currency} {pkg.total_estimated_price.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <i className="fas fa-lock text-slate-200 text-2xl"></i>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => { setShowConfirm(false); onConfirm(); }}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center space-x-3 active:scale-95 transition-all"
              >
                <i className="fas fa-fingerprint"></i>
                <span className="text-sm uppercase tracking-widest">Confirm & Pay</span>
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest"
              >
                Back to Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] sm:aspect-[21/9] shadow-2xl group">
        <img 
          src={`https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200&h=800`} 
          alt={pkg.destination} 
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent"></div>
        <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-1">
             <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-2 block">Synthesis Complete</span>
             <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">{pkg.destination}</h2>
             <div className="flex items-center space-x-3 text-white/60 text-[10px] font-bold uppercase tracking-widest mt-4">
                <span className="flex items-center"><i className="fas fa-calendar-day mr-2"></i> {pkg.departure_date}</span>
                <span className="w-1 h-1 rounded-full bg-white/30"></span>
                <span>{pkg.itinerary.length} Days Experience</span>
             </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-5 rounded-3xl text-right">
             <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Total Architected</p>
             <p className="text-3xl font-black text-white">{pkg.currency} {pkg.total_estimated_price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Actions & Logistics */}
        <div className="lg:col-span-4 space-y-6">
          <button 
            onClick={() => setShowConfirm(true)}
            disabled={isConfirming}
            className="w-full bg-slate-900 text-white py-8 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex flex-col items-center group relative overflow-hidden active:scale-95 transition-all"
          >
            {isConfirming ? (
               <i className="fas fa-circle-notch fa-spin text-2xl"></i>
            ) : (
              <>
                <span>Secure Full Trip</span>
                <span className="text-[8px] opacity-40 mt-2">One-Click Global Checkout</span>
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform -z-10"></div>
              </>
            )}
          </button>

          {/* Local Events - High Visibility */}
          {pkg.local_events && pkg.local_events.length > 0 && (
            <div className="bg-blue-600/5 border border-blue-600/10 p-8 rounded-[2rem] space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Live Discoveries</h4>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
               </div>
               <div className="space-y-6">
                  {pkg.local_events.map((e, idx) => (
                    <div key={idx} className="space-y-2 pb-4 border-b border-blue-100 last:border-0 last:pb-0">
                      <p className="font-black text-slate-800 text-sm leading-tight">{e.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{e.description}</p>
                      <div className="flex items-center justify-between pt-1">
                         <span className="text-[9px] font-bold text-blue-500 flex items-center">
                            <i className="fas fa-location-arrow mr-1.5 opacity-40"></i> {e.location}
                         </span>
                         <span className="text-[9px] font-black text-slate-300">{e.date_time}</span>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Accommodation */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 card-shadow space-y-4">
             <div className="flex justify-between items-center text-slate-300">
               <i className="fas fa-hotel"></i>
               <span className="text-[9px] font-black uppercase tracking-widest">Base Camp</span>
             </div>
             <div>
               <p className="font-black text-slate-800 text-lg leading-tight">{pkg.accommodation.name}</p>
               <p className="text-xs font-bold text-blue-600 mt-1">{pkg.currency} {pkg.accommodation.price_per_night} / night</p>
             </div>
             <div className="pt-3 border-t border-slate-50">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Policy</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed italic">{pkg.accommodation.cancellation_policy}</p>
             </div>
          </div>
        </div>

        {/* Detailed Feed */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-black tracking-tight">Daily Breakdown</h3>
              <div className="flex items-center space-x-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                <i className="fas fa-wave-square"></i>
                <span>{pkg.itinerary.length} Day Cycle</span>
              </div>
           </div>

           <div className="space-y-6">
              {pkg.itinerary.map((day) => (
                <div key={day.day} className="bg-white p-8 rounded-[2.5rem] card-shadow border border-slate-50 space-y-6 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-6xl font-black italic -rotate-12 group-hover:rotate-0 transition-transform">
                    {day.day}
                  </div>
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg">
                       {day.day}
                     </div>
                     <h4 className="text-xl font-black text-slate-800 tracking-tight">Phase One Expansion</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {day.activities.map((act, i) => (
                      <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start space-x-4 hover:border-blue-100 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">{act}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
           </div>

           {/* Logistics Strip */}
           <div className="space-y-4">
             <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-2">Transit Architecture</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pkg.transport.map((t, i) => (
                  <div key={i} className="bg-slate-900 text-white p-6 rounded-[2rem] space-y-4 flex flex-col justify-between">
                     <div className="flex justify-between items-center">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                          <i className={`fas ${getTransportIcon(t.mode)} text-sm`}></i>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full text-white/60">
                          {t.status}
                        </span>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none mb-2">{t.provider}</p>
                        <p className="text-sm font-black text-white leading-tight">{t.origin} &rarr; {t.destination}</p>
                     </div>
                     <div className="flex justify-between text-[10px] font-bold text-white/40 pt-4 border-t border-white/5">
                        <span>{t.departure_time}</span>
                        <span className="font-mono">{t.reference_number}</span>
                     </div>
                  </div>
                ))}
             </div>
           </div>

           {pkg.grounding_sources && pkg.grounding_sources.length > 0 && (
             <div className="pt-10 border-t border-slate-100 mt-20">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Discovery Assets</p>
                <div className="flex flex-wrap gap-4">
                  {pkg.grounding_sources.slice(0, 5).map((s, idx) => (
                    <a key={idx} href={s.uri} target="_blank" className="px-5 py-3 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:border-blue-100 transition-all card-shadow">
                      {s.title}
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
