
import React, { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus, updateSettlementStatus } from '../services/bookingStore';
import { BookingRecord, SettlementRecord } from '../types';

const ProviderDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'settlements' | 'payout_settings'>('pipeline');
  const [payoutBank, setPayoutBank] = useState('0x8821...9912 (Global Swift)');

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const handleStatusChange = (id: string, status: BookingRecord['status']) => {
    updateBookingStatus(id, status);
    setBookings(getBookings());
  };

  const handleSettle = (bookingId: string, providerName: string) => {
    updateSettlementStatus(bookingId, providerName, 'Settled');
    setBookings(getBookings());
  };

  const getTotalRevenueByCurrency = () => {
    const totals: Record<string, number> = {};
    bookings.forEach(b => {
      const curr = b.package.currency;
      totals[curr] = (totals[curr] || 0) + (b.package.total_estimated_price * 0.85);
    });
    return totals;
  };

  const revenueTotals = getTotalRevenueByCurrency();

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-top-4 duration-700 pb-32">
      {/* Dashboard Header - Responsive layout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 px-4 md:px-0">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
             <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></span>
             <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.5em]">Enterprise Operations Hub</p>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">Command Center.</h2>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-md p-2 rounded-[2rem] border border-slate-200 shadow-xl overflow-x-auto no-scrollbar w-full md:w-auto">
          {(['pipeline', 'settlements', 'payout_settings'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`whitespace-nowrap px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === t ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-0">
          {bookings.length === 0 ? (
            <div className="col-span-full bg-white rounded-[4rem] py-32 text-center card-shadow border border-slate-100 space-y-8">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                  <i className="fas fa-satellite-dish text-slate-200 text-4xl"></i>
               </div>
               <div>
                  <p className="text-slate-900 font-black text-2xl tracking-tight">Zero Activity Detected</p>
                  <p className="text-slate-400 text-sm font-medium mt-2 uppercase tracking-widest">Awaiting architecture synthesis triggers</p>
               </div>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-[3.5rem] card-shadow border border-slate-100 overflow-hidden hover:border-blue-300 transition-all group flex flex-col">
                <div className="p-10 md:p-14 space-y-10 flex-grow">
                   <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] block">Package Destination</span>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{booking.package.destination}</h3>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Gross Rev</span>
                         <p className="text-2xl font-black text-slate-900">{booking.package.currency} {booking.package.total_estimated_price.toLocaleString()}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between space-y-4 group-hover:bg-white transition-colors">
                         <i className="fas fa-hotel text-slate-200 text-xl"></i>
                         <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">HOSPITALITY</p>
                           <p className="text-xs font-black truncate">{booking.package.accommodation.name}</p>
                         </div>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between space-y-4 group-hover:bg-white transition-colors">
                         <i className="fas fa-plane text-slate-200 text-xl"></i>
                         <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TRANSIT</p>
                           <p className="text-xs font-black truncate">{booking.package.transport[0]?.provider || 'Local Transit'}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-50/80 p-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="flex items-center space-x-6">
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Reference</p>
                         <p className="font-mono text-[10px] font-bold text-slate-600 break-all">{booking.id}</p>
                      </div>
                      <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Phase Timestamp</p>
                         <p className="text-[10px] font-black text-slate-900">{new Date(booking.timestamp).toLocaleString()}</p>
                      </div>
                   </div>
                   
                   <div className="w-full sm:w-auto">
                      <select 
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value as any)}
                        className={`w-full sm:w-auto px-8 py-3 rounded-2xl border-none font-black text-[10px] uppercase tracking-[0.2em] appearance-none outline-none shadow-2xl transition-all cursor-pointer ${
                          booking.status === 'Fulfilled' ? 'bg-emerald-500 text-white' :
                          booking.status === 'Confirmed' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
                        }`}
                      >
                        <option value="Pending">INCOMING</option>
                        <option value="Confirmed">PROCESSING</option>
                        <option value="Fulfilled">DELIVERED</option>
                      </select>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'settlements' && (
        <div className="space-y-10 px-4 md:px-0 animate-in slide-in-from-bottom-10 duration-700">
           {/* Financial Overview Cards */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#0f172a] text-white p-12 rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] flex flex-col md:flex-row justify-between items-center gap-10 border border-white/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <i className="fas fa-vault text-9xl"></i>
                 </div>
                 <div className="space-y-6 text-center md:text-left relative z-10">
                    <div className="flex items-center space-x-3 justify-center md:justify-start">
                       <i className="fas fa-circle-dollar-to-slot text-blue-500"></i>
                       <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em]">Net Accrued Revenue</p>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(revenueTotals).length > 0 ? Object.entries(revenueTotals).map(([curr, val]) => (
                        <p key={curr} className="text-4xl md:text-6xl font-black tracking-tighter">{curr} {val.toLocaleString()}</p>
                      )) : <p className="text-5xl font-black tracking-tighter">0.00</p>}
                    </div>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest flex items-center justify-center md:justify-start">
                       <i className="fas fa-building-columns mr-3"></i>
                       Target Node: {payoutBank}
                    </p>
                 </div>
                 <button className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all relative z-10">
                   Execute Bulk Payout
                 </button>
              </div>

              <div className="bg-white p-12 rounded-[4rem] border border-slate-100 card-shadow flex flex-col justify-between space-y-8">
                 <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Health</span>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight">Node Integrity</h4>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                       <span className="text-xs font-bold text-slate-500">Global Uptime</span>
                       <span className="text-base font-black text-emerald-500">99.9%</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                       <span className="text-xs font-bold text-slate-500">Settlement Avg</span>
                       <span className="text-base font-black text-slate-900">1.2ms</span>
                    </div>
                    <div className="flex justify-between items-end pb-2">
                       <span className="text-xs font-bold text-slate-500">Platform Fee</span>
                       <span className="text-base font-black text-blue-600">10.0%</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Detailed Settlement List */}
           <div className="space-y-6">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6">Multi-Node Settlement Ledger</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {bookings.flatMap(b => b.settlements || []).map((s, idx) => (
                   <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 card-shadow hover:border-blue-100 transition-all flex flex-col justify-between space-y-8 group">
                      <div className="flex justify-between items-start">
                         <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <i className="fas fa-building-columns text-xl opacity-30 group-hover:opacity-100"></i>
                         </div>
                         <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${s.payoutStatus === 'Settled' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                           {s.payoutStatus}
                         </div>
                      </div>

                      <div className="space-y-2">
                         <p className="text-xl font-black text-slate-900 tracking-tight truncate">{s.providerName}</p>
                         <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">NET PAYABLE:</span>
                            <span className="text-sm font-black text-slate-900">{s.currency} {s.amount.toLocaleString()}</span>
                         </div>
                      </div>

                      {s.payoutStatus === 'Pending' && (
                        <button 
                          onClick={() => {
                            const b = bookings.find(book => book.settlements?.some(sett => sett.providerName === s.providerName));
                            if (b) handleSettle(b.id, s.providerName);
                          }}
                          className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                        >
                          Manual Release
                        </button>
                      )}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'payout_settings' && (
        <div className="max-w-3xl mx-auto px-4 md:px-0 space-y-12 animate-in zoom-in-95 duration-500">
           <div className="bg-white p-12 md:p-20 rounded-[4rem] card-shadow border border-slate-100 space-y-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
              
              <div className="space-y-4">
                <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-8">
                  <i className="fas fa-gears text-3xl"></i>
                </div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Settlement Infrastructure</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">Configuring the global node and routing logic for multi-party revenue splits.</p>
              </div>

              <div className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Default Settlement Destination (IBAN/SWIFT)</label>
                    <input 
                      type="text" 
                      value={payoutBank}
                      onChange={(e) => setPayoutBank(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-10 py-6 text-base font-bold text-slate-900 focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all shadow-inner"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 space-y-4">
                       <i className="fas fa-shield-check text-blue-500"></i>
                       <p className="text-xs text-blue-900 font-bold leading-relaxed uppercase tracking-wide">
                         Automatic Release Policy
                       </p>
                       <p className="text-[11px] text-blue-700 font-medium">
                         Funds are automatically authorized upon fulfillment verification by the client node.
                       </p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                       <i className="fas fa-percent text-slate-400"></i>
                       <p className="text-xs text-slate-900 font-bold leading-relaxed uppercase tracking-wide">
                         Platform Architecture Fee
                       </p>
                       <p className="text-[11px] text-slate-600 font-medium">
                         A fixed 10% synthesis fee is applied to all incoming global transit and hospitality nodes.
                       </p>
                    </div>
                 </div>
              </div>

              <button className="w-full bg-slate-900 hover:bg-blue-600 text-white py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all">
                Update Protocol Logic
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
