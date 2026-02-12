
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import ProviderDashboard from './components/ProviderDashboard';
import { TravelPackage, BudgetProfile, AppView } from './types';
import { generateTravelPackage, executeMockBooking } from './services/travelService';
import { saveBooking } from './services/bookingStore';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [packageData, setPackageData] = useState<TravelPackage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [view, setView] = useState<AppView>('traveler');
  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'profile'>('home');

  const handleGenerate = async (city: string, depDate: string, retDate: string, budgetAmt: number, budgetProf: BudgetProfile) => {
    setLoading(true);
    setError(null);
    setPackageData(null);
    setActiveTab('home');
    try {
      const data = await generateTravelPackage(city, depDate, retDate, budgetAmt, budgetProf);
      setPackageData(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Global synthesis failed. Our satellites are readjusting.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!packageData) return;
    setBooking(true);
    try {
      const success = await executeMockBooking(packageData.booking_payload);
      if (success) {
        saveBooking(packageData);
        setShowSuccess(true);
      }
    } catch (err) {
      setError('Secure transaction interrupted. Check connection.');
    } finally {
      setBooking(false);
    }
  };

  const reset = () => {
    setPackageData(null);
    setShowSuccess(false);
    setError(null);
    setActiveTab('home');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Fixed & Minimal */}
      <header className="glass fixed top-0 w-full z-[100] border-b border-slate-100 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={reset}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${view === 'traveler' ? 'bg-slate-900' : 'bg-blue-600'}`}>
              <i className={`fas ${view === 'traveler' ? 'fa-earth-asia' : 'fa-briefcase'} text-white text-xs`}></i>
            </div>
            <span className="text-sm font-black tracking-tighter uppercase">One Earth.</span>
          </div>

          <button 
            onClick={() => setView(v => v === 'traveler' ? 'provider' : 'traveler')}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center space-x-2"
          >
            <span>{view === 'traveler' ? 'Provider Portal' : 'Traveler Mode'}</span>
            <i className="fas fa-chevron-right text-[8px]"></i>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-32 max-w-7xl mx-auto w-full px-4 sm:px-6">
        {view === 'traveler' ? (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'home' && (
              <>
                {!packageData && !showSuccess && (
                  <div className="text-center mb-12 space-y-4">
                    <h1 className="text-4xl sm:text-7xl font-black tracking-tighter leading-tight gradient-text">
                      Architecting the <br />Future of Travel.
                    </h1>
                    <p className="text-slate-400 font-medium text-sm sm:text-base max-w-lg mx-auto">
                      Generate ready-to-book global itineraries in seconds.
                    </p>
                  </div>
                )}

                {!packageData && !showSuccess && (
                  <InputForm onSubmit={handleGenerate} isLoading={loading} />
                )}

                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-center max-w-md mx-auto font-bold flex items-center justify-center space-x-2 animate-in zoom-in">
                    <i className="fas fa-circle-exclamation"></i>
                    <span className="text-xs">{error}</span>
                  </div>
                )}

                {packageData && !showSuccess && (
                  <ItineraryDisplay 
                    pkg={packageData} 
                    onConfirm={handleConfirm} 
                    isConfirming={booking} 
                  />
                )}

                {showSuccess && (
                  <div className="max-w-md mx-auto py-12 text-center animate-in zoom-in duration-700">
                    <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-200">
                      <i className="fas fa-paper-plane text-2xl"></i>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Ticketed.</h2>
                    <p className="text-slate-400 mb-10 text-sm font-medium">
                      Your journey to <span className="text-slate-900 font-bold">{packageData?.destination}</span> is officially architected and confirmed.
                    </p>
                    <div className="space-y-3">
                      <button 
                        onClick={reset}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black shadow-lg"
                      >
                        New Expedition
                      </button>
                      <button className="w-full py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        View Digital Wallet
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'bookings' && (
              <div className="text-center py-20 opacity-40">
                <i className="fas fa-book-open text-4xl mb-4"></i>
                <p className="text-xs font-black uppercase tracking-widest">Your past adventures will appear here</p>
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 card-shadow">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-user text-slate-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Traveler Profile</h3>
                    <p className="text-xs text-slate-400">Verified Global Account</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {['Digital Identity', 'Payment Methods', 'Sustainability Credits', 'Travel Docs'].map((item) => (
                    <div key={item} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors">
                      <span className="text-sm font-bold text-slate-700">{item}</span>
                      <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <ProviderDashboard />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="glass fixed bottom-0 w-full z-[100] border-t border-slate-100 h-20 flex items-center justify-center px-6 safe-bottom">
        <div className="max-w-md w-full flex justify-between items-center">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'home' ? 'text-blue-600 scale-110' : 'text-slate-300'}`}
          >
            <i className={`fas ${activeTab === 'home' ? 'fa-house' : 'fa-house-user'} text-lg`}></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">Explore</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'bookings' ? 'text-blue-600 scale-110' : 'text-slate-300'}`}
          >
            <i className={`fas ${activeTab === 'bookings' ? 'fa-calendar-check' : 'fa-calendar'} text-lg`}></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">My Trips</span>
          </button>
          
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center shadow-xl shadow-slate-200 -mt-10 border-4 border-white">
            <i className="fas fa-plus text-white text-sm"></i>
          </div>
          
          <button 
            className="flex flex-col items-center space-y-1 text-slate-300"
          >
            <i className="fas fa-magnifying-glass text-lg"></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">Search</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'profile' ? 'text-blue-600 scale-110' : 'text-slate-300'}`}
          >
            <i className={`fas ${activeTab === 'profile' ? 'fa-circle-user' : 'fa-user'} text-lg`}></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
