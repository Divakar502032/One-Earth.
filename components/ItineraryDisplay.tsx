
import React, { useState, useEffect } from 'react';
import { TravelPackage, TransportOption, PaymentMethod, PaymentDetails } from '../types';
import { executeSecurePayment } from '../services/travelService';

interface ItineraryDisplayProps {
  pkg: TravelPackage;
  onConfirm: () => void;
  isConfirming: boolean;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ pkg, onConfirm, isConfirming }) => {
  const [showVault, setShowVault] = useState(false);
  const [vaultStep, setVaultStep] = useState<'details' | 'processing' | 'success'>('details');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({ method: 'upi', bank: 'Global Merchant' });
  const [statusMsg, setStatusMsg] = useState('');
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleRate = (id: string, rate: number) => {
    setRatings(prev => ({ ...prev, [id]: rate }));
  };

  const StarRating = ({ id }: { id: string }) => {
    const currentRating = ratings[id] || 0;
    return (
      <div className="flex space-x-1.5 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={(e) => { e.stopPropagation(); handleRate(id, star); }}
            className={`transition-all transform hover:scale-125 active:scale-150 ${star <= currentRating ? 'text-amber-400' : 'text-slate-200'}`}
          >
            <i className={`${star <= currentRating ? 'fas' : 'far'} fa-star text-[11px]`}></i>
          </button>
        ))}
      </div>
    );
  };

  const startPayment = async () => {
    setVaultStep('processing');
    try {
      const success = await executeSecurePayment(paymentDetails, (msg) => setStatusMsg(msg));
      if (success) {
        onConfirm(); 
      }
    } catch (err) {
      setVaultStep('details');
      alert("Payment failed. Please retry.");
    }
  };

  const getTransportIcon = (mode: TransportOption['mode']) => {
    switch (mode) {
      case 'Flight': return 'fa-plane-departure';
      case 'Train': return 'fa-train-subway';
      case 'Bus': return 'fa-bus-simple';
      case 'Cab': return 'fa-taxi';
      default: return 'fa-rocket';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* TRANSACTION VAULT - Dark Aesthetic */}
      {showVault && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => vaultStep === 'details' && setShowVault(false)}></div>
          <div className="relative bg-[#0a0c10] w-full max-w-xl rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] border border-white/5 flex flex-col animate-in zoom-in-95 duration-500">
            
            <div className="p-10 md:p-14 space-y-10 flex-grow">
              {vaultStep === 'details' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em]">Vault Settlement</p>
                    <h3 className="text-3xl font-black text-white tracking-tighter">Secure Handshake</h3>
                  </div>

                  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-6">
                    <div className="flex justify-between items-center text-white/20">
                      <span className="text-[10px] font-black uppercase tracking-widest">Global Amount</span>
                      <i className="fas fa-lock text-xs"></i>
                    </div>
                    <div className="flex items-baseline space-x-3">
                      <span className="text-5xl font-black text-white tracking-tighter">{pkg.currency} {pkg.total_estimated_price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Payment Infrastructure</p>
                    <div className="grid grid-cols-3 gap-3">
                      {(['upi', 'debit', 'credit'] as PaymentMethod[]).map((m) => (
                        <button 
                          key={m}
                          onClick={() => setPaymentDetails(prev => ({ ...prev, method: m }))}
                          className={`py-5 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${paymentDetails.method === m ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]' : 'border-white/5 bg-white/5 text-white/30 hover:bg-white/10'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    {paymentDetails.method === 'upi' ? (
                      <input 
                        type="text" 
                        placeholder="Global VPA ID"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-base outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-white/10"
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, vpa: e.target.value }))}
                      />
                    ) : (
                      <div className="relative">
                        <select 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-base outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, bank: e.target.value }))}
                        >
                          <option value="Global Standard">Global Standard</option>
                          <option value="Continental Alpha">Continental Alpha</option>
                          <option value="Apex Digital">Apex Digital</option>
                        </select>
                        <i className="fas fa-chevron-down absolute right-8 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"></i>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={startPayment}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-900/40 flex items-center justify-center space-x-4 transition-all active:scale-95 group"
                  >
                    <i className="fas fa-fingerprint text-lg group-hover:scale-125 transition-transform"></i>
                    <span className="text-sm uppercase tracking-[0.3em]">Confirm Settlement</span>
                  </button>
                </div>
              )}

              {vaultStep === 'processing' && (
                <div className="h-full flex flex-col items-center justify-center py-20 space-y-12 animate-in fade-in zoom-in-95 duration-700">
                  <div className="relative">
                    <div className="w-32 h-32 border-[6px] border-white/5 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <i className="fas fa-microchip text-blue-500 text-4xl animate-pulse"></i>
                    </div>
                  </div>
                  <div className="text-center space-y-6">
                    <p className="text-white font-black tracking-tight text-3xl">Synchronizing Nodes</p>
                    <div className="bg-blue-500/10 px-8 py-4 rounded-full border border-blue-500/20">
                      <p className="text-xs text-blue-400 font-black uppercase tracking-[0.3em] animate-pulse">{statusMsg}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/10 font-black uppercase tracking-[0.5em]">Quantum Encrypted Session</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Header - Wider and more dynamic */}
      <div className="relative rounded-[3.5rem] overflow-hidden aspect-[16/9] md:aspect-[21/7] shadow-[0_48px_80px_-20px_rgba(0,0,0,0.1)] group border border-slate-100">
        <img 
          src={`https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=1600`} 
          alt={pkg.destination} 
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[3000ms] scale-110 group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-10 left-10 right-10 md:bottom-16 md:left-16 md:right-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="space-y-4">
             <div className="flex items-center space-x-3">
               <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Synthesis 1.0</span>
               <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Verified Package</span>
             </div>
             <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85]">{pkg.destination}</h2>
             <div className="flex items-center space-x-6 text-white/60 text-[11px] font-bold uppercase tracking-[0.2em] mt-8">
                <span className="flex items-center"><i className="fas fa-calendar-check mr-3 text-blue-400"></i> {pkg.departure_date}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                <span>{pkg.itinerary.length} Day Sequence</span>
             </div>
          </div>
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[2.5rem] text-right shadow-2xl min-w-[300px]">
             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Total Estimated Payout</p>
             <p className="text-5xl font-black text-white tracking-tighter">{pkg.currency} {pkg.total_estimated_price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Logistics Panel - Left Sidebar style on Desktop */}
        <div className="lg:col-span-4 space-y-8">
          <button 
            onClick={() => setShowVault(true)}
            className="w-full bg-slate-900 text-white py-12 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex flex-col items-center group relative overflow-hidden active:scale-95 transition-all"
          >
            <span className="relative z-10 group-hover:scale-110 transition-transform">Secure Transaction</span>
            <span className="relative z-10 text-[9px] opacity-40 mt-3 font-bold">Initiate Node Settlement</span>
            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          </button>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 card-shadow space-y-8 group hover:border-blue-200 transition-colors">
             <div className="flex justify-between items-start">
               <div>
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Selected Headquarters</span>
                 <p className="font-black text-slate-900 text-2xl tracking-tight leading-tight mt-2">{pkg.accommodation.name}</p>
               </div>
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                 <i className="fas fa-hotel"></i>
               </div>
             </div>
             <div className="flex justify-between items-center py-6 border-y border-slate-50">
               <span className="text-sm font-black text-blue-600">{pkg.currency} {pkg.accommodation.price_per_night} / node-night</span>
               <StarRating id="accommodation" />
             </div>
             <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-slate-300">Policy</span>
                <p className="text-xs font-bold text-slate-500">{pkg.accommodation.cancellation_policy}</p>
             </div>
          </div>

          {pkg.local_events && pkg.local_events.length > 0 && (
            <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] card-shadow space-y-8 relative overflow-hidden">
               <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Live Grounding</h4>
                 <div className="flex space-x-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></span>
                 </div>
               </div>
               <div className="space-y-6">
                  {pkg.local_events.slice(0, 3).map((e, idx) => (
                    <div key={idx} className="space-y-2 relative pl-6 border-l border-slate-100">
                      <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-slate-200"></div>
                      <p className="font-black text-slate-900 text-sm leading-tight">{e.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{e.date_time}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Itinerary Panel - Main Content */}
        <div className="lg:col-span-8 space-y-12">
           <div className="flex items-end justify-between px-4">
              <div>
                <h3 className="text-4xl font-black tracking-tighter">Operational Plan</h3>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-2">Architecture Sequencing</p>
              </div>
              <div className="hidden md:block bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{pkg.itinerary.length} Experience Blocks</div>
           </div>

           <div className="space-y-10">
              {pkg.itinerary.map((day) => (
                <div key={day.day} className="bg-white p-10 md:p-14 rounded-[3.5rem] card-shadow border border-slate-100 space-y-10 group hover:shadow-2xl hover:border-blue-100/50 transition-all">
                  <div className="flex items-center space-x-6">
                     <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl group-hover:bg-blue-600 transition-colors">
                       {day.day}
                     </div>
                     <div>
                       <h4 className="text-2xl font-black text-slate-900 tracking-tight">Cycle Phase {day.day}</h4>
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Multi-Node Interaction</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {day.activities.map((act, i) => (
                      <div key={i} className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-between hover:bg-white hover:shadow-lg transition-all min-h-[180px]">
                        <p className="text-slate-700 text-sm font-bold leading-relaxed mb-6">{act}</p>
                        <div className="flex flex-col space-y-3 pt-6 border-t border-slate-200/40">
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Feedback Node</span>
                          <StarRating id={`day-${day.day}-act-${i}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
           </div>

           {/* Transit architecture - Horizontal on desktop */}
           <div className="space-y-6 pt-10">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Logistic Transit Nodes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {pkg.transport.map((t, i) => (
                    <div key={i} className="bg-[#0f172a] text-white p-10 rounded-[3rem] flex flex-col justify-between space-y-10 shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <i className={`fas ${getTransportIcon(t.mode)} text-9xl`}></i>
                       </div>
                       
                       <div className="flex justify-between items-start relative z-10">
                          <div className="flex items-center space-x-6">
                             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                <i className={`fas ${getTransportIcon(t.mode)} text-xl`}></i>
                             </div>
                             <div>
                               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] leading-none mb-2">{t.provider}</p>
                               <p className="text-xl font-black tracking-tight">{t.origin} &rarr; {t.destination}</p>
                             </div>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400">{t.status}</span>
                       </div>
                       
                       {t.mode !== 'Cab' ? (
                         <div className="flex items-center justify-between pt-8 border-t border-white/5 relative z-10">
                            <div>
                               <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">DEPARTURE</p>
                               <p className="text-lg font-black">{t.departure_time}</p>
                            </div>
                            <div className="flex-grow border-b-2 border-dashed border-white/10 mx-10 relative">
                               <i className="fas fa-chevron-right absolute -right-2 top-[-7px] text-[10px] text-white/10"></i>
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">ARRIVAL</p>
                               <p className="text-lg font-black">{t.arrival_time}</p>
                            </div>
                         </div>
                       ) : (
                         <div className="pt-8 border-t border-white/5 relative z-10">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">REFERENCE NODE</p>
                            <p className="text-base font-black tracking-widest text-blue-400 font-mono">{t.reference_number}</p>
                         </div>
                       )}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
