
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
      <div className="flex space-x-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={(e) => { e.stopPropagation(); handleRate(id, star); }}
            className={`transition-all transform active:scale-125 ${star <= currentRating ? 'text-amber-400' : 'text-slate-200'}`}
          >
            <i className={`${star <= currentRating ? 'fas' : 'far'} fa-star text-[10px]`}></i>
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
        onConfirm(); // Trigger parent success logic
      }
    } catch (err) {
      setVaultStep('details');
      alert("Payment failed. Please retry.");
    }
  };

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
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* TRANSACTION VAULT */}
      {showVault && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => vaultStep === 'details' && setShowVault(false)}></div>
          <div className="relative bg-slate-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col animate-in zoom-in duration-300">
            
            <div className="p-8 space-y-8 flex-grow">
              {vaultStep === 'details' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center space-y-1">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Secure Vault</p>
                    <h3 className="text-2xl font-black text-white tracking-tighter">Identity & Payment</h3>
                  </div>

                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-white/40">
                      <span className="text-[9px] font-bold uppercase tracking-widest">Amount Payable</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest">One Earth.</span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-black text-white">{pkg.currency} {pkg.total_estimated_price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Select Method</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(['upi', 'debit', 'credit'] as PaymentMethod[]).map((m) => (
                        <button 
                          key={m}
                          onClick={() => setPaymentDetails(prev => ({ ...prev, method: m }))}
                          className={`py-4 rounded-2xl border-2 font-black text-[9px] uppercase tracking-widest transition-all ${paymentDetails.method === m ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 bg-white/5 text-white/30'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentDetails.method === 'upi' ? (
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="Enter VPA (e.g. user@bank)"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, vpa: e.target.value }))}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, bank: e.target.value }))}
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="SBI Global">SBI Global</option>
                        <option value="Chase Preferred">Chase Preferred</option>
                      </select>
                    </div>
                  )}

                  <button 
                    onClick={startPayment}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/40 flex items-center justify-center space-x-3 transition-all active:scale-95"
                  >
                    <i className="fas fa-fingerprint"></i>
                    <span className="text-sm uppercase tracking-widest">Authorize Payment</span>
                  </button>
                </div>
              )}

              {vaultStep === 'processing' && (
                <div className="h-full flex flex-col items-center justify-center py-20 space-y-10 animate-in fade-in duration-300">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <i className="fas fa-shield-halved text-blue-500 text-2xl animate-pulse"></i>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-white font-black tracking-tight text-xl">Processing Transaction</p>
                    <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10">
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest animate-pulse">{statusMsg}</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">Encrypted Session Active</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden aspect-[16/9] sm:aspect-[21/9] shadow-2xl group">
        <img 
          src={`https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200`} 
          alt={pkg.destination} 
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
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
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-5 rounded-3xl text-right shadow-2xl">
             <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Total Package</p>
             <p className="text-3xl font-black text-white">{pkg.currency} {pkg.total_estimated_price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Logistics Panel */}
        <div className="lg:col-span-4 space-y-6">
          <button 
            onClick={() => setShowVault(true)}
            className="w-full bg-slate-900 text-white py-8 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex flex-col items-center group relative overflow-hidden active:scale-95 transition-all"
          >
            <span>Confirm & Secure</span>
            <span className="text-[8px] opacity-40 mt-2">Connect with Banks</span>
            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform -z-10"></div>
          </button>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-50 card-shadow space-y-4">
             <div className="flex justify-between items-start">
               <div>
                 <span className="text-[9px] font-black uppercase text-slate-300">Base Camp</span>
                 <p className="font-black text-slate-800 text-lg leading-tight mt-1">{pkg.accommodation.name}</p>
               </div>
               <i className="fas fa-hotel text-slate-200"></i>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-xs font-bold text-blue-600">{pkg.currency} {pkg.accommodation.price_per_night} / nt</span>
               <StarRating id="accommodation" />
             </div>
          </div>

          {pkg.local_events && pkg.local_events.length > 0 && (
            <div className="bg-blue-600/5 border border-blue-600/10 p-8 rounded-[2rem] space-y-6 animate-pulse">
               <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Live Grounding</h4>
               <div className="space-y-4">
                  {pkg.local_events.slice(0, 2).map((e, idx) => (
                    <div key={idx}>
                      <p className="font-black text-slate-800 text-xs">{e.title}</p>
                      <p className="text-[9px] text-slate-400 mt-1">{e.date_time}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Itinerary Panel */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-black tracking-tight">Daily Architecture</h3>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{pkg.itinerary.length} Days</div>
           </div>

           <div className="space-y-6">
              {pkg.itinerary.map((day) => (
                <div key={day.day} className="bg-white p-8 rounded-[2.5rem] card-shadow border border-slate-50 space-y-6 relative overflow-hidden">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg">
                       {day.day}
                     </div>
                     <h4 className="text-xl font-black text-slate-800 tracking-tight">Phase Cycle</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {day.activities.map((act, i) => (
                      <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between hover:border-blue-100 transition-colors">
                        <p className="text-slate-600 text-sm font-medium leading-relaxed mb-4">{act}</p>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200/40">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Rate Experience</span>
                          <StarRating id={`day-${day.day}-act-${i}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
           </div>

           {/* Transit architecture */}
           <div className="space-y-4 pt-10">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2">Transit Nodes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {pkg.transport.map((t, i) => (
                    <div key={i} className="bg-slate-900 text-white p-6 rounded-[2rem] flex flex-col justify-between space-y-6 shadow-2xl">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <i className={`fas ${getTransportIcon(t.mode)} text-sm`}></i>
                             </div>
                             <div>
                               <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">{t.provider}</p>
                               <p className="text-sm font-black tracking-tight">{t.origin} &rarr; {t.destination}</p>
                             </div>
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full text-white/50">{t.status}</span>
                       </div>
                       
                       {t.mode !== 'Cab' && (
                         <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div>
                               <p className="text-[8px] font-black text-white/20 uppercase">Dep</p>
                               <p className="text-xs font-black">{t.departure_time}</p>
                            </div>
                            <div className="flex-grow border-b border-dashed border-white/10 mx-6"></div>
                            <div className="text-right">
                               <p className="text-[8px] font-black text-white/20 uppercase">Arr</p>
                               <p className="text-xs font-black">{t.arrival_time}</p>
                            </div>
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
