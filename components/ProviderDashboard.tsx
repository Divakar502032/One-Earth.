
import React, { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus } from '../services/bookingStore';
import { BookingRecord } from '../types';

const ProviderDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const handleStatusChange = (id: string, status: BookingRecord['status']) => {
    updateBookingStatus(id, status);
    setBookings(getBookings());
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Operations Center</p>
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter">Global Pipeline</h2>
        </div>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Active Intake</span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-24 text-center space-y-6 card-shadow border border-slate-50">
          <div className="w-20 h-20 bg-slate-50 text-slate-100 rounded-[2rem] flex items-center justify-center mx-auto">
            <i className="fas fa-radar text-3xl"></i>
          </div>
          <div className="space-y-2">
            <p className="text-slate-900 font-black tracking-tight text-xl">System Standby</p>
            <p className="text-slate-400 text-sm font-medium">No incoming architecture requests detected in your region.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-[3rem] card-shadow border border-slate-50 overflow-hidden group hover:border-blue-100 transition-all">
              <div className="flex flex-col lg:flex-row items-stretch">
                
                {/* Meta Column */}
                <div className="lg:w-1/3 bg-slate-50/50 p-10 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between">
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Transaction Ref</p>
                        <p className="font-mono text-[10px] font-bold text-blue-600 leading-none">{booking.id}</p>
                     </div>
                     <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fulfillment Status</p>
                        <div className="relative group/sel">
                          <select 
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value as any)}
                            className={`w-full px-5 py-4 rounded-2xl border-none font-black text-[10px] uppercase tracking-widest appearance-none outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all ${
                              booking.status === 'Fulfilled' ? 'bg-emerald-500 text-white' :
                              booking.status === 'Confirmed' ? 'bg-blue-600 text-white' :
                              'bg-white text-slate-900 border border-slate-100'
                            }`}
                          >
                            <option value="Pending">Queue</option>
                            <option value="Confirmed">Processing</option>
                            <option value="Fulfilled">Dispatched</option>
                          </select>
                          <i className={`fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none ${booking.status === 'Pending' ? 'text-slate-400' : 'text-white/60'}`}></i>
                        </div>
                     </div>
                  </div>
                  <div className="pt-8 border-t border-slate-200/50">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Received</p>
                     <p className="text-xs font-black text-slate-900 mt-1">{new Date(booking.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                </div>

                {/* Info Column */}
                <div className="lg:w-2/3 p-10 md:p-14 space-y-12">
                   <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{booking.package.destination} Package</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Customer: Traveler Anonymous</p>
                      </div>
                      <div className="text-right">
                         <p className="text-3xl font-black text-slate-900 leading-none">{booking.package.currency} {booking.package.total_estimated_price.toLocaleString()}</p>
                         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-2">Billed Total</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-between h-32">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Accommodation</p>
                         <p className="text-xs font-black text-slate-800 leading-tight line-clamp-2">{booking.package.accommodation.name}</p>
                      </div>
                      {booking.package.transport.slice(0, 2).map((t, idx) => (
                        <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-between h-32">
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{t.mode} Logistics</p>
                           <p className="text-xs font-black text-slate-800 leading-tight line-clamp-2">{t.provider}</p>
                        </div>
                      ))}
                   </div>

                   <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs">
                           <i className="fas fa-shield-halved"></i>
                         </div>
                         <div className="hidden sm:block">
                           <p className="text-[10px] font-black text-slate-900 uppercase">Automated Dispatch</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID: 0x92-TR</p>
                         </div>
                      </div>
                      <button className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] hover:text-blue-600 transition-colors">
                         Full Dossier <i className="fas fa-arrow-right ml-2 text-[8px]"></i>
                      </button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
