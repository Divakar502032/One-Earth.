
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
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Service Provider Portal</p>
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter">Enterprise Hub</h2>
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          {(['pipeline', 'settlements', 'payout_settings'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'pipeline' && (
        <div className="space-y-8 px-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-[3rem] py-24 text-center card-shadow border border-slate-50">
               <i className="fas fa-radar text-slate-100 text-6xl mb-6"></i>
               <p className="text-slate-900 font-black text-xl">Operational Silence</p>
               <p className="text-slate-400 text-sm mt-2">No incoming architecture requests currently active.</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-[3rem] card-shadow border border-slate-50 overflow-hidden hover:border-blue-100 transition-all group">
                <div className="flex flex-col lg:flex-row items-stretch">
                  <div className="lg:w-1/3 bg-slate-50/50 p-10 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between">
                    <div className="space-y-6">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Global Ref</p>
                          <p className="font-mono text-[10px] font-bold text-blue-600 break-all">{booking.id}</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Fulfillment Phase</p>
                          <select 
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value as any)}
                            className={`w-full px-5 py-3 rounded-2xl border-none font-black text-[10px] uppercase tracking-widest appearance-none outline-none shadow-sm ${
                              booking.status === 'Fulfilled' ? 'bg-emerald-500 text-white' :
                              booking.status === 'Confirmed' ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 border border-slate-100'
                            }`}
                          >
                            <option value="Pending">Incoming</option>
                            <option value="Confirmed">Processing</option>
                            <option value="Fulfilled">Delivered</option>
                          </select>
                       </div>
                    </div>
                    <div className="pt-8 border-t border-slate-200/50">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Intake Time</p>
                       <p className="text-xs font-black text-slate-900 mt-1">{new Date(booking.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="lg:w-2/3 p-10 md:p-14 space-y-10">
                     <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{booking.package.destination}</h3>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Multi-Node Logistics</p>
                        </div>
                        <div className="text-right">
                           <p className="text-3xl font-black text-slate-900">{booking.package.currency} {booking.package.total_estimated_price.toLocaleString()}</p>
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Gross Revenue</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
                           <i className="fas fa-hotel text-slate-300"></i>
                           <div>
                             <p className="text-[8px] font-black text-slate-400 uppercase">Hospitality Partner</p>
                             <p className="text-[10px] font-black">{booking.package.accommodation.name}</p>
                           </div>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
                           <i className="fas fa-plane text-slate-300"></i>
                           <div>
                             <p className="text-[8px] font-black text-slate-400 uppercase">Transit Lead</p>
                             <p className="text-[10px] font-black">{booking.package.transport[0]?.provider || 'Local Transit'}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'settlements' && (
        <div className="space-y-6 px-4 animate-in slide-in-from-bottom-4 duration-300">
           <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 border border-white/10">
              <div className="space-y-2 text-center md:text-left">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Accrued Revenue (Multi-Currency)</p>
                 {Object.entries(revenueTotals).length > 0 ? Object.entries(revenueTotals).map(([curr, val]) => (
                   <p key={curr} className="text-2xl sm:text-4xl font-black">{curr} {val.toLocaleString()}</p>
                 )) : <p className="text-2xl font-black">0.00</p>}
                 <p className="text-xs text-white/40 font-medium">Auto-settling to: {payoutBank}</p>
              </div>
              <button className="bg-blue-600 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/40 active:scale-95 transition-all">
                Trigger Bulk Payout
              </button>
           </div>

           <div className="grid grid-cols-1 gap-4">
              {bookings.flatMap(b => b.settlements || []).map((s, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 card-shadow flex flex-col sm:flex-row justify-between items-center gap-6 group hover:border-blue-50 transition-all">
                   <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                         <i className="fas fa-building-columns text-slate-300"></i>
                      </div>
                      <div>
                         <p className="text-lg font-black text-slate-900">{s.providerName}</p>
                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Net Payable: {s.currency} {s.amount.toLocaleString()}</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${s.payoutStatus === 'Settled' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {s.payoutStatus}
                      </div>
                      {s.payoutStatus === 'Pending' && (
                        <button 
                          onClick={() => {
                            const b = bookings.find(book => book.settlements?.some(sett => sett.providerName === s.providerName));
                            if (b) handleSettle(b.id, s.providerName);
                          }}
                          className="flex-grow sm:flex-grow-0 bg-slate-900 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
                        >
                          Release Funds
                        </button>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
      {/* Payout Settings Remains Same */}
      {activeTab === 'payout_settings' && (
        <div className="max-w-2xl mx-auto px-4 space-y-8 animate-in zoom-in duration-300">
           <div className="bg-white p-10 rounded-[3.5rem] card-shadow border border-slate-50 space-y-8">
              <div className="text-center space-y-1">
                <i className="fas fa-vault text-4xl text-blue-600 mb-4"></i>
                <h3 className="text-2xl font-black text-slate-900">Settlement Destination</h3>
                <p className="text-slate-400 text-sm font-medium">Configure where your node receives revenue.</p>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Bank Account (IBAN/SWIFT)</label>
                    <input 
                      type="text" 
                      value={payoutBank}
                      onChange={(e) => setPayoutBank(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/10 outline-none"
                    />
                 </div>

                 <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start space-x-4">
                    <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                    <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                      Providers receive funds automatically upon customer confirmation. A 10% platform architecture fee is deducted from gross revenue at settlement time.
                    </p>
                 </div>
              </div>

              <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                Update Payout Logic
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
