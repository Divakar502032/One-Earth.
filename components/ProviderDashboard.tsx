
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
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Fulfillment Pipeline</h2>
          <p className="text-slate-400 font-medium text-sm mt-1">Manage partner-sourced bookings across the globe.</p>
        </div>
        <div className="bg-blue-600/5 px-4 py-2 rounded-2xl border border-blue-600/10 flex items-center space-x-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
           <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
           <span>Feed Active</span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-24 text-center space-y-4">
          <i className="fas fa-inbox text-slate-100 text-6xl"></i>
          <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-xs">Waiting for Architecture Synthesis</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Status Column */}
                <div className="lg:col-span-3 bg-slate-50/50 p-8 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital PNR</p>
                      <p className="font-mono text-[10px] text-blue-600 font-bold break-all">{booking.id}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline State</p>
                      <select 
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value as any)}
                        className={`w-full px-4 py-3 rounded-2xl border-none font-bold text-xs appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 shadow-sm ${
                          booking.status === 'Fulfilled' ? 'bg-emerald-500 text-white' :
                          booking.status === 'Confirmed' ? 'bg-blue-500 text-white' :
                          'bg-white text-slate-900 border border-slate-200'
                        }`}
                      >
                        <option value="Pending">Queue</option>
                        <option value="Confirmed">Processing</option>
                        <option value="Fulfilled">Dispatched</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4 flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(booking.timestamp).toLocaleDateString()} &middot; {new Date(booking.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>

                {/* Data Column */}
                <div className="lg:col-span-9 p-8 md:p-10 space-y-10">
                   <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                         <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{booking.package.destination} Trip</h3>
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Ref ID: {booking.id.slice(0,8)}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-2xl font-black text-slate-900 leading-none">{booking.package.currency} {booking.package.total_estimated_price.toLocaleString()}</p>
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mt-2">Billed Total</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <i className="fas fa-bed mr-2 opacity-30"></i> Lodging
                         </p>
                         <p className="text-sm font-black text-slate-800 leading-tight">{booking.package.accommodation.name}</p>
                      </div>
                      {booking.package.transport.slice(0, 2).map((t, idx) => (
                        <div key={idx} className="bg-slate-50 p-5 rounded-2xl space-y-3">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                             <i className={`fas ${t.mode === 'Flight' ? 'fa-plane' : 'fa-car'} mr-2 opacity-30`}></i> {t.mode}
                          </p>
                          <p className="text-sm font-black text-slate-800 leading-tight truncate">{t.provider}</p>
                        </div>
                      ))}
                   </div>

                   <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200"></div>
                        <span className="text-xs font-bold text-slate-500">Anonymous Traveler</span>
                      </div>
                      <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] hover:text-blue-800">
                        Expand Records &rarr;
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
