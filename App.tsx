
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import ProviderDashboard from './components/ProviderDashboard';
import { TravelPackage, BudgetProfile, AppView, SUPPORTED_CURRENCIES } from './types';
import { generateTravelPackage, detectCurrencyFromLocation } from './services/travelService';
import { saveBooking } from './services/bookingStore';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [packageData, setPackageData] = useState<TravelPackage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [view, setView] = useState<AppView>('traveler');
  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'profile'>('home');
  const [userCurrency, setUserCurrency] = useState('USD');
  const [userCoords, setUserCoords] = useState<{ latitude: number, longitude: number } | undefined>();

  useEffect(() => {
    // Request real-time location on open
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });
        const detected = await detectCurrencyFromLocation(latitude, longitude);
        // Check if detected is supported, otherwise default USD
        const isSupported = SUPPORTED_CURRENCIES.some(c => c.code === detected);
        setUserCurrency(isSupported ? detected : 'USD');
      }, (err) => {
        console.warn("Geolocation denied or failed:", err.message);
      });
    }
  }, []);

  const handleGenerate = async (city: string, depDate: string, retDate: string, budgetAmt: number, budgetProf: BudgetProfile, currency: string) => {
    setLoading(true);
    setError(null);
    setPackageData(null);
    setActiveTab('home');
    try {
      const data = await generateTravelPackage(city, depDate, retDate, budgetAmt, budgetProf, currency);
      setPackageData(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Global synthesis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!packageData) return;
    saveBooking(packageData);
    setShowSuccess(true);
  };

  const reset = () => {
    setPackageData(null);
    setShowSuccess(false);
    setError(null);
    setActiveTab('home');
  };

  return (
    <div className="flex flex-col min-h-screen">
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

      <main className="flex-grow pt-24 pb-32 max-w-7xl mx-auto w-full px-4 sm:px-6">
        {view === 'traveler' ? (
          <div className="animate-in fade-in duration-300">
            {activeTab === 'home' && (
              <>
                {!packageData && !showSuccess && (
                  <div className="text-center mb-10 space-y-4">
                    <h1 className="text-4xl sm:text-7xl font-black tracking-tighter leading-tight gradient-text">
                      Synthesized <br />Exploration.
                    </h1>
                    <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-lg mx-auto">
                      High-fidelity global travel architecture. Instant checkout in your localized currency.
                    </p>
                  </div>
                )}

                {!packageData && !showSuccess && (
                  <InputForm 
                    onSubmit={handleGenerate} 
                    isLoading={loading} 
                    initialCurrency={userCurrency}
                    coords={userCoords}
                  />
                )}

                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-center max-w-md mx-auto font-bold flex items-center justify-center space-x-2 animate-in zoom-in duration-200">
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
                  <div className="max-w-md mx-auto py-12 text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-200">
                      <i className="fas fa-check-double text-3xl"></i>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Settled & Confirmed.</h2>
                    <p className="text-slate-400 mb-10 text-sm font-medium leading-relaxed">
                      Your journey to <span className="text-slate-900 font-bold">{packageData?.destination}</span> has been architected and paid. Check your digital wallet.
                    </p>
                    <div className="space-y-4">
                      <button 
                        onClick={reset}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                      >
                        New Expedition
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'bookings' && (
              <div className="text-center py-24 opacity-30 flex flex-col items-center">
                <i className="fas fa-vault text-5xl mb-6"></i>
                <p className="text-xs font-black uppercase tracking-widest">Transaction History Encrypted</p>
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className="max-w-lg mx-auto bg-white rounded-[2.5rem] p-10 card-shadow animate-in slide-in-from-bottom-6 duration-300 border border-slate-50">
                <div className="flex items-center space-x-6 mb-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 shadow-sm">
                    <i className="fas fa-fingerprint text-slate-400 text-3xl"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-2xl tracking-tight">Lead Traveler</h3>
                    <p className="text-xs text-blue-600 font-black uppercase tracking-widest mt-1">Verified Global Node</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {['Financial Hub', 'Identity Vault', 'Travel Credentials', 'Carbon Credits'].map((item) => (
                    <div key={item} className="p-5 bg-slate-50 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-all group">
                      <span className="text-sm font-black text-slate-700 tracking-tight">{item}</span>
                      <i className="fas fa-chevron-right text-[10px] text-slate-300 group-hover:text-slate-900 transition-colors"></i>
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

      <nav className="glass fixed bottom-0 w-full z-[100] border-t border-slate-100 h-20 flex items-center justify-center px-6 safe-bottom">
        <div className="max-w-md w-full flex justify-between items-center px-2">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'home' ? 'text-blue-600 scale-110' : 'text-slate-300'}`}
          >
            <i className="fas fa-compass text-lg"></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">Architect</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'bookings' ? 'text-blue-600 scale-110' : 'text-slate-300'}`}
          >
            <i className="fas fa-vault text-lg"></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">Vault</span>
          </button>
          
          <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center shadow-2xl -mt-10 border-4 border-white active:scale-90 transition-transform cursor-pointer">
            <i className="fas fa-plus text-white text-lg"></i>
          </div>
          
          <button className="flex flex-col items-center space-y-1 text-slate-300">
            <i className="fas fa-radar text-lg"></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">Live</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'profile' ? 'text-blue-600 scale-110' : 'text-slate-300'}`}
          >
            <i className="fas fa-fingerprint text-lg"></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
