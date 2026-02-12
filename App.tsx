
import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import { TravelPackage, BudgetProfile } from './types';
import { generateTravelPackage, executeMockBooking } from './services/travelService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [packageData, setPackageData] = useState<TravelPackage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGenerate = async (city: string, days: number, budget: BudgetProfile) => {
    setLoading(true);
    setError(null);
    setPackageData(null);
    try {
      const data = await generateTravelPackage(city, days, budget);
      setPackageData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
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
        setShowSuccess(true);
      }
    } catch (err) {
      alert('Payment failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const reset = () => {
    setPackageData(null);
    setShowSuccess(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={reset}>
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-200">
                <i className="fas fa-paper-plane text-white"></i>
              </div>
              <span className="text-xl font-black text-slate-800 tracking-tight">One-Click Architect</span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-blue-600 transition-colors">How it works</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Destinations</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Pricing</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {!packageData && !showSuccess && (
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">
              Your Dream Trip, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Engineered in Seconds.
              </span>
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Stop searching, start traveling. Our AI architect creates 100% executable travel packages tailored to your budget.
            </p>
          </div>
        )}

        {!packageData && !showSuccess && (
          <InputForm onSubmit={handleGenerate} isLoading={loading} />
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-center max-w-2xl mx-auto">
            <i className="fas fa-exclamation-circle mr-2"></i> {error}
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
          <div className="max-w-2xl mx-auto mt-20 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100">
              <i className="fas fa-check text-4xl"></i>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">You're all set!</h2>
            <p className="text-slate-500 mb-10 text-lg">
              Your tickets and hotel vouchers for <strong>{packageData?.destination}</strong> have been sent to your email. Get packing!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={reset}
                className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                Plan Another Trip
              </button>
              <button className="bg-white border border-slate-200 text-slate-700 px-10 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
                Download PDF
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-100 py-10 text-center text-slate-400 text-sm">
        <p>&copy; 2024 One-Click Travel Architect. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
