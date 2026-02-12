
import React, { useState, useEffect, useRef } from 'react';
import { BudgetProfile, SUPPORTED_CURRENCIES } from '../types';
import { getLocationSuggestions } from '../services/travelService';

interface InputFormProps {
  onSubmit: (city: string, depDate: string, retDate: string, budgetAmt: number, budgetProf: BudgetProfile, currency: string) => void;
  isLoading: boolean;
  initialCurrency?: string;
  coords?: { latitude: number, longitude: number };
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, initialCurrency, coords }) => {
  const [city, setCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [budgetAmount, setBudgetAmount] = useState<number>(2500);
  const [budgetProfile, setBudgetProfile] = useState<BudgetProfile>('Mid-Range');
  const [currency, setCurrency] = useState(initialCurrency || 'USD');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const suggestionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialCurrency) setCurrency(initialCurrency);
  }, [initialCurrency]);

  const handleCityChange = (val: string) => {
    setCity(val);
    setShowSuggestions(true);
    
    if (suggestionTimeoutRef.current) window.clearTimeout(suggestionTimeoutRef.current);
    
    if (val.length < 3) {
      setSuggestions([]);
      return;
    }

    suggestionTimeoutRef.current = window.setTimeout(async () => {
      setIsSuggesting(true);
      const items = await getLocationSuggestions(val, coords?.latitude, coords?.longitude);
      setSuggestions(items);
      setIsSuggesting(false);
    }, 600);
  };

  const selectSuggestion = (s: string) => {
    setCity(s);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() && departureDate && returnDate) {
      onSubmit(city, departureDate, returnDate, budgetAmount, budgetProfile, currency);
    }
  };

  const currentCurrency = SUPPORTED_CURRENCIES.find(c => c.code === currency);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto space-y-8 relative">
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 card-shadow border border-slate-100 space-y-8 relative z-[50]">
        
        {/* Main Location Input - Larger on Desktop */}
        <div className="relative group">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
            <i className="fas fa-map-location-dot text-2xl"></i>
          </div>
          <input
            type="text"
            required
            autoComplete="off"
            placeholder="Search Global Destination..."
            className="w-full bg-slate-50 border border-slate-100 pl-20 pr-8 py-7 rounded-[2rem] focus:ring-4 focus:ring-blue-500/5 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 sm:text-2xl"
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            onFocus={() => city.length >= 3 && setShowSuggestions(true)}
          />
          
          {/* Suggestions Dropdown - Optimized width */}
          {showSuggestions && (suggestions.length > 0 || isSuggesting) && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden z-[60] animate-in slide-in-from-top-4 duration-300">
              {isSuggesting && (
                <div className="p-8 flex items-center justify-center space-x-4">
                   <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-xs font-black uppercase tracking-widest text-slate-500">Scanning Satellite Feeds...</span>
                </div>
              )}
              {!isSuggesting && suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSuggestion(s)}
                  className="w-full text-left px-10 py-6 hover:bg-slate-900 hover:text-white transition-all flex items-center space-x-6 border-b border-slate-50 last:border-none group/item"
                >
                  <i className="fas fa-location-arrow text-sm opacity-20 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all"></i>
                  <span className="text-base font-bold tracking-tight">{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Financial Config - Horizontal on laptop */}
          <div className="md:col-span-12 lg:col-span-6 flex items-center space-x-3 bg-slate-50/80 p-3 rounded-3xl border border-slate-100">
            <div className="relative flex-shrink-0">
              <select
                className="bg-white border border-slate-200 px-4 py-4 rounded-2xl font-black text-xs uppercase text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none appearance-none cursor-pointer"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {SUPPORTED_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
            <div className="relative flex-grow">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">{currentCurrency?.symbol}</span>
              <input
                type="number"
                required
                className="w-full bg-white border border-slate-200 pl-10 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none font-bold text-slate-800 text-sm"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(Number(e.target.value))}
              />
            </div>
            <select
              className="flex-shrink-0 bg-white border border-slate-200 px-6 py-4 rounded-2xl font-black text-xs uppercase text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none cursor-pointer"
              value={budgetProfile}
              onChange={(e) => setBudgetProfile(e.target.value as BudgetProfile)}
            >
              <option value="Budget">ECONOMY</option>
              <option value="Mid-Range">MID-LEVEL</option>
              <option value="Luxury">PLATINUM</option>
            </select>
          </div>

          {/* Temporal Config - Optimized for side-by-side */}
          <div className="md:col-span-6 lg:col-span-3 relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-black uppercase tracking-widest pointer-events-none group-focus-within:text-blue-500 transition-colors">Out</span>
            <input
              type="date"
              required
              className="w-full bg-slate-50 border border-slate-100 pl-16 pr-4 py-5 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:bg-white outline-none font-bold text-slate-800 text-sm transition-all"
              value={departureDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>

          <div className="md:col-span-6 lg:col-span-3 relative group">
             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-black uppercase tracking-widest pointer-events-none group-focus-within:text-blue-500 transition-colors">Return</span>
            <input
              type="date"
              required
              className="w-full bg-slate-50 border border-slate-100 pl-20 pr-4 py-5 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:bg-white outline-none font-bold text-slate-800 text-sm transition-all"
              value={returnDate}
              min={departureDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto md:min-w-[400px] bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-black text-sm md:text-base uppercase tracking-[0.4em] py-8 rounded-[2rem] shadow-2xl transition-all transform active:scale-95 flex items-center justify-center space-x-4 group"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Generating Core Architecture...</span>
            </>
          ) : (
            <>
              <i className="fas fa-microchip group-hover:rotate-180 transition-transform duration-500"></i>
              <span>Synthesize Package</span>
            </>
          )}
        </button>
        
        <div className="flex items-center space-x-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
           <span className="flex items-center space-x-2">
             <i className="fas fa-globe-americas text-blue-500"></i>
             <span>Global Node Synthesis</span>
           </span>
           <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
           <span className="flex items-center space-x-2">
             <i className="fas fa-vault text-emerald-500"></i>
             <span>{currency} Ledger</span>
           </span>
        </div>
      </div>
    </form>
  );
};

export default InputForm;
