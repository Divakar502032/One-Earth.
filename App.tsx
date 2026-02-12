
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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });
        const detected = await detectCurrencyFromLocation(latitude, longitude);
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
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Header - Adaptive height and blur */}
      <header className="glass fixed top-0 w-full z-[100] border-b border-slate-200/50 h-16 md:h-20 flex items-center px-4 md:px-10">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={reset}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${view === 'traveler' ? 'bg-slate-900 group-hover:bg-blue-600' : 'bg-blue-600 group-hover:bg-slate-900'}`}>
              <i className={`fas ${view === 'traveler' ? 'fa-earth-asia' : 'fa-briefcase'} text-white text-sm`}></i>
            </div>
            <span className="text-lg font-black tracking-tighter uppercase hidden sm:block">One Earth.</span>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setView(v => v === 'traveler' ? 'provider' : 'traveler')}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-all flex items-center space-x-2 border border-slate-200/50"
            >
              <i className={`fas ${view === 'traveler' ? 'fa-building-shield' : 'fa-user-astronaut'} text-[10px]`}></i>
              <span className="hidden md:inline">{view === 'traveler' ? 'Provider Dashboard' : 'Traveler Portal'}</span>
              <span className="md:hidden">{view === 'traveler' ? 'Provider' : 'Traveler'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Improved desktop padding */}
      <main className="flex-grow pt-24 md:pt-32 pb-32 md:pb-40 max-w-7xl mx-auto w-full px-4 md:px-10">
        {view === 'traveler' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'home' && (
              <div className="space-y-12">
                {!packageData && !showSuccess && (
                  <div className="text-center space-y-4 md:space-y-6">
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none gradient-text">
                      Travel <br className="md:hidden" /> Synthesis.
                    </h1>
                    <p className="text-slate-400 font-medium text-sm md:text-lg max-w-xl mx-auto">
                      Architect your next journey with high-fidelity logistics and localized financial settlements.
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
                  <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-rose-600 text-center max-w-md mx-auto font-bold flex flex-col items-center justify-center space-y-2 animate-in zoom-in duration-300">
                    <i className="fas fa-triangle-exclamation text-xl mb-2"></i>
                    <span className="text-xs uppercase tracking-widest">Synthesis Error</span>
                    <span className="text-sm">{error}</span>
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
                  <div className="max-w-xl mx-auto py-20 text-center animate-in zoom-in duration-500 bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10">
                    <div className="w-28 h-28 bg-emerald-500 text-white rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200">
                      <i className="fas fa-check-double text-4xl"></i>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">Mission Success.</h2>
                    <p className="text-slate-500 mb-10 text-base md:text-lg font-medium leading-relaxed">
                      Your expedition to <span className="text-slate-900 font-bold">{packageData?.destination}</span> has been architected, settled, and confirmed in your local ledger.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={reset}
                        className="bg-slate-900 text-white py-5 px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                      >
                        New Journey
                      </button>
                      <button 
                        onClick={() => setActiveTab('bookings')}
                        className="bg-slate-100 text-slate-600 py-5 px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                      >
                        View Vault
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="max-w-4xl mx-auto py-24 text-center space-y-8">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto border border-slate-200">
                  <i className="fas fa-vault text-slate-300 text-3xl"></i>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900">Encrypted Archives</h3>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Transaction History Offline</p>
                </div>
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto bg-white rounded-[3.5rem] p-8 md:p-14 card-shadow animate-in slide-in-from-bottom-10 duration-500 border border-slate-100">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10 mb-12">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-200 shadow-inner group">
                    <i className="fas fa-fingerprint text-slate-300 group-hover:text-blue-500 text-4xl transition-colors"></i>
                  </div>
                  <div className="text-center md:text-left space-y-2">
                    <h3 className="font-black text-3xl md:text-4xl tracking-tight">Global Node #8821</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">Verified Identity</span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Settlement Ready</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Financial Ledger', 'Security Keys', 'Travel Credentials', 'Carbon Offset', 'Linked Wallets', 'Privacy Nodes'].map((item) => (
                    <div key={item} className="p-6 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-100 rounded-3xl border border-slate-100 flex justify-between items-center cursor-pointer transition-all group">
                      <span className="text-sm font-black text-slate-700 tracking-tight">{item}</span>
                      <i className="fas fa-arrow-right-long text-[10px] text-slate-300 group-hover:text-blue-600 transition-all translate-x-[-4px] group-hover:translate-x-0"></i>
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

      {/* Navigation - Adaptive Dock Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-8 flex justify-center pointer-events-none">
        <div className="glass max-w-md w-full h-20 md:h-22 rounded-[2.5rem] flex justify-between items-center px-6 md:px-10 border border-slate-200/50 shadow-2xl pointer-events-auto">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'home' ? 'text-blue-600 scale-110' : 'text-slate-300 hover:text-slate-500'}`}
          >
            <i className="fas fa-compass text-lg md:text-xl"></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">Explore</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'bookings' ? 'text-blue-600 scale-110' : 'text-slate-300 hover:text-slate-500'}`}
          >
            <i className="fas fa-shield-halved text-lg md:text-xl"></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">Archives</span>
          </button>
          
          <div className="relative">
            <div 
              onClick={reset}
              className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl -mt-16 border-4 border-white hover:bg-blue-600 hover:scale-110 transition-all cursor-pointer group"
            >
              <i className="fas fa-plus text-xl group-hover:rotate-90 transition-transform"></i>
            </div>
          </div>
          
          <button className="flex flex-col items-center space-y-1 text-slate-300 hover:text-slate-500 transition-colors">
            <i className="fas fa-radar text-lg md:text-xl"></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">Feeds</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'profile' ? 'text-blue-600 scale-110' : 'text-slate-300 hover:text-slate-500'}`}
          >
            <i className="fas fa-id-card-clip text-lg md:text-xl"></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
