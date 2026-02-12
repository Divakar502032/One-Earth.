
import React, { useState } from 'react';
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

  const handleGenerate = async (city: string, depDate: string, retDate: string, budgetAmt: number, budgetProf: BudgetProfile) => {
    setLoading(true);
    setError(null);
    setPackageData(null);
    try {
      const data = await generateTravelPackage(city, depDate, retDate, budgetAmt, budgetProf);
      setPackageData(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Architecture failed. Please try a different spot or budget.');
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
      alert('One-click booking encountered an issue. Our concierge is looking into it.');
    } finally {
      setBooking(false);
    }
  };

  const reset = () => {
    setPackageData(null);
    setShowSuccess(false);
    setError(null);
  };

  const toggleView = () => {
    setView(v => v === 'traveler' ? 'provider' : 'traveler');
    reset();
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Premium Navbar */}
      <nav className="glass sticky top-0 z-[60] border-b border-slate-200/40 px-6 h-20 flex items-center justify-center">
        <div className="max-w-7xl w-full flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={reset}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:rotate-6 shadow-sm ${view === 'traveler' ? 'bg-slate-900' : 'bg-blue-600'}`}>
              <i className={`fas ${view === 'traveler' ? 'fa-earth-asia' : 'fa-briefcase'} text-white text-lg`}></i>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">One Earth</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {view === 'traveler' ? 'Architecture Studio' : 'Partner Network'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            <button 
              onClick={() => view !== 'traveler' && toggleView()}
              className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'traveler' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Explore
            </button>
            <button 
              onClick={() => view !== 'provider' && toggleView()}
              className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'provider' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Partners
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12 sm:mt-20">
        {view === 'traveler' ? (
          <>
            {!packageData && !showSuccess && (
              <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
                <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  Travel in <br />
                  <span className="gradient-text">One Click.</span>
                </h1>
                <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">
                  We architect complete journeys. Flights, hotels, and experiences synthesized in seconds.
                </p>
              </div>
            )}

            {!packageData && !showSuccess && (
              <div className="pb-20">
                <InputForm onSubmit={handleGenerate} isLoading={loading} />
              </div>
            )}

            {error && (
              <div className="mt-8 p-5 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 text-center max-w-md mx-auto font-bold flex items-center justify-center space-x-3 animate-in zoom-in">
                <i className="fas fa-exclamation-circle text-lg"></i>
                <span>{error}</span>
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
              <div className="max-w-xl mx-auto py-20 text-center animate-in zoom-in duration-700">
                <div className="w-24 h-24 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-200 animate-bounce">
                  <i className="fas fa-paper-plane text-3xl"></i>
                </div>
                <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Skybound.</h2>
                <p className="text-slate-500 mb-12 text-lg font-medium">
                  Your full trip to <span className="text-slate-900 font-bold">{packageData?.destination}</span> is booked. Check your inbox for the magic key.
                </p>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={reset}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                  >
                    Start New Journey
                  </button>
                  <button className="w-full bg-white border border-slate-200 text-slate-500 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all">
                    Download All Vouchers
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <ProviderDashboard />
        )}
      </main>

      <footer className="mt-32 border-t border-slate-100 py-16 text-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          One Earth &copy; 2024 &bull; Built with Gemini 3.0
        </p>
      </footer>
    </div>
  );
};

export default App;
